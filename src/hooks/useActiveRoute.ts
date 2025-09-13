import { useMatch, useResolvedPath } from "react-router-dom";

export const useActiveRoute = (to: string, end: boolean = false) => {
    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end });
    return !!match;
};
