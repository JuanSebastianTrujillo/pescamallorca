const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Dónde pones las fotos originales (pesadas, en alta calidad)
const SOURCE_DIR = path.join(__dirname, 'assets', 'img', 'peces', 'originales');

// 2. Dónde se guardarán todas las fotos listas para la web
const TARGET_DIR = path.join(__dirname, 'assets', 'img', 'peces', 'todos');

// 3. Los anchos que necesita tu etiqueta <picture>
const WIDTHS = [800, 400];

async function processImages() {
    // Si no existen las carpetas, las creamos
    if (!fs.existsSync(SOURCE_DIR)) {
        fs.mkdirSync(SOURCE_DIR, { recursive: true });
        console.log(`Carpeta creada: ${SOURCE_DIR}. Pon tus imágenes originales ahí y vuelve a ejecutar.`);
        return;
    }
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    const files = fs.readdirSync(SOURCE_DIR);
    const validExts = ['.jpg', '.jpeg', '.png', '.webp'];

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!validExts.includes(ext)) continue;

        const baseName = path.basename(file, ext);
        const sourcePath = path.join(SOURCE_DIR, file);

        console.log(`\nProcesando: ${file}...`);

        for (const width of WIDTHS) {
            try {
                // Preparamos la imagen y la redimensionamos
                let image = sharp(sourcePath).resize({ width: width, withoutEnlargement: true });

                // Generar AVIF (Máxima compresión)
                const avifPath = path.join(TARGET_DIR, `${baseName}-${width}.avif`);
                await image.avif({ quality: 65 }).toFile(avifPath);
                
                // Generar WebP (Equilibrio)
                const webpPath = path.join(TARGET_DIR, `${baseName}-${width}.webp`);
                await image.webp({ quality: 80 }).toFile(webpPath);
                
                // Generar JPG (Fallback de compatibilidad)
                const jpgPath = path.join(TARGET_DIR, `${baseName}-${width}.jpg`);
                await image.jpeg({ quality: 80 }).toFile(jpgPath);
                
                console.log(`  ✓ Creados AVIF, WebP y JPG en ${width}px`);
            } catch (error) {
                console.error(`  Error procesando ${baseName} a ${width}px:`, error);
            }
        }
    }

    console.log('\n¡Todas las imágenes han sido optimizadas para el <picture>!');
}

processImages();