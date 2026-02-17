const token = "AQUiLWn0dD_m8CK6Z2A3sbIxN7xon6joYytJGqV_7c9I1I8Ug-QIWDH0tewKW43J_MahuqIfusLqPp45bnQ2fdFo3-X7H1C9kC0L7ripAvOBAFPt4uTFNbvymLdgJ5eHSEyljzHLPHyJil9qrySF0KJBwlK2XkiUsO_3RCCH4S_Svre2syzr0gF-Vt7tUusi8FdysVK0_b9a8rpUgUx-pB8i7ztRXFN-Rr4SXtgzizy1tf2ipN5DoKQpl4HfbsWMnxi1uPA9RTSEClVkyGniNS6btozMSRPr3bhXI28m4WxjrqbsuTZHV5AcxtnTCmimlMOljZ16c0WGzczjc_iT715cgTeKwg"; // Cole o token da sua print aqui dentro das aspas

async function descobrirURN() {
    try {
        // Faz a chamada para a API do LinkedIn perguntando "quem sou eu?"
        const response = await fetch("https://api.linkedin.com/v2/userinfo", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (data.sub) {
            console.log("\n🎉 Sucesso! Copie a linha abaixo e coloque no seu .env:\n");
            console.log(`LINKEDIN_PERSON_URN="urn:li:person:${data.sub}"\n`);
        } else {
            console.log("Erro ao buscar os dados:", data);
        }

    } catch (error) {
        console.error("Deu ruim:", error);
    }
}

descobrirURN();