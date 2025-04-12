import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = 'light' | 'dark' | 'neon' | 'toxic-red-death' | 'dark-pink-mystic';
const themes: Theme[] = ['light', 'dark', 'neon', 'toxic-red-death', 'dark-pink-mystic'];

interface ThemeContextType {
    theme: Theme;
    setTheme: (e: string) => void;
    availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('theme') as Theme) || 'light';
    });

    const setThemeHandler = (theme: string) => {
        if (themes.includes(theme as Theme)) {
            setTheme(theme as Theme);
        } else {
            console.error(`Theme ${theme} is not supported.`);
        }
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{theme, setTheme: setThemeHandler, availableThemes: themes}}>
            {children}
        </ThemeContext.Provider>
    )
}  


export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}