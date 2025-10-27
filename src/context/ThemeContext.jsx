import { createContext, useState, useContext, useEffect } from 'react';

// 1. Crear el contexto
const ThemeContext = createContext();

// 2. Crear el proveedor del contexto
export const ThemeProvider = ({ children }) => {
    // Busca el tema guardado en localStorage o usa 'light' por defecto
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );

    // 3. Efecto que se ejecuta cada vez que el tema cambia
    useEffect(() => {
        const root = window.document.documentElement;

        // Remueve la clase anterior
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');

        // Añade la clase actual al elemento <html>
        root.classList.add(theme);

        // Guarda la elección del usuario en localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    // 4. Función para cambiar el tema
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// 5. Hook personalizado para usar el contexto fácilmente
export const useTheme = () => {
    return useContext(ThemeContext);
};
