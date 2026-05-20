export const TAB_ORDER = ["/", "/friends", "/fatalk", "/notifications"];

export const getTabBase = (path: string): string => {
  if (path === "/") return "/";
  const parts = path.split("/");
  return parts.length > 1 ? `/${parts[1]}` : path;
};

export const getTransitionDirection = (
  currentPath: string,
  targetPath: string,
): "forward" | "backward" => {
  const currentTab = getTabBase(currentPath);
  const targetTab = getTabBase(targetPath);

  const currentIndex = TAB_ORDER.indexOf(currentTab);
  const targetIndex = TAB_ORDER.indexOf(targetTab);

  if (currentIndex !== -1 && targetIndex !== -1) {
    if (targetIndex < currentIndex) {
      return "backward";
    }
  }
  return "forward";
};
