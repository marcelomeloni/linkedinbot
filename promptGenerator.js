import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const baseContext = JSON.parse(fs.readFileSync('./context.json', 'utf-8'));

// Extrai JSON mesmo quando o modelo suja a resposta
const extractJSON = (raw) => {
    let clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

    try { return JSON.parse(clean); } catch (_) {}

    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('Nenhum JSON encontrado na resposta.');

    const jsonSlice = clean.slice(start, end + 1);
    try { return JSON.parse(jsonSlice); } catch (_) {}

    const sanitized = jsonSlice
        .replace(/:\s*"([\s\S]*?)(?<!\\)"/g, (match, value) => {
            const escaped = value
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '')
                .replace(/\t/g, '\\t')
                .replace(/(?<!\\)"/g, '\\"');
            return `: "${escaped}"`;
        });

    return JSON.parse(sanitized);
};

export const generateWithGemini = async (currentTypeContext, usedSubjects) => {
    try {
        const exclusionRule = usedSubjects?.trim()
            ? `ASSUNTOS JÁ USADOS — NÃO REPITA NENHUM DELES: [${usedSubjects}].
Isso inclui temas tangenciais. Se o tema novo tiver qualquer sobreposição com os anteriores, descarte e escolha outro completamente diferente.`
            : `Primeiro post. Escolha o tema de maior tensão técnica e mais específico ao universo do autor.`;

        const prompt = `
${JSON.stringify(baseContext, null, 2)}

---
TIPO DE POST: ${currentTypeContext.name}
${currentTypeContext.context}

---
${exclusionRule}

---
PROCESSO OBRIGATÓRIO ANTES DE ESCREVER (interno — não aparece na saída):

Etapa 1 — ENCONTRE A CENA:
Qual é o momento físico e específico que ancora este post?
Não é o tema abstrato. É o instante concreto: o número errado no terminal, a função que não retornava, o deploy que silenciosamente corrompeu estado, a transação que executou duas vezes.
Se não encontrar uma cena concreta e específica, troque o tema até encontrar uma.

Etapa 2 — ENCONTRE A ADMISSÃO HONESTA:
O que esse post revela que o autor preferiria não ter que admitir?
Um erro de julgamento, horas perdidas numa hipótese errada, uma suposição óbvia em retrospecto.
Posts sem admissão honesta soam como propaganda. Com ela, soam como conversa real.

Etapa 3 — CONSTRUA O GANCHO:
A primeira frase começa no meio da cena ou do problema — nunca na introdução dele.
Ela deve criar uma micro-tensão que só se resolve lendo o resto.
Teste: se a frase puder ser respondida com "interessante" e esquecida, descarte e reescreva.
Teste: se começar com substantivo abstrato ("A idempotência", "Sistemas distribuídos", "O conceito de X"), descarte.
Teste: se começar com qualquer palavra da lista proibida (Hoje, Recentemente, Todo desenvolvedor, Imagine, Olá), descarte.

Etapa 4 — TESTE DE VOZ ANTES DE FINALIZAR:
Leia o post inteiro em voz alta mentalmente.
Soa como alguém falando para um colega ou como alguém escrevendo para impressionar?
Alguma frase parece retirada de documentação técnica ou artigo de blog genérico? Reescreva em linguagem falada.
O post tem ritmo? Alterna entre frases curtas de impacto e frases de desenvolvimento?
Existe algum asterisco (*), underscore (_) ou qualquer marcação Markdown? Remova imediatamente.
O post revela uma pessoa ou poderia ter sido escrito por qualquer um? Se for qualquer um, reescreva.

---
REGRA DE OUTPUT DO JSON:
Não use aspas duplas dentro dos valores de string. Use aspas simples se precisar citar algo.
Não inclua quebras de linha literais — use \\n para separar parágrafos.
Não use nenhum caractere que quebre JSON válido.

RETORNE APENAS O JSON ABAIXO, sem nenhum texto antes ou depois, sem blocos markdown:

{
  "subject": "título interno curto — só para controle de exclusão, nunca aparece no post",
  "postContent": "texto completo do post. Primeira linha é o gancho direto, sem label, sem título. Parágrafos separados por \\n\\n. Hashtags na última linha separadas por espaço.",
  "image_prompt": "You are a Film Director of Photography and Art Director combined. Write an ultra-detailed prompt in ENGLISH to generate the cover image for this LinkedIn post. Deeply analyze the core emotion and the specific scene of the post you just created. Choose a strong visual metaphor — something cinematic, with defined composition, lighting mood, and atmosphere. AVOID all tech clichés: no circuit boards, no connected dots, no glowing data cubes, no blue network graphs. Think instead: a physical scene, a texture, a human moment, an environmental metaphor that captures the same emotional tension as the post. Describe camera angle, depth of field, color palette, lighting source and direction, and any physical elements in the scene with cinematic richness. ABSOLUTE RULE: zero text, zero letters, zero words, zero watermarks anywhere in the image."
}
        `.trim();

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 1.2 },
        });

        const rawText = response.candidates[0].content.parts[0].text;

        let parsed;
        try {
            parsed = extractJSON(rawText);
        } catch (parseError) {
            console.error('❌ Resposta bruta do modelo:\n', rawText.slice(0, 800));
            throw new Error(`JSON inválido mesmo após sanitização: ${parseError.message}`);
        }

        if (!parsed.postContent || !parsed.subject || !parsed.image_prompt) {
            throw new Error('JSON retornado está incompleto — campos obrigatórios ausentes.');
        }

        // Aviso se gancho parece fraco
        const ganchoFraco = /^(hoje|recentemente|olá|quero|aprendi|é importante|imagine|todo desenvolvedor|confiar|a euforia|o mercado|adicionar|cache|sistemas distribuídos|a idempotência|o conceito)/i;
        if (ganchoFraco.test(parsed.postContent.trim())) {
            console.warn('⚠️  Gancho potencialmente fraco detectado — considere rodar novamente.');
        }

        return {
            postContent: parsed.postContent,
            generatedSubject: parsed.subject,
            imagePrompt: parsed.image_prompt,
            fullPrompt: prompt,
        };

    } catch (error) {
        console.error('Erro no promptGenerator:', error.message);
        throw new Error('Falha ao gerar conteúdo com o Gemini.');
    }
};