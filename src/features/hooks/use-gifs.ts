import { GifResponseDto } from "@/api/gif/dto/git.dto";
import { gifService } from "@/api/gif/gif.api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGifs = (query: string, enabled: boolean = true, limit = 20) => {
  return useInfiniteQuery<GifResponseDto>({
    queryKey: ["gifs", query, limit],
    queryFn: ({ pageParam }) => {
      const pos = pageParam as string | undefined;
      if (query.trim()) {
        return gifService.getGifSearch(query, limit, pos);
      }
      return gifService.getGifTrending(limit, pos);
    },
    getNextPageParam: (lastPage) => lastPage?.next || undefined,
    initialPageParam: undefined,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled,
  });
};
