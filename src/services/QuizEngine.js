/**
 * QuizEngine.js
 * ─────────────
 * Motor de juego para el Quiz del Pescador.
 * Genera preguntas dinámicas a partir de los datos JSON de especies y zonas.
 *
 * Principios aplicados:
 *   - State Machine: IDLE → PLAYING → ANSWERED → PLAYING → ... → FINISHED
 *   - Factory Pattern: generadores de preguntas por categoría.
 *   - SRP: solo lógica de juego, sin manipulación DOM directa.
 */

// ─── Estados ────────────────────────────────────────────────

const STATE = {
    IDLE:     'IDLE',
    PLAYING:  'PLAYING',
    ANSWERED: 'ANSWERED',
    FINISHED: 'FINISHED'
};

// ─── Utilidades ─────────────────────────────────────────────

function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function pickRandom(arr, count = 1) {
    const shuffled = shuffleArray(arr);
    return count === 1 ? shuffled[0] : shuffled.slice(0, count);
}

function getProp(species, propName) {
    const prop = species.additionalProperty?.find(p => p.name === propName);
    return prop ? prop.value : null;
}

// ─── Generadores de Preguntas ───────────────────────────────

/**
 * Genera preguntas de reconocimiento de especies.
 * Tipos: imagen → nombre, nombre → hábitat, nombre → método de pesca.
 */
function generateSpeciesQuestions(speciesData) {
    const questions = [];
    if (speciesData.length < 4) return questions;

    const generators = [
        // Tipo 1: ¿Qué especie es esta? (con imagen)
        (target, distractors) => {
            const options = shuffleArray([
                { text: target.name, correct: true },
                ...distractors.map(d => ({ text: d.name, correct: false }))
            ]);
            return {
                text: `¿Qué especie de pez se muestra en la imagen?`,
                image: target.image,
                imageAlt: `Fotografía detallada de ${target.name}, una especie marina de las aguas de Mallorca`,
                options,
                explanation: `Es un/a ${target.name} (${target.alternateName || ''}).`
            };
        },
        // Tipo 2: ¿Cuál es el nombre científico de X?
        (target, distractors) => {
            if (!target.alternateName) return null;
            const options = shuffleArray([
                { text: target.alternateName, correct: true },
                ...distractors
                    .filter(d => d.alternateName)
                    .map(d => ({ text: d.alternateName, correct: false }))
            ]);
            if (options.length < 4) return null;
            return {
                text: `¿Cuál es el nombre científico del ${target.name}?`,
                image: null,
                options,
                explanation: `El nombre científico del ${target.name} es ${target.alternateName}.`
            };
        },
        // Tipo 3: ¿Cuál es el hábitat del X?
        (target, distractors) => {
            const habitat = getProp(target, 'Hábitat preferido');
            if (!habitat) return null;
            const otherHabitats = distractors
                .map(d => getProp(d, 'Hábitat preferido'))
                .filter(Boolean)
                .filter(h => h !== habitat);
            if (otherHabitats.length < 3) return null;
            const opts = shuffleArray([
                { text: habitat, correct: true },
                ...pickRandom(otherHabitats, 3).map(h => ({ text: h, correct: false }))
            ]);
            return {
                text: `¿Cuál es el hábitat preferido del ${target.name}?`,
                image: null,
                options: opts,
                explanation: `El ${target.name} prefiere: ${habitat}.`
            };
        }
    ];

    // Generar preguntas con cada especie
    const shuffledSpecies = shuffleArray(speciesData);
    for (const sp of shuffledSpecies) {
        if (questions.length >= 15) break;
        const distractors = pickRandom(speciesData.filter(s => s.name !== sp.name), 3);
        if (distractors.length < 3) continue;

        const gen = pickRandom(generators);
        const q = gen(sp, distractors);
        if (q && q.options.length >= 4) {
            questions.push(q);
        }
    }

    return questions;
}

/**
 * Genera preguntas de normativa y tallas mínimas.
 */
function generateNormativaQuestions(speciesData) {
    const questions = [];
    if (speciesData.length < 4) return questions;

    const generators = [
        // Tipo 1: ¿Cuál es la talla mínima legal de X?
        (target, distractors) => {
            const talla = getProp(target, 'Talla mínima legal');
            if (!talla) return null;
            const unit = target.additionalProperty.find(p => p.name === 'Talla mínima legal')?.unitText || 'cm';
            const wrongValues = [
                parseInt(talla) - 5,
                parseInt(talla) + 5,
                parseInt(talla) + 10
            ].filter(v => v > 0);
            if (wrongValues.length < 3) return null;
            const options = shuffleArray([
                { text: `${talla} ${unit}`, correct: true },
                ...wrongValues.map(v => ({ text: `${v} ${unit}`, correct: false }))
            ]);
            return {
                text: `¿Cuál es la talla mínima legal para retener un ${target.name} en Baleares?`,
                image: null,
                options,
                explanation: `La talla mínima del ${target.name} es ${talla} ${unit}.`
            };
        },
        // Tipo 2: ¿Cuál de estos peces tiene la talla mínima más alta?
        (target, distractors) => {
            const allFish = [target, ...distractors].filter(s => getProp(s, 'Talla mínima legal'));
            if (allFish.length < 4) return null;
            const sorted = [...allFish].sort((a, b) =>
                parseInt(getProp(b, 'Talla mínima legal')) - parseInt(getProp(a, 'Talla mínima legal'))
            );
            const correct = sorted[0];
            const options = shuffleArray(
                allFish.map(f => ({
                    text: `${f.name} (${getProp(f, 'Talla mínima legal')} cm)`,
                    correct: f.name === correct.name
                }))
            );
            return {
                text: `¿Cuál de estos peces tiene la talla mínima legal más alta en Baleares?`,
                image: null,
                options,
                explanation: `El ${correct.name} con ${getProp(correct, 'Talla mínima legal')} cm.`
            };
        },
        // Tipo 3: ¿Qué dificultad tiene pescar X?
        (target, distractors) => {
            const dif = getProp(target, 'Dificultad');
            if (!dif) return null;
            const allDifs = ['Baja', 'Media', 'Alta', 'Muy alta'];
            const wrongDifs = allDifs.filter(d => d.toLowerCase() !== dif.toLowerCase());
            const options = shuffleArray([
                { text: dif, correct: true },
                ...pickRandom(wrongDifs, 3).map(d => ({ text: d, correct: false }))
            ]);
            return {
                text: `¿Qué nivel de dificultad tiene la pesca del ${target.name}?`,
                image: target.image,
                imageAlt: `Foto de un ejemplar de pez en su entorno natural`,
                options,
                explanation: `El ${target.name} se considera de dificultad: ${dif}.`
            };
        },
        // Tipo 4: Pregunta de cuota/límite diario
        () => {
            const options = shuffleArray([
                { text: '5 kg más una pieza por licencia y día', correct: true },
                { text: '10 kg por persona y día', correct: false },
                { text: '3 kg por persona y día', correct: false },
                { text: 'No existe límite de peso diario', correct: false }
            ]);
            return {
                text: '¿Cuál es el límite diario de extracción en pesca recreativa marítima en Baleares?',
                image: null,
                options,
                explanation: 'El tope legal es de 5 kg más una pieza por licencia y día.'
            };
        }
    ];

    const shuffledSpecies = shuffleArray(speciesData);
    for (const sp of shuffledSpecies) {
        if (questions.length >= 15) break;
        const distractors = pickRandom(speciesData.filter(s => s.name !== sp.name), 3);
        if (distractors.length < 3) continue;

        const gen = pickRandom(generators);
        const q = typeof gen === 'function' && gen.length === 0 ? gen() : gen(sp, distractors);
        if (q && q.options.length >= 4) {
            questions.push(q);
        }
    }

    // Añadir pregunta fija de cuota si no se ha generado
    if (questions.length < 10) {
        const cuotaQ = generators[3]();
        if (cuotaQ) questions.push(cuotaQ);
    }

    return questions;
}

/**
 * Genera preguntas de geografía y reservas marinas.
 */
function generateGeografiaQuestions(speciesData, zonesData) {
    const questions = [];

    const generators = [
        // Tipo 1: ¿En qué zona puedes encontrar X especie frecuentemente?
        (zone, otherZones) => {
            const speciesRaw = zone.additionalProperty?.find(p => p.name === 'Especies Frecuentes')?.value;
            if (!speciesRaw) return null;
            const speciesName = speciesRaw.split(',')[0]?.trim();
            if (!speciesName) return null;
            const options = shuffleArray([
                { text: zone.name, correct: true },
                ...otherZones.map(z => ({ text: z.name, correct: false }))
            ]);
            return {
                text: `¿En cuál de estas zonas es frecuente encontrar ${speciesName}?`,
                image: null,
                options,
                explanation: `${speciesName} se encuentra frecuentemente en ${zone.name}.`
            };
        },
        // Tipo 2: ¿Qué técnica se recomienda en X zona?
        (zone, otherZones) => {
            const tecRaw = zone.additionalProperty?.find(p => p.name === 'Técnicas Recomendadas')?.value;
            if (!tecRaw) return null;
            const otherTecs = otherZones
                .map(z => z.additionalProperty?.find(p => p.name === 'Técnicas Recomendadas')?.value)
                .filter(Boolean)
                .filter(t => t !== tecRaw);
            if (otherTecs.length < 3) {
                // Rellenar con técnicas genéricas
                const genericTecs = ['Curricán de altura', 'Pesca con mosca', 'Arrastre de fondo'];
                while (otherTecs.length < 3) {
                    const gt = genericTecs.shift();
                    if (gt && !otherTecs.includes(gt)) otherTecs.push(gt);
                    else break;
                }
            }
            if (otherTecs.length < 3) return null;
            const options = shuffleArray([
                { text: tecRaw.substring(0, 60), correct: true },
                ...pickRandom(otherTecs, 3).map(t => ({ text: t.substring(0, 60), correct: false }))
            ]);
            return {
                text: `¿Qué técnica de pesca se recomienda en ${zone.name} (${zone.address?.addressLocality || ''})?`,
                image: null,
                options,
                explanation: `En ${zone.name} se recomienda: ${tecRaw}.`
            };
        },
        // Tipo 3: ¿En qué municipio se encuentra X zona?
        (zone, otherZones) => {
            const loc = zone.address?.addressLocality;
            if (!loc) return null;
            const otherLocs = otherZones
                .map(z => z.address?.addressLocality)
                .filter(Boolean)
                .filter(l => l !== loc);
            const genericLocs = ['Felanitx', 'Manacor', 'Sóller', 'Deià', 'Calvià', 'Artà'];
            while (otherLocs.length < 3) {
                const gl = genericLocs.shift();
                if (gl && !otherLocs.includes(gl)) otherLocs.push(gl);
                else break;
            }
            if (otherLocs.length < 3) return null;
            const options = shuffleArray([
                { text: loc, correct: true },
                ...pickRandom(otherLocs, 3).map(l => ({ text: l, correct: false }))
            ]);
            return {
                text: `¿En qué municipio mallorquín se encuentra la zona de pesca "${zone.name}"?`,
                image: null,
                options,
                explanation: `${zone.name} se encuentra en ${loc}.`
            };
        }
    ];

    // Preguntas fijas de reservas marinas
    const reserveQuestions = [
        {
            text: '¿Cuál de estas NO es una Reserva Marina oficial en Mallorca?',
            image: null,
            options: shuffleArray([
                { text: 'Reserva de Cala Rajada', correct: true },
                { text: 'Reserva del Llevant', correct: false },
                { text: 'Reserva de la Bahía de Palma', correct: false },
                { text: 'Reserva de Illes Malgrats', correct: false }
            ]),
            explanation: 'Cala Rajada no tiene una reserva marina oficial declarada.'
        },
        {
            text: '¿Qué documento es obligatorio para pescar dentro de una Reserva Marina en Baleares?',
            image: null,
            options: shuffleArray([
                { text: 'Declaración responsable semanal', correct: true },
                { text: 'Permiso del Ayuntamiento', correct: false },
                { text: 'Carnet de buceador', correct: false },
                { text: 'Solo la licencia estándar', correct: false }
            ]),
            explanation: 'Se necesita una declaración responsable semanal y autorización del barco.'
        },
        {
            text: '¿Cuántos años de vigencia tiene la licencia de pesca recreativa marítima en Baleares?',
            image: null,
            options: shuffleArray([
                { text: '3 años', correct: true },
                { text: '1 año', correct: false },
                { text: '5 años', correct: false },
                { text: '2 años', correct: false }
            ]),
            explanation: 'La licencia de pesca recreativa tiene una vigencia de 3 años.'
        }
    ];

    // Generar preguntas de zonas
    if (zonesData && zonesData.length >= 2) {
        const shuffledZones = shuffleArray(zonesData);
        for (const zone of shuffledZones) {
            if (questions.length >= 12) break;
            const otherZones = zonesData.filter(z => z.name !== zone.name);
            const gen = pickRandom(generators);
            const q = gen(zone, otherZones);
            if (q && q.options.length >= 4) {
                questions.push(q);
            }
        }
    }

    // Añadir preguntas de reservas
    questions.push(...reserveQuestions);

    return shuffleArray(questions);
}

// ─── Clase Principal ────────────────────────────────────────

export class QuizEngine {
    constructor() {
        this.state = STATE.IDLE;
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.totalQuestions = 10;
        this.answers = []; // Historial de respuestas
    }

    /**
     * Inicia una nueva partida generando preguntas para la categoría dada.
     * @param {string} category - 'especies' | 'normativa' | 'geografia'
     * @param {Array} speciesData - Datos de especies
     * @param {Array} zonesData - Datos de zonas
     */
    startGame(category, speciesData, zonesData) {
        let pool = [];

        switch (category) {
            case 'especies':
                pool = generateSpeciesQuestions(speciesData);
                break;
            case 'normativa':
                pool = generateNormativaQuestions(speciesData);
                break;
            case 'geografia':
                pool = generateGeografiaQuestions(speciesData, zonesData);
                break;
            default:
                pool = generateSpeciesQuestions(speciesData);
        }

        // Tomar las 10 primeras (o todas si hay menos)
        this.questions = shuffleArray(pool).slice(0, this.totalQuestions);
        this.currentIndex = 0;
        this.score = 0;
        this.answers = [];
        this.state = this.questions.length > 0 ? STATE.PLAYING : STATE.FINISHED;
    }

    /**
     * Devuelve la pregunta actual.
     * @returns {object|null}
     */
    getCurrentQuestion() {
        if (this.state === STATE.FINISHED || this.currentIndex >= this.questions.length) {
            return null;
        }
        return this.questions[this.currentIndex];
    }

    /**
     * Responde la pregunta actual.
     * @param {number} optionIndex - Índice de la opción elegida (0-3).
     * @returns {{ correct: boolean, correctIndex: number, explanation: string }|null}
     */
    answerQuestion(optionIndex) {
        if (this.state !== STATE.PLAYING) return null;

        const question = this.questions[this.currentIndex];
        if (!question) return null;

        const isCorrect = question.options[optionIndex]?.correct === true;
        const correctIndex = question.options.findIndex(o => o.correct);

        if (isCorrect) {
            this.score++;
        }

        this.answers.push({
            questionIndex: this.currentIndex,
            chosenIndex: optionIndex,
            correct: isCorrect
        });

        this.state = STATE.ANSWERED;

        return {
            correct: isCorrect,
            correctIndex,
            explanation: question.explanation || ''
        };
    }

    /**
     * Avanza a la siguiente pregunta o finaliza la partida.
     * @returns {string} Estado resultante: 'PLAYING' o 'FINISHED'
     */
    nextQuestion() {
        this.currentIndex++;

        if (this.currentIndex >= this.questions.length) {
            this.state = STATE.FINISHED;
        } else {
            this.state = STATE.PLAYING;
        }

        return this.state;
    }

    /**
     * Devuelve los resultados finales de la partida.
     * @returns {{ score: number, total: number, percentage: number, grade: string }}
     */
    getResults() {
        const total = this.questions.length;
        const pct = total > 0 ? Math.round((this.score / total) * 100) : 0;
        let grade;

        if (pct >= 90) grade = '🏆 ¡Maestro Pescador!';
        else if (pct >= 70) grade = '🎣 ¡Buen Pescador!';
        else if (pct >= 50) grade = '🐟 Aprendiz de Pescador';
        else grade = '🌊 Necesitas más práctica';

        return { score: this.score, total, percentage: pct, grade };
    }

    /**
     * @returns {string} Estado actual de la máquina.
     */
    getState() {
        return this.state;
    }
}
