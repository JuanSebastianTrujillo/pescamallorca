const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directorio donde poner las imágenes originales (ej: dorada.jpg)
const SOURCE_DIR = path.join(__dirname, 'assets', 'img', 'peces', 'originales');
// Directorio donde se guardarán las imágenes generadas
const TARGET_DIR = path.join(__dirname, 'assets', 'img', 'peces', 'webp');

// Tamaños que queremos generar
const SIZES = [
    { suffix: '-min.webp', width: 1600 }, // Mantiene tamaño original o puedes poner un ancho máximo, ej: 1200
    { suffix: '-min-800.webp', width: 800 },
    { suffix: '-min-400.webp', width: 400 }
];

async function processImages() {
    // Crear el directorio de origen si no existe
    if (!fs.existsSync(SOURCE_DIR)) {
        fs.mkdirSync(SOURCE_DIR, { recursive: true });
        console.log(`Carpeta creada: ${SOURCE_DIR}. Por favor, pon tus imágenes originales ahí.`);
        return;
    }

    // Crear el directorio de destino si no existe
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

        console.log(`Procesando: ${file}...`);

        for (const size of SIZES) {
            const targetPath = path.join(TARGET_DIR, `${baseName}${size.suffix}`);

            try {
                let image = sharp(sourcePath);

                // Si hay un ancho definido, redimensionar manteniendo la proporción
                if (size.width) {
                    image = image.resize({ width: size.width, withoutEnlargement: true });
                }

                // Convertir a webp y guardar
                await image.webp({ quality: 80 }).toFile(targetPath);
                console.log(`  -> Creado: ${baseName}${size.suffix}`);
            } catch (error) {
                console.error(`  Error procesando ${baseName} para tamaño ${size.suffix}:`, error);
            }
        }
    }

    console.log('¡Proceso completado!');
}

processImages();
