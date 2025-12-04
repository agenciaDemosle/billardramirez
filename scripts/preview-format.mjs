/**
 * Preview de cambios en descripciones
 */

import 'dotenv/config';

const WOO_URL = process.env.VITE_WOO_URL;
const CONSUMER_KEY = process.env.VITE_WOO_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.VITE_WOO_CONSUMER_SECRET;

const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

async function wooRequest(endpoint) {
  const url = `${WOO_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Basic ${auth}` },
  });
  return response.json();
}

// Quitar emojis
function removeEmojis(text) {
  if (!text) return text;
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2702}]|[\u{2705}]|[\u{2708}-\u{270D}]|[\u{270F}]|[\u{2712}]|[\u{2714}]|[\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\u{2733}-\u{2734}]|[\u{2744}]|[\u{2747}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2763}-\u{2764}]|[\u{2795}-\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]|[\u{FE00}-\u{FE0F}]|[\u{200D}]/gu;
  return text.replace(emojiRegex, '').trim();
}

function formatDescription(html) {
  if (!html || html.trim() === '') return html;

  let cleaned = removeEmojis(html);
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/>\s+</g, '><');
  cleaned = cleaned.replace(/\s+>/g, '>');
  cleaned = cleaned.replace(/<\s+/g, '<');
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');
  cleaned = cleaned.replace(/<p>&nbsp;<\/p>/gi, '');
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){2,}/gi, '<br>');
  cleaned = cleaned.replace(/<p>\s+/gi, '<p>');
  cleaned = cleaned.replace(/\s+<\/p>/gi, '</p>');
  cleaned = cleaned.replace(/<b>/gi, '<strong>');
  cleaned = cleaned.replace(/<\/b>/gi, '</strong>');
  cleaned = cleaned.replace(/<strong>\s*<\/strong>/gi, '');
  cleaned = cleaned.replace(/<strong>([^<]+):\s*<\/strong>/gi, '<strong>$1</strong>');
  cleaned = cleaned.replace(/<h(\d)>\s*/gi, '<h$1>');
  cleaned = cleaned.replace(/\s*<\/h(\d)>/gi, '</h$1>');
  cleaned = cleaned.replace(/<li>\s*/gi, '<li>');
  cleaned = cleaned.replace(/\s*<\/li>/gi, '</li>');
  cleaned = cleaned.replace(/<ul>\s*/gi, '<ul>');
  cleaned = cleaned.replace(/\s*<\/ul>/gi, '</ul>');
  cleaned = cleaned.replace(/\s*style="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\s*class="[^"]*"/gi, '');

  return cleaned.trim();
}

async function main() {
  const products = await wooRequest('/products?per_page=3');

  for (const product of products) {
    console.log('\n' + '='.repeat(70));
    console.log(`PRODUCTO: ${product.name} (ID: ${product.id})`);
    console.log('='.repeat(70));

    console.log('\n--- DESCRIPCIÓN CORTA ORIGINAL ---');
    console.log(product.short_description || '(vacía)');

    console.log('\n--- DESCRIPCIÓN CORTA FORMATEADA ---');
    console.log(formatDescription(product.short_description) || '(vacía)');

    console.log('\n--- DESCRIPCIÓN LARGA ORIGINAL ---');
    console.log(product.description || '(vacía)');

    console.log('\n--- DESCRIPCIÓN LARGA FORMATEADA ---');
    console.log(formatDescription(product.description) || '(vacía)');
  }
}

main();
