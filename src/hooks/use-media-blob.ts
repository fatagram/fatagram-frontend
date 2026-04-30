import { useState, useEffect } from "react";

interface CacheEntry {
  blobUrl: string | null;
  promise: Promise<string> | null;
  refCount: number;
  timer: NodeJS.Timeout | null;
}

const cache = new Map<string, CacheEntry>();

const TTL_MS = 60 * 1000; // 60 seconds TTL

export const useMediaBlob = (url?: string) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(() => {
    if (url && cache.has(url)) {
      return cache.get(url)!.blobUrl;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(() => {
    if (url && cache.has(url) && cache.get(url)!.blobUrl) {
      return false;
    }
    return !!url;
  });

  useEffect(() => {
    if (!url) {
      setBlobUrl(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let entry = cache.get(url);

    if (!entry) {
      entry = {
        blobUrl: null,
        promise: null,
        refCount: 0,
        timer: null,
      };
      cache.set(url, entry);
    }

    entry.refCount += 1;

    // Clear timer if it was scheduled for deletion
    if (entry.timer) {
      clearTimeout(entry.timer);
      entry.timer = null;
    }

    if (entry.blobUrl) {
      setBlobUrl(entry.blobUrl);
      setIsLoading(false);
    } else if (entry.promise) {
      setIsLoading(true);
      entry.promise.then((bUrl) => {
        if (isMounted) {
          setBlobUrl(bUrl);
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(true);
      entry.promise = fetch(url, { mode: "cors" })
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.blob();
        })
        .then((blob) => {
          const bUrl = URL.createObjectURL(blob);
          if (cache.get(url) === entry) {
            entry!.blobUrl = bUrl;
            entry!.promise = null;
          }
          if (isMounted) {
            setBlobUrl(bUrl);
            setIsLoading(false);
          }
          return bUrl;
        })
        .catch((err) => {
          console.error("Failed to fetch blob for", url, err);
          if (cache.get(url) === entry) {
            entry!.promise = null;
          }
          if (isMounted) {
            setBlobUrl(url); // Fallback to original url on fail
            setIsLoading(false);
          }
          return url;
        });
    }

    return () => {
      isMounted = false;
      const currentEntry = cache.get(url);
      if (currentEntry) {
        currentEntry.refCount -= 1;
        if (currentEntry.refCount <= 0) {
          currentEntry.refCount = 0;
          currentEntry.timer = setTimeout(() => {
            if (currentEntry.blobUrl && currentEntry.blobUrl.startsWith("blob:")) {
              URL.revokeObjectURL(currentEntry.blobUrl);
            }
            cache.delete(url);
          }, TTL_MS);
        }
      }
    };
  }, [url]);

  return { blobUrl, isLoading };
};
