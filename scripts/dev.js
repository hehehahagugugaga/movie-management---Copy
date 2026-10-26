import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate public/index.html
const htmlTemplate = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="referrer" content="no-referrer" />
    <title>Movie Management System | React & Node.js</title>
    <meta name="description" content="Movie Management System - A complete CRUD React web application with Node.js backend, search, filtering, watchlist, reviews, and localStorage persistence." />
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/bundle.css">
  </head>
  <body class="bg-gray-50 text-gray-900 font-sans antialiased min-h-screen">
    <div id="root"></div>
    <script src="/bundle.js" defer></script>
  </body>
</html>
`;
fs.writeFileSync(path.join(publicDir, 'index.html'), htmlTemplate, 'utf-8');
fs.writeFileSync(path.join(rootDir, 'index.html'), htmlTemplate, 'utf-8');

console.log('[Dev] Starting esbuild client watcher...');

// Create esbuild build context with watch
const ctx = await esbuild.context({
  entryPoints: [path.join(rootDir, 'src', 'main.jsx')],
  bundle: true,
  outfile: path.join(publicDir, 'bundle.js'),
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
    '.css': 'css',
  },
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  sourcemap: true,
});

await ctx.watch();
console.log('[Dev] Client build complete and watching for changes in src/...');

// Start Express server
const serverProcess = spawn('node', ['server.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

serverProcess.on('close', (code) => {
  ctx.dispose();
  process.exit(code);
});

process.on('SIGINT', () => {
  ctx.dispose();
  serverProcess.kill('SIGINT');
  process.exit(0);
});
