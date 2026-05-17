/**
 * SemanticService - Gestiona JSON-LD dinámico para entidades principales (especies, zonas)
 * Actualiza el bloque de metadatos semánticos cuando se visualiza contenido específico
 */

export const SemanticService = {
    // ID único para el script JSON-LD de entidades (distinto del global)
    ENTITY_SCRIPT_ID: 'jsonld-entity',

    /**
     * Genera y actualiza JSON-LD para una especie
     * @param {Object} species - Objeto especie con name, description, images, etc.
     * @param {String} baseUrl - URL base del sitio (ej: https://pescamallorca.online)
     */
    updateSpeciesJsonLd(species, baseUrl = 'https://www.pescamallorca.online') {
        if (!species || !species.name) return;

        // Convertir nombre a slug para URL
        const slug = species.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Extraer nombre científico si está en alternateName
        const scientificName = species.alternateName || 
                             (species.additionalProperty?.find(p => p.name === 'Nombre científico')?.value) ||
                             '';

        // Extraer imágenes del array si existe
        const images = species.images && species.images.length > 0 
            ? species.images 
            : (species.image ? [species.image] : []);

        // Construir objeto JSON-LD para la especie
        const jsonld = {
            "@context": "https://schema.org",
            "@type": "Thing",
            "@id": `${baseUrl}/peces/${slug}`,
            "name": species.name,
            "description": species.description || '',
            "url": `${baseUrl}/peces/${slug}`,
            "image": images,
            "additionalType": "Taxon"
        };

        // Agregar nombre científico si existe
        if (scientificName) {
            jsonld.alternateName = scientificName;
        }

        // Agregar audio si existe
        if (species.audio) {
            jsonld.audio = species.audio;
        }

        // Agregar video si existe
        if (species.video) {
            jsonld.video = species.video;
        }

        // Agregar propiedades relevantes como estructura
        if (species.additionalProperty && Array.isArray(species.additionalProperty)) {
            jsonld.additionalProperty = species.additionalProperty
                .filter(p => p.name && p.value) // Solo propiedades con nombre y valor
                .slice(0, 10); // Limitar a 10 propiedades más relevantes
        }

        this._updateScriptTag(jsonld);
    },

    /**
     * Genera y actualiza JSON-LD para una zona/spot
     * @param {Object} spot - Objeto zona con name, description, geo, etc.
     * @param {String} baseUrl - URL base del sitio
     */
    updateSpotJsonLd(spot, baseUrl = 'https://www.pescamallorca.online') {
        if (!spot || !spot.name) return;

        // Convertir nombre a slug
        const slug = spot.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Extraer ubicación del objeto o del additionalProperty
        let location = spot.address?.addressLocality || '';
        if (!location && spot.additionalProperty) {
            const locProp = spot.additionalProperty.find(p => p.name === 'Municipio');
            location = locProp ? locProp.value : '';
        }

        // Construir objeto JSON-LD para la zona
        const jsonld = {
            "@context": "https://schema.org",
            "@type": "Place",
            "@id": `${baseUrl}/zonas/${slug}`,
            "name": spot.name,
            "description": spot.description || '',
            "url": `${baseUrl}/zonas/${slug}`,
            "additionalType": "TouristAttraction"
        };

        // Agregar imagen principal
        if (spot.image) {
            jsonld.image = Array.isArray(spot.image) ? spot.image : [spot.image];
        }

        // Agregar coordenadas geográficas si existen
        if (spot.geo && spot.geo.latitude && spot.geo.longitude) {
            jsonld.geo = {
                "@type": "GeoCoordinates",
                "latitude": spot.geo.latitude,
                "longitude": spot.geo.longitude
            };
        }

        // Agregar dirección postal si existe
        if (spot.address) {
            jsonld.address = {
                "@type": "PostalAddress",
                "addressLocality": spot.address.addressLocality || location,
                "addressRegion": spot.address.addressRegion || 'Illes Balears'
            };
        } else if (location) {
            jsonld.address = {
                "@type": "PostalAddress",
                "addressLocality": location,
                "addressRegion": "Illes Balears"
            };
        }

        // Agregar propiedades relevantes como estructura
        if (spot.additionalProperty && Array.isArray(spot.additionalProperty)) {
            jsonld.additionalProperty = spot.additionalProperty
                .filter(p => p.name && p.value)
                .slice(0, 8); // Limitar a 8 propiedades más relevantes
        }

        this._updateScriptTag(jsonld);
    },

    /**
     * Limpia el JSON-LD de entidad actual (al cerrar modales)
     */
    clearEntityJsonLd() {
        const existing = document.getElementById(this.ENTITY_SCRIPT_ID);
        if (existing) {
            existing.remove();
        }
    },

    /**
     * Actualiza o crea el script tag con el JSON-LD
     * @private
     */
    _updateScriptTag(jsonldObject) {
        // Eliminar script anterior si existe
        let script = document.getElementById(this.ENTITY_SCRIPT_ID);
        if (script) {
            script.remove();
        }

        // Crear nuevo script tag
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = this.ENTITY_SCRIPT_ID;
        script.textContent = JSON.stringify(jsonldObject);

        // Insertar en head
        document.head.appendChild(script);
    },

    /**
     * Obtiene el JSON-LD actual (útil para debugging)
     */
    getCurrentJsonLd() {
        const script = document.getElementById(this.ENTITY_SCRIPT_ID);
        if (!script) return null;
        try {
            return JSON.parse(script.textContent);
        } catch (e) {
            console.error('Error parsing JSON-LD:', e);
            return null;
        }
    }
};

export default SemanticService;
