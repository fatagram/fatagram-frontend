import en from "./en";
import vi from "./vi";
import zh from "./zh";

export const namespaces = [
    "auth", 
    "common", 
    "home", 
    "settings", 
    "user", 
    "friends", 
    "times",
    "notifications"
] as const;
export const defaultNS = "common";

export const resources = {
    en,
    vi,
    zh
}