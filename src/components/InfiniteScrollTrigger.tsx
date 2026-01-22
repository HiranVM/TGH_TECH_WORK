import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function InfiniteScrollTrigger({
  onIntersect,
  isFetchingNextPage,
  hasNextPage,
}: {
  onIntersect: () => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      onIntersect();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onIntersect]);

  return <div ref={ref} style={{ height: "20px", marginTop: "20px" }} />;
}
