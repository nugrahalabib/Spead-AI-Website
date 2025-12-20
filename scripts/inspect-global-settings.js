const { createDirectus, rest, authentication, readFields } = await import('@directus/sdk');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

const client = createDirectus(DIRECTUS_URL)
    .with(authentication())
    .with(rest());

async function main() {
    try {
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        client.setToken(loginData.data.access_token);

        const fields = await client.request(readFields('global_settings'));

        console.log('--- GLOBAL SETTINGS FIELDS ---');
        fields.forEach(f => {
            console.log(`Field: ${f.field.padEnd(25)} | Group: ${(f.meta?.group || 'ROOT').padEnd(20)} | Note: ${(f.meta?.note || '').substring(0, 30)}`);
        });

    } catch (e) {
        console.error('Error:', e);
    }
}

main();
