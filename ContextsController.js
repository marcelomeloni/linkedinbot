import { supabase } from './supabase.js';
import { postTypes } from './types.js';
import { generateWithGemini } from './promptGenerator.js';
import { generateImage } from './imageController.js'; 
import { postToLinkedIn } from './linkedinController.js';

export const handleGeneratePost = async (req, res) => {
    try {
        // 1. Busca o último post no Supabase para saber o 'type'
        const { data: lastPost, error: fetchError } = await supabase
            .from('posts')
            .select('type, subject')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError; 
        }

        // 2. Define o próximo Type
        let nextTypeId = 1;
        if (lastPost && lastPost.type) {
            nextTypeId = (parseInt(lastPost.type) % 4) + 1;
        }
        const currentTypeContext = postTypes[nextTypeId];

        // 3. Pega TODOS os subjects
        const { data: recentPosts, error: recentError } = await supabase
            .from('posts')
            .select('subject')
            .order('created_at', { ascending: false });
            
        if (recentError) throw recentError;

        const usedSubjects = recentPosts && recentPosts.length > 0 
            ? recentPosts.map(p => p.subject).join(', ') 
            : '';

        // 4. Envia pro PromptGenerator
        const { postContent, generatedSubject, imagePrompt, fullPrompt } = await generateWithGemini(currentTypeContext, usedSubjects);

        // 5. Chama o controller de imagem (agora retorna em memória)
        console.log("🎨 Gerando imagem em memória...");
        const imageResult = await generateImage(imagePrompt);

        // 6. 🚀 POSTA NO LINKEDIN
        let linkedinStatus = "Não postado";
        if (imageResult.success) {
            console.log("🚀 Iniciando publicação no LinkedIn...");
            
            // Passamos o Buffer da imagem direto para o LinkedIn, sem arquivos físicos
            const publishResult = await postToLinkedIn(postContent, imageResult.buffer);
            
            if (publishResult.success) {
                console.log(`✅ Post publicado com sucesso! ID: ${publishResult.postId}`);
                linkedinStatus = `Publicado (ID: ${publishResult.postId})`;
            } else {
                console.log(`❌ Erro no LinkedIn: ${publishResult.error}`);
                linkedinStatus = `Falha: ${publishResult.error}`;
            }
        }

        // 7. Salva no banco o novo post
        const { error: insertError } = await supabase
            .from('posts')
            .insert([{
                type: currentTypeContext.id.toString(),
                prompt: fullPrompt, 
                post: postContent,
                subject: generatedSubject,
                post_date: new Date().toISOString().split('T')[0]
            }]);

        if (insertError) throw insertError;

        console.log("✅ Ciclo de produção completo!");

        return res.status(200).json({ 
            success: true, 
            type: currentTypeContext.name,
            subject: generatedSubject,
            linkedin_status: linkedinStatus
        });

    } catch (error) {
        console.error("Erro na geração:", error);
        return res.status(500).json({ error: error.message });
    }
};