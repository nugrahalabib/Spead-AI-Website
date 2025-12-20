const DIRECTUS_URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@nugrahalabib.com';
const PASSWORD = 'password123';

async function hideJunction() {
    console.log('🚀 Hiding Junction Table...');

    // 1. Login
    console.log('🔑 Authenticating...');
    let token;
    try {
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        token = loginData.data.access_token;
        console.log('✅ Authenticated!');
    } catch (error) {
        console.error('❌ Authentication Error:', error.message);
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    // 2. Update Collection Meta
    console.log('   🔹 Hiding blog_highlights_posts...');
    const res = await fetch(`${DIRECTUS_URL}/collections/blog_highlights_posts`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            meta: {
                hidden: true, // This hides it from the sidebar
            }
        })
    });

    if (res.ok) {
        console.log('✅ Collection hidden successfully.');
    } else {
        const err = await res.json();
        console.error('❌ Error hiding collection:', JSON.stringify(err, null, 2));
    }
}

hideJunction();
