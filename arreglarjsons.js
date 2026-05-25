const fs = require('fs');
const path = require('path');

// La ruta donde están tus archivos JSON según tu app.js
const DATA_DIR = path.join(__dirname, 'assets', 'data');

// Los archivos que vamos a limpiar
const files = [
    'especies_ca.json', 
    'especies_de.json', 
    'especies_en.json', 
    'especies_es.json'
];

console.log("Iniciando limpieza de JSONs...");

files.forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    
    // Comprobamos si el archivo existe en la ruta
    if (fs.existsSync(filePath)) {
        // Leemos el contenido del JSON
        let data = fs.readFileSync(filePath, 'utf8');
        
        // Magia: Buscamos cualquier "-min" seguido de la extensión y lo quitamos
        data = data.replace(/-min\.webp/g, '.webp');
        data = data.replace(/-min\.jpg/g, '.jpg');
        data = data.replace(/-min\.png/g, '.png');
        
        // Sobrescribimos el archivo con el texto limpio
        fs.writeFileSync(filePath, data, 'utf8');
        console.log(`  ✓ Archivo limpio y guardado: ${file}`);
    } else {
        console.log(`  ❌ No se encontró: ${filePath} (Comprueba que están en assets/data/)`);
    }
});

console.log("¡Proceso terminado! Ya puedes probar tu web.");