const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    // Skip theme files and our new hook
    if (file.includes('woltTheme.js') || file.includes('useThemeStyles.js') || file.includes('themeContext.jsx')) return;
    
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Refactor exported standalone style files (.styles.js)
    if (file.endsWith('.styles.js')) {
        // e.g. export const dashboardStyles = StyleSheet.create({
        if (content.match(/export const (\w+Styles) = StyleSheet\.create\(\{/)) {
            content = content.replace(/export const (\w+Styles) = StyleSheet\.create\(\{/g, 'export const $1Factory = (colors, theme) => StyleSheet.create({');
            content = content.replace(/woltTheme\.colors/g, 'colors');
            changed = true;
        }
    }
    
    // 2. Refactor inline styles at the bottom of .js/.jsx files
    if (content.includes('const styles = StyleSheet.create({')) {
        // But only if we don't already export a factory, and only if we use woltTheme
        if (content.includes('woltTheme')) {
            content = content.replace(/const styles = StyleSheet\.create\(\{/, 'const stylesFactory = (colors, theme) => StyleSheet.create({');
            content = content.replace(/woltTheme\.colors/g, 'colors');
            
            // Add the import for useThemeStyles if not exists
            if (!content.includes('useThemeStyles')) {
                // Determine relative path to hooks
                const depth = file.split('src/')[1].split('/').length - 1;
                const prefix = depth === 0 ? './' : '../'.repeat(depth);
                const importHook = `import { useThemeStyles } from '${prefix}hooks/useThemeStyles';\n`;
                
                // insert after last import
                const lastImportIndex = content.lastIndexOf('import ');
                const endOfLastImport = content.indexOf('\n', lastImportIndex);
                content = content.slice(0, endOfLastImport + 1) + importHook + content.slice(endOfLastImport + 1);
            }
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Refactored styles in ${path.basename(file)}`);
    }
});
