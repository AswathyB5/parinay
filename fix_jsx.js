import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix video src
    content = content.replace(/src="([^"/][^"]*\.mp4)"/g, 'src="/$1"');

    // Fix local links href="page.html" -> Link to="/page"
    // Also handle href="#" -> Link to=""
    // First, identify <a> tags that should be <Link>
    content = content.replace(/<a\s+([^>]*?)href="([^"]+)\.html"([^>]*?)>(.*?)<\/a>/gi, (match, p1, p2, p3, p4) => {
        return `<Link ${p1}to="/${p2}"${p3}>${p4}</Link>`;
    });

    // Handle href="#"
    content = content.replace(/<a\s+([^>]*?)href="#"([^>]*?)>(.*?)<\/a>/gi, (match, p1, p2, p3) => {
        return `<Link ${p1}to="#"${p2}>${p3}</Link>`;
    });

    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
});
