import { useMatch, useResolvedPath } from "react-router-dom"

export const useSubActiveRoute = (to: string) => {
    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname });
    return !!match;
}