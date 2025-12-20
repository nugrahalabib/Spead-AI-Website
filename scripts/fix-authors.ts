const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function fix() {
    console.log('🔧 Fixing Authors status field...');

    // Login
    const loginRes = await fetch(URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { data: { access_token: token } } = await loginRes.json();
    console.log('✅ Authenticated');

    const headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };

    // Add status field to authors
    try {
        const res = await fetch(URL + '/fields/authors', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                field: 'status',
                type: 'string',
                schema: { default_value: 'active' },
                meta: {
                    interface: 'select-dropdown',
                    options: {
                        choices: [
                            { text: 'Active', value: 'active' },
                            { text: 'Inactive', value: 'inactive' }
                        ]
                    }
                }
            })
        });
        console.log('📝 Status field creation:', res.ok ? 'Success' : 'Already exists or error');
    } catch (e) {
        console.log('Field might already exist');
    }

    // Update existing authors to have status = 'active'
    try {
        // Get all authors first
        const authorsRes = await fetch(URL + '/items/authors', { headers });
        const { data: authors } = await authorsRes.json();

        // Update each one
        for (const author of authors) {
            await fetch(URL + '/items/authors/' + author.id, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ status: 'active' })
            });
            console.log('   ✓ Updated:', author.name);
        }
    } catch (e: any) {
        console.log('Update error:', e.message);
    }

    console.log('✨ Fix complete!');
}

fix();
