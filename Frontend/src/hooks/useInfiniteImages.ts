import { useInfiniteQuery } from "@tanstack/react-query";
import { gqlClient } from "@/lib/graphql-client";
import { GET_IMAGES } from "@/lib/queries";
import type { GetImagesResponse } from "@/types/graphql";

const PAGE_SIZE = 20;

type UseInfiniteImagesParams = {
  category?: string | null;
  type?: string | null;
};

export function useInfiniteImages({ category, type }: UseInfiniteImagesParams) {
  return useInfiniteQuery({
    queryKey: ["images", category ?? null, type ?? null],
    queryFn: async ({ pageParam }) => {
      const response = await gqlClient.request<GetImagesResponse>(GET_IMAGES, {
        limit: PAGE_SIZE,
        cursor: pageParam,
        category: category ?? undefined,
        type: type ?? undefined,
      });
      return response.images;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
