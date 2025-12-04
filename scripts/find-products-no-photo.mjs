import fs from 'fs';

const products = JSON.parse(fs.readFileSync('/tmp/products.json', 'utf8'));

const noPhoto = products.filter(p => {
  if (!p.images || p.images.length === 0) return true;
  if (p.images.length === 1 && p.images[0].src.includes('placeholder')) return true;
  if (p.images.length === 1 && p.images[0].src.includes('woocommerce-placeholder')) return true;
  return false;
});

console.log(`Productos sin foto (${noPhoto.length}):\n`);
noPhoto.forEach((p, i) => {
  console.log(`${i+1}. ID: ${p.id} - ${p.name}`);
  console.log(`   Slug: ${p.slug}`);
  console.log(`   Categoría: ${p.categories.map(c => c.name).join(', ') || 'Sin categoría'}`);
  console.log('');
});
