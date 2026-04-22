const Groq = require("groq-sdk");

// ============================================================
// GROQ API — API Key directamente en el código
// ============================================================
const groq = new Groq({
  apiKey: "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",
});

// ============================================================
// BASE DE CONOCIMIENTO — Chunks para el Retriever
// ============================================================
const KNOWLEDGE_CHUNKS = [
  // --- Información general ---
  "Lumina Radiance es una página web de cosméticos enfocada en el cuidado personal femenino. Su misión es inspirar, educar y promocionar productos cosméticos que enfatizan la belleza auténtica, usando ingredientes nobles y naturales. La página tiene un estilo visual femenino, elegante y moderno, con colores suaves como Crema, Rosa Viejo y Terracota.",

  // --- Cuidado Facial ---
  "La colección de Cuidado Facial de Lumina Radiance incluye cremas hidratantes y serums para mantener la piel radiante, suave y llena de vida. Las cremas hidratantes penetran en las capas profundas del cutis para combatir la resequedad día a día. Los serums concentrados tienen ingredientes activos que previenen los signos de la edad y devuelven la luminosidad natural al rostro. Son ideales para usar mañana y noche, sobre piel limpia.",

  // --- Serums Anti-Edad ---
  "Los serums anti-edad de Lumina Radiance están formulados con ingredientes activos que penetran en las capas profundas del cutis, previenen y reducen líneas finas y arrugas, y restauran la luminosidad y firmeza de la piel. Se usan después de la limpieza y antes de la crema hidratante, tanto de mañana como de noche. Los resultados se notan desde las primeras semanas de uso.",

  // --- Cremas Hidratantes ---
  "Las cremas hidratantes de Lumina Radiance tienen textura rica que se absorbe rápido sin dejar sensación grasosa. Son ideales para pieles resecas. Los pasos de aplicación recomendados son: primero limpia tu rostro, luego aplica el serum con movimientos suaves, después sella con la crema hidratante y listo para el día.",

  // --- Maquillaje Natural ---
  "La colección de Maquillaje Natural de Lumina Radiance permite realzar la belleza auténtica con bases ligeras con acabado sedoso que no obstruyen los poros, iluminadores sutiles y tonos neutros que dan un look fresco, saludable y sin esfuerzo. Perfecto para el uso diario, la piel respira y se ve radiante todo el día.",

  // --- Cuidado Corporal ---
  "La colección de Cuidado Corporal de Lumina Radiance ofrece una experiencia de spa en casa con lociones nutritivas con aromas relajantes que hidratan profundamente de pies a cabeza, y exfoliantes naturales que remueven células muertas y mejoran la textura y elasticidad de la piel. El resultado es una piel suave, renovada y con sensación de bienestar duradera.",

  // --- Exfoliación ---
  "Los exfoliantes de Lumina Radiance están hechos con ingredientes naturales que remueven suavemente las células muertas, mejoran la textura y tono de la piel, y preparan la piel para absorber mejor las lociones hidratantes. La frecuencia ideal de exfoliación es de 2 a 3 veces por semana. No se debe exfoliar en exceso para no irritar la piel.",

  // --- Catálogo / Colecciones ---
  "Lumina Radiance tiene tres colecciones principales de productos: 1) Cuidado Facial con cremas hidratantes y serums para un cutis luminoso, 2) Maquillaje Natural con bases y tonos neutros para un look fresco y saludable, 3) Cuidado Corporal con lociones y exfoliantes de ingredientes naturales. Cada colección está diseñada con ingredientes nobles para resaltar la belleza auténtica.",

  // --- Consejo: Protector Solar ---
  "El protector solar es uno de los pasos más importantes de cualquier rutina de belleza. Debe aplicarse todos los días del año, incluso en días nublados, en interiores frente a pantallas y en invierno. El sol es el principal factor de envejecimiento prematuro. Se aplica como último paso de la rutina de mañana antes de maquillarse.",

  // --- Consejo: Limpieza Nocturna ---
  "La limpieza facial nocturna es el paso número uno que no se debe saltar. Limpiar el rostro antes de dormir es esencial porque remueve el maquillaje, polvo y contaminación acumulados durante el día, permite que la piel respire y se regenere mientras se duerme, y mejora la absorción de cremas y serums nocturnos. Se recomienda usar un limpiador suave adecuado para cada tipo de piel.",

  // --- Consejo: Hidratación ---
  "La hidratación desde adentro es la base de toda buena rutina de belleza. Beber al menos 2 litros de agua al día ayuda a mantener la piel hidratada, suave y elástica, reducir la aparición de líneas finas, y dar luminosidad y un tono más uniforme al cutis.",

  // --- Consejo: Masajes Faciales ---
  "Los masajes faciales son el secreto para maximizar el efecto de los productos de cuidado. Al aplicar cremas y serums, se deben usar movimientos suaves y ascendentes: desde el cuello hacia las mejillas, desde el centro hacia los lados de la frente, y suaves toquecitos alrededor de los ojos. Esto estimula la circulación, ayuda a absorber mejor el producto y previene la pérdida de firmeza. Solo 2 minutos al día hacen la diferencia.",

  // --- Consejo: Descanso de piel ---
  "La piel también necesita respirar y descansar de los cosméticos pesados. Se recomienda dedicar al menos un día a la semana a dejar la piel libre de base y maquillaje pesado. Ese día enfocarse solo en limpieza, hidratación y protector solar. Es el momento ideal para dejar actuar una mascarilla nutritiva. Este hábito reduce la obstrucción de poros y permite que la piel se recupere y equilibre naturalmente.",

  // --- Consejos generales de belleza (resumen) ---
  "Los 5 consejos de belleza principales de Lumina Radiance son: 1) Limpiar el rostro antes de dormir para que la piel se regenere durante la noche, 2) Beber al menos 2 litros de agua al día para una piel luminosa desde adentro, 3) Aplicar protector solar todos los días incluso en días nublados, 4) Aplicar la crema con masajes suaves ascendentes para estimular la circulación, 5) Dar un descanso a la piel de los cosméticos pesados al menos un día a la semana.",

  // --- Formulario de Contacto ---
  "Al final de la página de Lumina Radiance hay un formulario de contacto llamado 'Ponte en Contacto'. Pide el nombre del visitante, su correo electrónico y un campo de mensaje o consulta o testimonio. Tiene un botón llamativo de color terracota que dice 'Enviar Mensaje'. Los visitantes pueden usar este formulario para hacer consultas sobre rutinas de belleza.",

  // --- Diseño y estilo visual ---
  "El diseño de la página de Lumina Radiance usa una paleta de colores suaves y femeninos: Crema, Rosa Viejo y Terracota. Las tipografías son Playfair Display para títulos (aporta elegancia) y Montserrat para textos (legibilidad). La interfaz cuenta con sombras sutiles, micro-animaciones al pasar el cursor (hover) y diseño 100% responsivo (Mobile First). Las tarjetas de productos tienen un botón 'Ver más' que revela la descripción detallada de manera dinámica sin recargar la página.",

  // --- Arquitectura técnica ---
  "Lumina Radiance es una Single Page Application. No usa base de datos SQL. Toda la información se carga dinámicamente con JavaScript. La página tiene un cabezote fijo (header) que permanece arriba al hacer scroll y un pie de página (footer). Incluye secciones de Hero, Colecciones de Productos con tarjetas interactivas, Consejo de Belleza del Día aleatorio, y Formulario de Contacto.",
];

// ============================================================
// MÓDULO 1: RETRIEVER — TF-IDF + Cosine Similarity
// ============================================================

// Stop-words en español
const STOPWORDS = new Set([
  "de","la","el","en","y","a","que","es","se","los","del","las","un","una","por",
  "con","para","su","al","lo","como","mas","pero","sus","le","ya","o","me","si",
  "no","este","esta","son","han","hay","ser","fue","eso","mi","tu","te","nos",
  "les","todo","bien","muy","aqui","ahi","igual","cuando","tambien","cada","pueden",
  "puede","tiene","tienen","hacer","solo","sobre","entre","desde","hasta","donde",
  "porque","aunque","sin","ante","bajo","contra","durante","hacia","mediante",
  "segun","tras","cual","cuales","como","estos","estas","esos","esas","uno","dos",
  "tres","otra","otro","otras","otros","mas","menos","tan","tanto","mucho","poco",
]);

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function computeTF(tokens) {
  const tf = {};
  tokens.forEach((t) => { tf[t] = (tf[t] || 0) + 1; });
  const total = tokens.length || 1;
  Object.keys(tf).forEach((t) => { tf[t] = tf[t] / total; });
  return tf;
}

function computeIDF(docs) {
  const idf = {};
  const N = docs.length;
  docs.forEach((tokens) => {
    const seen = new Set(tokens);
    seen.forEach((t) => { idf[t] = (idf[t] || 0) + 1; });
  });
  Object.keys(idf).forEach((t) => {
    idf[t] = Math.log((N + 1) / (idf[t] + 1)) + 1;
  });
  return idf;
}

function tfidfVector(tf, idf) {
  const vec = {};
  Object.keys(tf).forEach((t) => {
    vec[t] = tf[t] * (idf[t] || 1);
  });
  return vec;
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  Object.keys(vecA).forEach((t) => {
    dot += (vecA[t] || 0) * (vecB[t] || 0);
    normA += vecA[t] ** 2;
  });
  Object.keys(vecB).forEach((t) => { normB += vecB[t] ** 2; });
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Pre-construir el índice TF-IDF al cargar el módulo
const allTokenized = KNOWLEDGE_CHUNKS.map((chunk) => tokenize(chunk));
const idfScores = computeIDF(allTokenized);
const chunkIndex = KNOWLEDGE_CHUNKS.map((chunk, i) => ({
  vector: tfidfVector(computeTF(allTokenized[i]), idfScores),
  text: chunk,
}));

/**
 * Retriever: Recupera los Top-K chunks más relevantes para la query
 */
function retrieveTopK(query, k = 3) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const queryTF = computeTF(queryTokens);
  const queryVec = tfidfVector(queryTF, idfScores);

  const scored = chunkIndex.map((doc) => ({
    text: doc.text,
    score: cosineSimilarity(queryVec, doc.vector),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).filter((s) => s.score > 0.01);
}

// ============================================================
// MÓDULO 2: GENERATOR — Groq API (llama-3.3-70b-versatile)
// ============================================================

const SYSTEM_PROMPT = `Eres LuminaBot, la asesora de belleza virtual de Lumina Radiance — una tienda de cosméticos para el cuidado personal femenino.

REGLAS ESTRICTAS:
1. Responde ÚNICAMENTE con la información del CONTEXTO proporcionado. NO inventes datos, productos ni precios que no estén en el contexto.
2. Si el contexto no contiene información suficiente para responder, di amablemente que no tienes esa información y sugiere temas en los que sí puedes ayudar.
3. Usa un tono cálido, femenino, profesional y entusiasta. Usa emojis con moderación (1-3 por respuesta).
4. Estructura tus respuestas con formato claro: usa viñetas (•), negritas (**texto**) y saltos de línea para que sean fáciles de leer.
5. Las respuestas deben ser concisas pero informativas (máximo 150 palabras).
6. Siempre termina con una pregunta o invitación para continuar la conversación.
7. Si el usuario saluda, preséntate brevemente y ofrece ayuda.
8. Si el usuario se despide, despídete amablemente.`;

async function generateResponse(userMessage, contextChunks) {
  // Construir el contexto RAG
  let contextText = "No se encontró información relevante en la base de conocimiento.";
  if (contextChunks.length > 0) {
    contextText = contextChunks
      .map((c, i) => `[Fragmento ${i + 1}]: ${c.text}`)
      .join("\n\n");
  }

  const userPrompt = `CONTEXTO DE LA BASE DE CONOCIMIENTO:
${contextText}

PREGUNTA DEL USUARIO:
${userMessage}

Responde basándote estrictamente en el contexto proporcionado.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 500,
      top_p: 0.9,
    });

    return chatCompletion.choices[0]?.message?.content || "Lo siento, no pude generar una respuesta. 🌸";
  } catch (error) {
    console.error("Error en Groq API:", error.message);
    throw new Error("Error al conectar con el servicio de IA.");
  }
}

// ============================================================
// ENDPOINT — Vercel Serverless Function
// ============================================================
module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "El campo 'message' es requerido." });
  }

  const userMessage = message.trim();

  try {
    // PASO 1: RETRIEVER — Recuperar los Top 3 chunks más relevantes
    const topChunks = retrieveTopK(userMessage, 3);
    console.log(`📚 Retriever: ${topChunks.length} chunks recuperados para: "${userMessage}"`);
    topChunks.forEach((c, i) => console.log(`   [${i+1}] score=${c.score.toFixed(4)} — ${c.text.substring(0, 80)}...`));

    // PASO 2: GENERATOR — Generar respuesta con Groq
    const reply = await generateResponse(userMessage, topChunks);
    console.log(`🤖 Generator: respuesta generada (${reply.length} chars)`);

    return res.status(200).json({
      reply,
      debug: {
        chunksUsed: topChunks.length,
        topScores: topChunks.map((c) => c.score.toFixed(4)),
      },
    });
  } catch (error) {
    console.error("❌ Error en RAG pipeline:", error.message);
    return res.status(500).json({
      reply: "Disculpa, tuve un problema al procesar tu pregunta. ¿Podrías intentarlo de nuevo? 🌸",
      error: error.message,
    });
  }
};
