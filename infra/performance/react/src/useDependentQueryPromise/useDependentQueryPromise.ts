import type { QueryObserverResult } from '@tanstack/query-core';
import { useQueryClient } from '@tanstack/react-query';
import { use, useMemo } from 'react';

interface SuspendableDependentPromise<T> extends Promise<T> {
  __IS_STABLE_DEPENDENT_PROXY_PROMISE__?: true;
}

interface QueryWithSuspendableDependentPromiseOnly<T> {
  promise: SuspendableDependentPromise<T>;
}

type QueryResultLike<T> =
  | Pick<QueryObserverResult<T>, 'promise' | 'refetch' | 'isFetching'>
  | QueryWithSuspendableDependentPromiseOnly<T>;

export interface StableDependentQueryOptions<TResultData> {
  resultPromise: Promise<TResultData>;
  orderedQueries: Array<QueryResultLike<unknown>>;
}

const isQueryWithStableDependentPromiseOnly = (
  query: QueryResultLike<unknown>,
): query is QueryWithSuspendableDependentPromiseOnly<unknown> =>
  '__IS_STABLE_DEPENDENT_PROXY_PROMISE__' in query.promise &&
  query.promise.__IS_STABLE_DEPENDENT_PROXY_PROMISE__;

/**
 * Utility to prevent getting stuck forever when working with dependent react
 * queries (`useQuery({enable: false})`) that we want to suspend on via
 * `use()`.
 *
 * @see {@link ./README.md}
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries
 */
export const useCreateStableDependentPromise = <TResultData>({
  orderedQueries,
  resultPromise,
}: StableDependentQueryOptions<TResultData>): SuspendableDependentPromise<TResultData> => {
  const queryClient = useQueryClient();

  const customPromiseLikeObject = useMemo(() => {
    let didSuspendViaUseCalls = false;
    return new Proxy(
      {
        __IS_STABLE_DEPENDENT_PROXY_PROMISE__: true,
        then: (
          onfulfilled: (data: TResultData) => void,
          onrejected: (error: unknown) => void,
        ) =>
          resultPromise
            .then(onfulfilled)
            .catch(onrejected)
            .finally(() => {
              didSuspendViaUseCalls = false;
            }),
      },
      {
        /**
         * We rely & take advatange of something React does internally:
         *
         * React checks `typeof` for `.then` which means it accesses it.
         *
         * When upgrading `react` we must double check this works as expected.
         * If this code changes in `react`, we can simply patch it with a single
         * line which will check for **IS_STABLE_DEPENDENT_PROXY_PROMISE** and
         * run our own logic
         *
         * @see https://github.com/facebook/react/blob/83ea655a0ba1de44c933368cd7f56c8f0418f07f/packages/react-reconciler/src/ReactFiberHooks.js#L1154
         */
        get(target, prop, receiver) {
          if (prop === 'then' && !didSuspendViaUseCalls) {
            didSuspendViaUseCalls = true;
            orderedQueries.forEach((query) => {
              /**
               * First checks if the promise is a real useQuery() promise, or
               * our own proxy promise.
               *
               * If it's a real useQuery(), the query could be currently
               * re-fetched, in which case `query.promise` will be outdated. To
               * avoid that, we need to get the latest query object from the
               * query client
               */
              const matchingQueryObjectFromQueryClient =
                !isQueryWithStableDependentPromiseOnly(query)
                  ? queryClient
                      .getQueryCache()
                      // @ts-expect-error -- It works without passing the `queryKey` option
                      .find({
                        predicate: (queryInCache) =>
                          queryInCache.observers.some(
                            /**
                             * We don't have access to the query key so we are
                             * using the reference to `refetch` as way to
                             * identify the query
                             */
                            (observer) => observer.refetch === query.refetch,
                          ),
                      })
                  : null;

              const finalQuery = matchingQueryObjectFromQueryClient ?? query;

              use(finalQuery.promise as Promise<unknown>);
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Not even going to attempt to type this proxy custom implementation
          return Reflect.get(target, prop, receiver);
        },
      },
    );
  }, [
    /**
     * We want to re-run the `useMemo` when the `isFetching` state of the
     * queries changes since this is when a new promise is created and we need
     * to track that
     */
    ...orderedQueries.flatMap((query) => [
      'isFetching' in query && query.isFetching,
      query.promise,
    ]),
    resultPromise,
  ]);

  return customPromiseLikeObject as SuspendableDependentPromise<TResultData>;
};
