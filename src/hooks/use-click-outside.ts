import { useEffect, RefObject } from "react";

const useClickOutside = (
  refTarget: RefObject<HTMLElement>,
  refException: RefObject<HTMLElement>,
  callback: () => void,
  isActive: boolean = true,
) => {
  useEffect(() => {
    if (!isActive) return;
    const handleClickOutside = (event: MouseEvent) => {
      // Kiểm tra xem ref.current có mounted không và kiểu tra xem event.target có phải là con của ref.current hay không
      // Nếu không phải thì gọi callback
      if (refTarget.current && !refTarget.current.contains(event.target as Node)) {
        if (refException.current && refException.current.contains(event.target as Node)) return;
        callback();
      }
    };
    // Gán sự kiện click cho toàn bộ document
    document.addEventListener("mousedown", handleClickOutside);
    // Gỡ bỏ sự kiện khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refTarget, refException, callback, isActive]);
};

export default useClickOutside;
