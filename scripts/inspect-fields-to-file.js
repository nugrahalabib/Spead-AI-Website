const { createDirectus, rest, authentication, readFields } = await import('@directus/sdk');
import fs from 'fs';

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
        const loginData = await loginRes.json();
        client.setToken(loginData.data.access_token);

        const fields = await client.request(readFields('global_settings'));

        let output = '--- FIELDS ---\n';
        fields.forEach(f => {
            output += `Field: ${f.field} | Group: ${f.meta?.group} | Note: ${f.meta?.note}\n`;
        });

        fs.writeFileSync('final_fields_list.txt', output);
        console.log('Written to final_fields_list.txt');

    } catch (e) {
        console.error('Error:', e);
    }
}

main();
