const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directorio de las imágenes de peces
const PECES_DIR = path.join(__dirname, 'assets', 'img', 'peces');

// Anchos responsive
const WIDTHS = [400, 800];

// Imágenes a recomprimir: las que pesan demasiado o les faltan variantes
// Buscamos los archivos "-min.webp" (sin sufijo de tamaño) como fuente
async function optimizarPeces() {
    const files = fs.readdirSync(PECES_DIR);

    // Seleccionamos solo los archivos "-min.webp" (sin "-400" ni "-800") como fuente
    const sources = files.filter(f => {
        return (f.endsWith('-min.webp') || f.endsWith('-min.jpg') || f.endsWith('-min.png')) &&
               !f.includes('-400') && !f.includes('-800');
    });

    if (sources.length === 0) {
        console.log('No se encontraron imágenes fuente en:', PECES_DIR);
        console.log('Archivos disponibles:', files.join(', '));
        return;
    }

    console.log(`\nEncontradas ${sources.length} imágenes fuente para optimizar:\n`);

    for (const file of sources) {
        const ext = path.extname(file).toLowerCase();
        // Nombre base sin extensión: ej. "llampuga-min"
        const baseName = path.basename(file, ext);
        const sourcePath = path.join(PECES_DIR, file);

        const stats = fs.statSync(sourcePath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`📁 ${file} (${sizeKB} KB)`);

        for (const width of WIDTHS) {
            try {
                const image = sharp(sourcePath).resize({ width, withoutEnlargement: true });

                // WebP (principal)
                const webpOut = path.join(PECES_DIR, `${baseName}-${width}.webp`);
                await image.webp({ quality: 80 }).toFile(webpOut);
                const webpSize = (fs.statSync(webpOut).size / 1024).toFixed(1);
                console.log(`  ✓ WebP  ${width}px → ${webpSize} KB`);

                // AVIF (máxima compresión)
                const avifOut = path.join(PECES_DIR, `${baseName}-${width}.avif`);
                await image.avif({ quality: 60 }).toFile(avifOut);
                const avifSize = (fs.statSync(avifOut).size / 1024).toFixed(1);
                console.log(`  ✓ AVIF  ${width}px → ${avifSize} KB`);

                // JPG (fallback)
                const jpgOut = path.join(PECES_DIR, `${baseName}-${width}.jpg`);
                await image.jpeg({ quality: 80 }).toFile(jpgOut);
                const jpgSize = (fs.statSync(jpgOut).size / 1024).toFixed(1);
                console.log(`  ✓ JPG   ${width}px → ${jpgSize} KB`);

            } catch (err) {
                console.error(`  ✗ Error en ${baseName} a ${width}px:`, err.message);
            }
        }
        console.log('');
    }

    console.log('✅ Optimización de peces completada.\n');
    console.log('Ahora comprueba los tamaños con: dir assets\\img\\peces\\*-min-*.webp');
}

optimizarPeces();
