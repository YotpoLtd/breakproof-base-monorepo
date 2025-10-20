# Motivation

## We don't want to use `useSuspenseQuery` or `useSuspenseQueries` (_in fact we want to disallow them_)

1. Developers can put `useSuspenseQuery` inside custom hooks like
   `useUserProfile`. Let's say that happens in 2 such hooks: `useUserProfile`
   and `useProducts`. When a specific page/component wants to use **BOTH**
   custom hooks, this automatically creates a sequential, aka waterfall
   fetching, even if the queries don't depend on each other. We want to solve
   that by always using `useQuery` + `experimental_prefetchInRender` instead of
   `useSuspenseQuery` and then the custom hooks should return a promise
   themselves that the developer of each page can decide when to suspense via
   `use()`.

   > [!NOTE]
   >
   > Out of the box `experimental_prefetchInRender` doesn't work on the server.
   > That's why we need to
   > [patch `@tanstack/react-query`](../patches/@tanstack__react-query.patch).

2. `useSuspenseQuery` provides `refetch` but calling refetch **does not
   trigger** the `<Suspense/>` boundary so even if we had a Suspense fallback
   that handles the initial loading, now we need another internal loading inside
   of the component. We want to solve that by having the promise from `useQuery`
   passed to `use` which will trigger again the Suspense.

3. We also want to be able to have
   [dependent queries](https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries)
   (_a.k.a. queryA which can only start after queryB_) and wrap them in custom
   hooks. These custom hooks should be able to **return a single promise** that
   returns specific value. So that pages/components using that hook can control
   when to suspend and get the data.

   > [!NOTE]
   >
   > This doesn't work out of the box because having dependent `useQuery` calls
   > means that some hooks are disabled until a re-render happens during which
   > their required data is available. So if we simply suspend on the last query
   > promise (_this query will not be enabled during the first render because it
   > relies on the previous queries_) our rendering will get stuck forever
   > because we'll never re-render which means we'll never enable the disabled
   > query. For that we came up with
   > [`useDependentQueryPromise`](./useDependentQueryPromise.ts) which does some
   > magic under the hood to help us.

## Invalidating data must trigger re-rendering of relevant components

Generally speaking, there are two main ways to fetch data. To use hooks like
`useQuery` that use the React re-rendering cycle _OR_ to rely on basic async
function calls.

The second option might seem alluringly simple. However that option doesn't come
with a solution on how to trigger refresh of the UI, aka re-rendering of the UI,
when some data is no longer up to date (has changed). Yes, we can put the data
inside a context and then have custom logic on optimizing which components use
which data so we know what to rerender. But even then, we are lacking the
caching layer of solutions like `useQuery`. So basically we'll end up
re-implementing it.

So we use `useQuery`. You might think that we can simplify the complications of
dependent queries & React `use()` by not having dependent queries at all, and
instead have `queryClient.fetchQuery` calls inside of the `queryFn` when we need
more data. And yes this is possible, however this means that the query that uses
`queryClient.fetchQuery` inside of its `queryFn` can't have data returned by
internal `queryClient.fetchQuery` as part of its `queryKey` so this is not
allowing us a good `queryKey` which means well-targeted cache invalidation is
not possible.

# The solution

This comes in 4 parts:

1. Enabling `experimental_prefetchInRender` for react query `QueryClient`
2. The mentioned above
   [patch of `@tanstack/react-query`](../patches/@tanstack__react-query.patch)
3. The [`useDependentQueryPromise`](./useDependentQueryPromise.ts) helper to
   make React play well with dependent `useQuery` that require re-rendering to
   figure out they need to start
4. Strict convention on how to structure hooks that retrieve data, when to call
   them and when to suspend their promises.

## Usage

Inside custom hooks:

```tsx
export function useAsyncUserProfile(): {
  promise: Promise<UserProfile>;
  profile: UserProfile | null;
  isFetching: boolean;
} {
  const currentUserQuery = useAsyncCurrentUser();
  const userProfileQuery = useQuery(
    getUserProfileQueryOptions(currentUserQuery.data?.id),
  );
  const { profile, isFetching } = userProfileQuery;

  return {
    profile,
    isFetching,
    promise: useDependentQueryPromise({
      resultPromise: userProfileQuery.promise,
      orderedQueries: [currentUserQuery, userProfileQuery],
    }),
  };
}
```

Then, usage of custom hooks inside components:

> [!IMPORTANT]
>
> Async hooks that start the data fetching **_MUST_** all be called before any
> `use()` calls

```tsx
function Homepage() {
  // ✅ ALL custom hooks with async logic BEFORE any use() calls
  const { promise: settingsPromise } = useAsyncUserSettings();
  const { promise: promoProductsPromise } = usePromoProducts();
  const { promise: profilePromise } = useAsyncUserProfile();

  // at this point, any queries that are not blocked by other queries are already running in parallel

  // ✅ ALL use() calls come AFTER all custom hooks with async calls
  const settings = use(settingsPromise);
  const promoProducts = use(promoProductsPromise);
  const profile = use(profilePromise);

  return (
    <div>
      <h1>{settings.name}</h1>
      <p>Promo Products: {promoProducts.length}</p>
      <p>Profile: {profile.displayName}</p>
    </div>
  );
}
```

Then, when using this component:

> [!IMPORTANT]
>
> If you have a component that gets async data inside but you render it without
> wrapping in `<Suspense>` this means you will potentially block the whole page
> (_everything until the closest `<Suspense>` up the component tree_)

```tsx
function UserPage() {
  return (
    <div>
      <div>Some static content that doesn't need async data</div>
      <Suspense
        fallback={<Loading>Example homepage loading fallback...</Loading>}
      >
        <Homepage />
      </Suspense>
      <Suspense
        fallback={<Loading>Example dynamic chart loading fallback...</Loading>}
      >
        <SomeDynamicChart />
      </Suspense>
      <Suspense
        fallback={
          <Loading>Example other dynamic content loading fallback...</Loading>
        }
      >
        <SomeDynamicContent />
      </Suspense>
    </div>
  );
}
```
