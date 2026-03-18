import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'Premium Site');
const destDir = path.join(__dirname, 'src', 'pages');

const files = [
    { in: 'about.html', out: 'About.jsx', name: 'About' },
    { in: 'services.html', out: 'Services.jsx', name: 'Services' },
    { in: 'contact.html', out: 'Contact.jsx', name: 'Contact' },
    { in: 'stories.html', out: 'Stories.jsx', name: 'Stories' },
    { in: 'journals.html', out: 'Journals.jsx', name: 'Journals' }
];

function prepareJsx(htmlContent) {
    const startIdx = htmlContent.indexOf('</header>');
    const endIdx = htmlContent.indexOf('<footer');
    if (startIdx === -1 || endIdx === -1) return null;
    
    let content = htmlContent.substring(startIdx + 9, endIdx);
    
    // Replace inline styles style="margin-top: 40px;" with style={{marginTop: '40px'}}
    content = content.replace(/style="([^"]*)"/g, (match, p1) => {
        const styles = p1.split(';').filter(s => s.trim()).map(s => {
            const parts = s.split(':');
            if(parts.length < 2) return '';
            const key = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            const value = parts.slice(1).join(':').trim();
            return `${key}: '${value}'`;
        }).filter(s => s).join(', ');
        return `style={{ ${styles} }}`;
    });

    content = content.replace(/<!--[\s\S]*?-->/g, match => `{/* ${match.slice(4, -3)} */}`);

    content = content.replace(/<(img|input|hr|br|source)([^>]*?)(?:\/)?>/gi, (match, tag, attrs) => {
        if (attrs.endsWith('/')) {
            return `<${tag}${attrs}>`; // already self-closing
        }
        return `<${tag}${attrs} />`;
    });

    content = content.replace(/class=/g, 'className=');
    content = content.replace(/for=/g, 'htmlFor=');
    content = content.replace(/tabindex=/g, 'tabIndex=');
    content = content.replace(/autoplay/gi, 'autoPlay');
    content = content.replace(/playsinline/gi, 'playsInline');
    content = content.replace(/frameborder/gi, 'frameBorder');
    content = content.replace(/allowfullscreen/gi, 'allowFullScreen');
    content = content.replace(/referrerpolicy/gi, 'referrerPolicy');

    return content.trim();
}

files.forEach(f => {
    const p = path.join(srcDir, f.in);
    if (!fs.existsSync(p)) {
        console.log('Skipping ' + f.in);
        return;
    }
    const html = fs.readFileSync(p, 'utf8');
    const jsxContent = prepareJsx(html);
    if (!jsxContent) {
        console.log('Could not parse ' + f.in);
        return;
    }
    const finalFile = `import React from 'react';\nimport { Link } from 'react-router-dom';\n\nconst ${f.name} = () => {\n    return (\n        <>\n            ${jsxContent}\n        </>\n    );\n};\n\nexport default ${f.name};\n`;
    fs.writeFileSync(path.join(destDir, f.out), finalFile);
    console.log(`Created ${f.out}`);
});
