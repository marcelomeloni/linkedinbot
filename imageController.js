import dotenv from 'dotenv';

dotenv.config();

// ─── Pollinations gen.pollinations.ai com sk_ key ─────────────────────────────
const generateWithPollinations = async (imagePrompt) => {
    const apiKey = process.env.POLLINATIONS_API_KEY;
    if (!apiKey) throw new Error('POLLINATIONS_API_KEY não encontrada no .env');

    const encodedPrompt = encodeURIComponent(imagePrompt);
    const url = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1080&height=1080&model=flux&nologo=true`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${apiKey}` },
            signal: controller.signal,
        });

        if (!response.ok) {
            const body = await response.text().catch(() => '');
            throw new Error(`Pollinations retornou ${response.status}: ${body.slice(0, 300)}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength < 5000) {
            throw new Error('Imagem retornada muito pequena — provável erro silencioso.');
        }

        return Buffer.from(arrayBuffer);
    } finally {
        clearTimeout(timeout);
    }
};

// ─── Gemini (ativo quando GEMINI_BILLING=true) ────────────────────────────────
const generateWithGemini = async (imagePrompt) => {
    const { GoogleGenAI } = await import('@google/genai');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY não encontrada no .env');

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: imagePrompt,
        config: {
            responseModalities: ['IMAGE'],
            imageConfig: { aspectRatio: '1:1' },
        },
    });

    const parts = response.candidates[0].content.parts;
    const imagePart = parts.find(p => p.inlineData);
    if (!imagePart) throw new Error('Nenhuma imagem retornada pelo Gemini.');

    return Buffer.from(imagePart.inlineData.data, 'base64');
};

// ─── Exportação principal ─────────────────────────────────────────────────────
export const generateImage = async (imagePrompt) => {
    console.log('\n🎨 Iniciando geração da imagem em memória...');
    console.log(`Prompt utilizado: "${imagePrompt}"`);

    const useGemini = process.env.GEMINI_BILLING === 'true';
    let buffer;

    try {
        if (useGemini) {
            console.log('🔷 Usando Gemini (billing ativo)...');
            buffer = await generateWithGemini(imagePrompt);
        } else {
            console.log('🖼️  Usando Pollinations FLUX (sk_ key)...');
            buffer = await generateWithPollinations(imagePrompt);
        }
    } catch (error) {
        console.error(`❌ Erro ao gerar imagem: ${error.message}`);
        return { success: false, error: error.message };
    }

    console.log(`✅ Imagem gerada em memória com sucesso!\n`);
    return { success: true, buffer };
};