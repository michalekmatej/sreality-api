import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    staleTime: 60000,
    // placeholderData: keepPreviousData,
  },
});