import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = 'light' | 'dark' | 'neon' | 'toxic-red-death';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('theme') as Theme) || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            if (prevTheme === 'light') return 'dark';
            if (prevTheme === 'dark') return 'neon';
            if (prevTheme === 'neon') return 'toxic-red-death';
            if (prevTheme === 'toxic-red-death') return 'light';
            return 'light';
        });
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
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