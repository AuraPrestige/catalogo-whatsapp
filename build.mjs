// Aura Prestige — genera el archivo de datos del catálogo de WhatsApp/Meta
// Lee el catálogo público de laboncler.es y escribe catalogo-whatsapp.csv
import fs from "node:fs";

const UA = { "User-Agent": "Mozilla/5.0 (compatible; AuraPrestigeFeed/1.0)" };

async function descargar() {
  const productos = [];
  for (let page = 1; page <= 8; page++) {
    const r = await fetch(`https://laboncler.es/products.json?limit=250&page=${page}`, { headers: UA });
    if (!r.ok) throw new Error(`laboncler.es respondió ${r.status} en la página ${page}`);
    const d = (await r.json()).products || [];
    if (!d.length) break;
    productos.push(...d);
  }
  return productos;
}

// Productos publicados en la web auraprestige.es (para enlazar cada producto a su ficha)
async function productosWeb() {
  const slugs = new Set();
  try {
    for (let page = 1; page <= 20; page++) {
      const r = await fetch(`https://auraprestige.es/wp-json/wc/store/v1/products?per_page=100&page=${page}`, { headers: UA });
      if (!r.ok) break;
      const d = await r.json();
      if (!d.length) break;
      d.forEach(p => slugs.add(p.slug));
    }
  } catch (e) {
    console.log("Aviso: no se pudo leer auraprestige.es (" + e.message + "); se enlaza a la portada.");
  }
  return slugs;
}

const productos = await descargar();
if (productos.length < 300) throw new Error(`Solo se han leído ${productos.length} productos; se aborta para no vaciar el catálogo.`);
const enWeb = await productosWeb();
console.log(`auraprestige.es: ${enWeb.size} productos publicados`);

const cuerpo = fs.readFileSync(new URL("./buildFeed.js", import.meta.url), "utf8");
const buildFeed = new Function("productos", "enWeb", cuerpo);
const csv = buildFeed(productos, enWeb);

const filas = csv.split("\n").length;
if (!csv.startsWith("id,title,") || csv.length < 50000) throw new Error("El CSV generado no tiene buena pinta; se aborta.");

fs.writeFileSync("catalogo-whatsapp.csv", csv, "utf8");
console.log(`OK · ${productos.length} productos leídos de laboncler.es · CSV de ${Math.round(csv.length / 1024)} KB`);
