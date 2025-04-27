import en from "./en";
import vi from "./vi";

export const namespaces = ["auth", "common", "home", "settings", "user"] as const;
export const defaultNS = "common";

export const resources = {
    en,
    vi
}