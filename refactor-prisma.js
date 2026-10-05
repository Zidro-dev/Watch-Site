const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src/app');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace import { PrismaClient } from "@prisma/client" with import { prisma } from "@/utils/prisma"
  content = content.replace(/import\s+{\s*PrismaClient\s*}\s+from\s+["']@prisma\/client["'];?/g, 'import { prisma } from "@/utils/prisma";');
  
  // Remove const prisma = new PrismaClient();
  content = content.replace(/const\s+prisma\s*=\s*new\s+PrismaClient\(\);?/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
