import { useMemo, useContext } from 'react';
import { ThemeContext } from '../context/themeContext';
import { getColors, woltTheme } from '../styles/woltTheme';

export const useThemeStyles = (styleFactory) => {
    const { theme } = useContext(ThemeContext);
    
    const styles = useMemo(() => {
        const colors = getColors(theme);
        return styleFactory(colors, woltTheme);
    }, [theme, styleFactory]);
    
    return { styles, theme, colors: getColors(theme) };
};
