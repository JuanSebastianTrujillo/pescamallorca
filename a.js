const fs = require('fs');
const path = require('path');

// La ruta donde están tus archivos JSON de las zonas
const DATA_DIR = path.join(__dirname, 'assets', 'data');

// El archivo que usamos como "Fuente de Verdad" (el que tiene las imágenes correctas)
const SOURCE_FILE = path.join(DATA_DIR, 'zonas_ca.json');

// Los archivos que queremos actualizar
const TARGET_FILES = ['zonas_de.json', 'zonas_en.json', 'zonas_es.json'];

// Comprobamos si el archivo origen existe
if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`❌ Error crítico: No se encuentra el archivo origen en ${SOURCE_FILE}`);
    process.exit(1);
}

console.log("Leyendo imágenes de zonas_ca.json...");

// 1. Leer el archivo origen y mapear las imágenes por el @id de la zona
const sourceData = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf8'));
const mapaImagenes = {};

sourceData['@graph'].forEach(zona => {
    if (zona['@id'] && zona.image) {
        // Guardamos el array de imágenes asociado al @id único de la zona
        mapaImagenes[zona['@id']] = zona.image;
    }
});

console.log("Iniciando la sincronización en los otros idiomas...");

// 2. Recorrer y actualizar los otros 3 archivos
TARGET_FILES.forEach(fileName => {
    const filePath = path.join(DATA_DIR, fileName);

    if (fs.existsSync(filePath)) {
        const targetData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let contadorZonas = 0;

        // Buscamos cada zona por su @id y le sobrescribimos el campo 'image'
        targetData['@graph'].forEach(zona => {
            if (zona['@id'] && mapaImagenes[zona['@id']]) {
                zona.image = mapaImagenes[zona['@id']];
                contadorZonas++;
            }
        });

        // Guardamos el archivo modificado manteniendo el formato bonito (sangría de 2 espacios)
        fs.writeFileSync(filePath, JSON.stringify(targetData, null, 2), 'utf8');
        console.log(`  ✓ ¡Imágenes clonadas con éxito en: ${fileName} (${contadorZonas} zonas actualizadas)`);
    } else {
        console.log(`  ❌ No se encontró el archivo: ${fileName}`);
    }
});

console.log("\n¡Proceso completado! Todos los archivos de zonas comparten ahora las mismas URLs de imagen.");