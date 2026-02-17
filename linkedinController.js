const LINKEDIN_API_VERSION = '202304';

const getHeaders = (token) => ({
    'Authorization': `Bearer ${token}`,
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': LINKEDIN_API_VERSION,
    'Content-Type': 'application/json'
});

const registerImageUpload = async (personUrn, token) => {
    const url = 'https://api.linkedin.com/v2/assets?action=registerUpload';
    const body = {
        registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: personUrn,
            serviceRelationships: [{
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent'
            }]
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error(`Register Upload Failed: ${await response.text()}`);
    return response.json();
};

const uploadImageBinary = async (uploadUrl, imageBuffer, token) => {
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/octet-stream'
        },
        body: imageBuffer 
    });

    if (!response.ok) throw new Error(`Image Upload Failed: ${await response.text()}`);
};

const publishPost = async (personUrn, text, assetUrn, token) => {
    const url = 'https://api.linkedin.com/v2/ugcPosts';
    const body = {
        author: personUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
            'com.linkedin.ugc.ShareContent': {
                shareCommentary: { text },
                shareMediaCategory: 'IMAGE',
                media: [{ status: 'READY', media: assetUrn }]
            }
        },
        visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error(`Post Publication Failed: ${await response.text()}`);
    return response.json();
};

export const postToLinkedIn = async (postContent, imageBuffer) => {
    const token = process.env.LINKEDIN_ACCESS_TOKEN;
    const personUrn = process.env.LINKEDIN_PERSON_URN;

    if (!token || !personUrn) {
        throw new Error('Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_PERSON_URN in .env');
    }

    try {
        const uploadData = await registerImageUpload(personUrn, token);
        const uploadUrl = uploadData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
        const assetUrn = uploadData.value.asset;

        await uploadImageBinary(uploadUrl, imageBuffer, token);
        const postResult = await publishPost(personUrn, postContent, assetUrn, token);
        
        return { success: true, postId: postResult.id };
    } catch (error) {
        console.error('LinkedIn API Error:', error.message);
        return { success: false, error: error.message };
    }
};