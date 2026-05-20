export const TAB_ORDER = ["/", "/friends", "/fatalk", "/notifications", "/settings"];

export const getTabBase = (path: string): string => {
  if (path === "/") return "/";
  const parts = path.split("/");
  return parts.length > 1 ? `/${parts[1]}` : path;
};

export type TransitionDirection = "forward" | "backward" | "none";

export const getTransitionDirection = (
  currentPath: string,
  targetPath: string,
): TransitionDirection => {
  const currentTab = getTabBase(currentPath);
  const targetTab = getTabBase(targetPath);

  if (currentTab === targetTab) return "none";

  const currentIndex = TAB_ORDER.indexOf(currentTab);
  const targetIndex = TAB_ORDER.indexOf(targetTab);

  if (currentIndex !== -1 && targetIndex !== -1) {
    return targetIndex < currentIndex ? "backward" : "forward";
  }

  return "forward";
};

export const getPageEnterClass = (direction: TransitionDirection): string => {
  if (direction === "forward") return "page-enter-forward";
  if (direction === "backward") return "page-enter-backward";
  return "";
};
