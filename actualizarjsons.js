const fs = require('fs');
const path = require('path');

// La ruta donde están tus archivos JSON
const DATA_DIR = path.join(__dirname, 'assets', 'data');

// Los archivos que vamos a modificar
const files = [
    'zonas_ca.json', 
    'zonas_de.json', 
    'zonas_en.json', 
    'zonas_es.json'
];

// Lo que queremos buscar y por qué lo queremos cambiar
const RUTA_VIEJA = 'assets/img/spots/';
const RUTA_NUEVA = 'assets/img/spots/todos/';

console.log("Iniciando actualización de rutas en los JSONs...");

files.forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    
    // Comprobamos si el archivo existe
    if (fs.existsSync(filePath)) {
        // Leemos el contenido del JSON
        let data = fs.readFileSync(filePath, 'utf8');
        
        // Usamos una expresión regular global para cambiar TODAS las coincidencias en el archivo
        // El comando split y join es un truco infalible para reemplazar texto exacto
        data = data.split(RUTA_VIEJA).join(RUTA_NUEVA);
        
        // Sobrescribimos el archivo con las nuevas rutas
        fs.writeFileSync(filePath, data, 'utf8');
        console.log(`  ✓ Rutas actualizadas en: ${file}`);
    } else {
        console.log(`  ❌ No se encontró: ${filePath}`);
    }
});

console.log("¡Proceso terminado! Todas las imágenes apuntan ahora a la carpeta 'todos'.");