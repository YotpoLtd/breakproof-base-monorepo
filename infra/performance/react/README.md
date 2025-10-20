# `@repo/react`

Includes:

1. patch for `@tanstack/react-query` to allow starting to prefetch data in
   `useQuery()` during rendering on the server
1. a hook that allows directly suspending on dependent `useQuery()` calls
   (a.k.a. `useQuery()` is disabled until another one before it completes)
