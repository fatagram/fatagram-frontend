import { useMatch, useResolvedPath } from "react-router-dom"

export const useActiveRoute = (to: string, end: string) => {
    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: to === end });
    return !!match;
}