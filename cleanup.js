const fs = require('fs').promises;
const path = require('path');
const glob = require('glob-promise');

async function findUnusedFiles() {
   const rootDir = process.cwd();
   const srcDir = path.join(rootDir, 'src');
   const publicDir = path.join(rootDir, 'public');
   
   const allFiles = new Set();
   const referencedFiles = new Set();
   const entryPoints = new Set(['index.tsx', '_app.tsx', '_document.tsx']);

   const [srcFiles, publicFiles] = await Promise.all([
       glob('**/*', { cwd: srcDir, nodir: true }),
       glob('**/*', { cwd: publicDir, nodir: true })
   ]);

   srcFiles.forEach(file => allFiles.add(path.join('src', file)));
   publicFiles.forEach(file => allFiles.add(path.join('public', file)));

   for (const file of srcFiles) {
       if (file.startsWith('pages/') || file.startsWith('components/') || entryPoints.has(path.basename(file))) {
           referencedFiles.add(path.join('src', file));
       }
   }

   const sourceContent = await Promise.all(
       srcFiles.map(file => fs.readFile(path.join(srcDir, file), 'utf8').catch(() => ''))
   );

   const allContent = sourceContent.join(' ');
   
   for (const file of allFiles) {
       const basename = path.basename(file);
       const relativePath = file.replace(/^(src|public)\//, '');
       if (allContent.includes(basename) || allContent.includes(relativePath)) {
           referencedFiles.add(file);
       }
   }

   return Array.from(allFiles)
       .filter(file => !referencedFiles.has(file))
       .filter(file => !isEssentialFile(file));
}

function isEssentialFile(file) {
   return ['next.config.js', 'package.json', 'package-lock.json', 'tsconfig.json', 'postcss.config.js', 'tailwind.config.js', 'components.json', 'next-env.d.ts'].includes(path.basename(file)) || ['pages/', 'components/', 'hooks/', 'lib/', 'public/images/', 'public/favicon', 'types/', 'api/'].some(p => file.includes(p));
}

async function deleteUnusedFiles(files) {
   for (const file of files) {
       try {
           await fs.unlink(file);
           console.log(`Deleted: ${file}`);
       } catch (error) {
           console.error(`Failed to delete ${file}:`, error.message);
       }
   }
}

async function main() {
   const unusedFiles = await findUnusedFiles();
   console.log('\nPotentially unused files:');
   unusedFiles.forEach(file => console.log(file));
   
   if (process.argv.includes('--delete')) {
       console.log('\nDeleting unused files...');
       await deleteUnusedFiles(unusedFiles);
   } else {
       console.log('\nRun with --delete flag to remove these files');
   }
}

main().catch(console.error);
