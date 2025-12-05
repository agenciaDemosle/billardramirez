#!/usr/bin/env node

/**
 * Script para comprimir imágenes PNG/JPG y convertirlas a WebP
 * Reemplaza los originales con versiones optimizadas
 */

import { execSync } from 'child_process';
import { readdirSync, statSync, renameSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';

const IMAGES_DIR = './public/images/fotos';
const WEBP_QUALITY = 82;
const MAX_WIDTH = 1600;

// Obtener todas las imágenes
const files = readdirSync(IMAGES_DIR).filter(file => {
  const ext = extname(file).toLowerCase();
  return ['.png', '.jpg', '.jpeg'].includes(ext);
});

console.log(`\n🖼️  Encontradas ${files.length} imágenes para optimizar\n`);

let totalOriginal = 0;
let totalOptimized = 0;

for (const file of files) {
  const inputPath = join(IMAGES_DIR, file);
  const stats = statSync(inputPath);
  const originalSize = stats.size;
  totalOriginal += originalSize;

  const nameWithoutExt = basename(file, extname(file));
  const webpOutput = join(IMAGES_DIR, `${nameWithoutExt}.webp`);

  console.log(`📷 ${file} (${(originalSize / 1024 / 1024).toFixed(2)} MB)`);

  try {
    // Convertir a WebP con compresión
    execSync(`cwebp -q ${WEBP_QUALITY} -resize ${MAX_WIDTH} 0 "${inputPath}" -o "${webpOutput}" 2>/dev/null`);

    const webpStats = statSync(webpOutput);
    const webpSize = webpStats.size;
    totalOptimized += webpSize;

    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
    console.log(`   ✅ WebP: ${(webpSize / 1024).toFixed(0)} KB (${savings}% más pequeño)\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
}

console.log('━'.repeat(50));
console.log(`📊 Total original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
console.log(`📊 Total optimizado: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
console.log(`💾 Ahorro total: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`);
console.log(`\n✨ Archivos WebP creados junto a los originales`);
