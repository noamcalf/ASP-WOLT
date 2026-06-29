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
    if (file.includes('woltTheme.js') || file.includes('useThemeStyles.js') || file.includes('themeContext.jsx') || file.endsWith('.styles.js')) return;
    
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // SCENARIO 1: Component had inline styles that we turned into stylesFactory
    if (content.includes('const stylesFactory =')) {
        // Find component function definition
        // Assuming something like `const ComponentName = ({...}) => {` or `function ComponentName() {`
        // We will just look for `return (` and inject it before the FIRST `return (` or `return (` block.
        // Actually, safer to find the component name from the export default
        const exportMatch = content.match(/export default (\w+);/);
        if (exportMatch) {
            const compName = exportMatch[1];
            // Find `const CompName = (` or `const CompName = `
            const regex = new RegExp(`(const ${compName} = [^\\{]*\\{)`);
            if (content.match(regex)) {
                if (!content.includes('useThemeStyles(stylesFactory)')) {
                    content = content.replace(regex, `$1\n    const { styles, colors } = useThemeStyles(stylesFactory);`);
                    changed = true;
                }
            } else if (content.match(new RegExp(`function ${compName}[^\\{]*\\{`))) {
                content = content.replace(new RegExp(`(function ${compName}[^\\{]*\\{)`), `$1\n    const { styles, colors } = useThemeStyles(stylesFactory);`);
                changed = true;
            }
        }
    }

    // SCENARIO 2: Component imports styles from a .styles.js file
    // e.g. import { dashboardStyles as styles } from '../styles/DashboardScreen.styles';
    if (content.match(/import \{ (\w+Styles) as styles \} from/)) {
        content = content.replace(/import \{ (\w+Styles) as styles \} from/, "import { $1Factory } from");
        
        // Add the import for useThemeStyles if not exists
        if (!content.includes('useThemeStyles')) {
            const depth = file.split('src/')[1].split('/').length - 1;
            const prefix = depth === 0 ? './' : '../'.repeat(depth);
            const importHook = `import { useThemeStyles } from '${prefix}hooks/useThemeStyles';\n`;
            
            const lastImportIndex = content.lastIndexOf('import ');
            const endOfLastImport = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, endOfLastImport + 1) + importHook + content.slice(endOfLastImport + 1);
        }

        const exportMatch = content.match(/export default (\w+);/);
        if (exportMatch) {
            const compName = exportMatch[1];
            const factoryMatch = content.match(/import \{ (\w+StylesFactory) \} from/);
            if (factoryMatch) {
                const factoryName = factoryMatch[1];
                const regex = new RegExp(`(const ${compName} = [^\\{]*\\{)`);
                if (content.match(regex) && !content.includes('useThemeStyles(')) {
                    content = content.replace(regex, `$1\n    const { styles, colors } = useThemeStyles(${factoryName});`);
                    changed = true;
                }
            }
        }
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Injected useThemeStyles into ${path.basename(file)}`);
    }
});
