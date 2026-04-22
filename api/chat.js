const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");

// ============================================================
// GROQ API
// ============================================================
const groq = new Groq({
  apiKey: "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",
});

// ============================================================
// MÓDULO 1: RETRIEVER
// Carga base.txt y construye el índice TF-IDF al iniciar
// ============================================================

const STOPWORDS = new Set([
  "de","la","el","en","y","a","que","es","se","los","del","las","un","una","por",
  "con","para","su","al","lo","como","mas","pero","sus","le","ya","o","me","si",
  "no","este","esta","son","han","hay","ser","fue","eso","mi","tu","te","nos",
  "les","todo","bien","muy","aqui","ahi","igual","cuando","tambien","cada","pueden",
  "puede","tiene","tienen","hacer","solo","sobre","entre","desde","hasta","donde",
  "porque","aunque","sin","ante","bajo","contra","durante","hacia","segun","tras",
  "cual","cuales","estos","estas","esos","esas","uno","dos","tres","otra","otro",
  "otras","otros","menos","tan","tanto","mucho","poco","hay","esta","estan",
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
  Object.keys(tf).forEach((t) => { vec[t] = tf[t] * (idf[t] || 1); });
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

// --- Cargar y parsear base.txt ---
function loadKnowledgeBase() {
  const filePath = path.join(__dirname, "..", "base.txt");
  const content = fs.readFileSync(filePath, "utf-8");

  // Separar por secciones: == TITULO == seguido de contenido
  const sections = content.split(/==\s*[^=]+\s*==/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 30); // descartar fragmentos muy cortos

  console.log(`📖 base.txt cargado: ${sections.length} fragmentos de conocimiento`);
  return sections;
}

// --- Construir índice TF-IDF al cargar el módulo ---
let KNOWLEDGE_CHUNKS, allTokenized, idfScores, chunkIndex;

try {
  KNOWLEDGE_CHUNKS = loadKnowledgeBase();
  allTokenized = KNOWLEDGE_CHUNKS.map((chunk) => tokenize(chunk));
  idfScores = computeIDF(allTokenized);
  chunkIndex = KNOWLEDGE_CHUNKS.map((chunk, i) => ({
    vector: tfidfVector(computeTF(allTokenized[i]), idfScores),
    text: chunk,
  }));
  console.log(`✅ Índice TF-IDF listo con ${chunkIndex.length} fragmentos`);
} catch (err) {
  console.error("❌ Error cargando base.txt:", err.message);
  KNOWLEDGE_CHUNKS = [];
  chunkIndex = [];
}

// --- Retriever: Top-K chunks más relevantes ---
function retrieveTopK(query, k = 4) {
  if (chunkIndex.length === 0) return [];

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const queryTF = computeTF(queryTokens);
  const queryVec = tfidfVector(queryTF, idfScores);

  const scored = chunkIndex.map((doc) => ({
    text: doc.text,
    score: cosineSimilarity(queryVec, doc.vector),
  }));

  scored.sort((a, b) => b.score - a.score);
  // Umbral mínimo de relevancia: 0.05
  return scored.slice(0, k).filter((s) => s.score > 0.05);
}

// ============================================================
// MÓDULO 2: GENERATOR — Groq + Llama 3.3
// ============================================================

const SYSTEM_PROMPT = `Eres LuminaBot, la asesora de belleza virtual de Lumina Radiance — una tienda de cosméticos para el cuidado personal femenino.

REGLAS ESTRICTAS:
1. Responde ÚNICAMENTE con la información del CONTEXTO proporcionado abajo. NO inventes productos, precios ni datos que no estén en el contexto.
2. Si el contexto no tiene información suficiente, dilo amablemente y sugiere temas en los que sí puedes ayudar.
3. Tono cálido, femenino y profesional. Usa 1-3 emojis por respuesta.
4. Usa viñetas (•), negritas (**texto**) y saltos de línea para respuestas claras y fáciles de leer.
5. Respuestas concisas pero completas (máximo 180 palabras).
6. Termina siempre con una pregunta o invitación a seguir conversando.
7. Si el usuario saluda, preséntate brevemente y ofrece ayuda.
8. Si el usuario se despide, despídete de forma cálida.`;

async function generateResponse(userMessage, contextChunks) {
  const contextText = contextChunks.length > 0
    ? contextChunks.map((c, i) => `[Fragmento ${i + 1}]:\n${c.text}`).join("\n\n")
    : "No se encontró información relevante en la base de conocimiento.";

  const userPrompt = `CONTEXTO DE LA BASE DE CONOCIMIENTO:
${contextText}

PREGUNTA DEL USUARIO:
${userMessage}

Responde basándote ESTRICTAMENTE en el contexto proporcionado.`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user",   content: userPrompt },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    max_tokens: 600,
    top_p: 0.9,
  });

  return chatCompletion.choices[0]?.message?.content
    ?? "Lo siento, no pude generar una respuesta. 🌸";
}

// ============================================================
// ENDPOINT — Vercel Serverless Function
// ============================================================
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "El campo 'message' es requerido." });
  }

  const userMessage = message.trim();

  try {
    // PASO 1 — RETRIEVER: busca los chunks más relevantes en base.txt
    const topChunks = retrieveTopK(userMessage, 4);
    console.log(`📚 Retriever: ${topChunks.length} chunks para: "${userMessage}"`);
    topChunks.forEach((c, i) =>
      console.log(`  [${i+1}] score=${c.score.toFixed(4)} → ${c.text.substring(0, 70)}...`)
    );

    // PASO 2 — GENERATOR: Groq genera la respuesta usando los chunks
    const reply = await generateResponse(userMessage, topChunks);
    console.log(`🤖 Generator: ${reply.length} chars generados`);

    return res.status(200).json({
      reply,
      debug: {
        chunksUsed: topChunks.length,
        topScores: topChunks.map((c) => c.score.toFixed(4)),
      },
    });

  } catch (error) {
    console.error("❌ Error RAG:", error.message);
    return res.status(500).json({
      reply: "Disculpa, tuve un problema. ¿Podrías intentarlo de nuevo? 🌸",
      error: error.message,
    });
  }
};
