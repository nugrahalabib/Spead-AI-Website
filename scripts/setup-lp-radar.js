import dotenv from 'dotenv';
// dotenv.config();

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@spead.ai';
const ADMIN_PASSWORD = 'password123';

async function setupLpRadar() {
    try {
        console.log(`🔌 Connecting to Directus at ${DIRECTUS_URL}...`);

        // 1. Authenticate
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const token = (await loginRes.json()).data.access_token;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Authenticated.');

        // 2. Ensure Collection Exists
        console.log('\n📦 Checking Collection lp_radar...');
        const checkColl = await fetch(`${DIRECTUS_URL}/collections/lp_radar`, { headers });
        if (checkColl.status === 404) {
            console.log('   - Not found. Creating...');
            const createColl = await fetch(`${DIRECTUS_URL}/collections`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    collection: 'lp_radar',
                    schema: {}, // Critical
                    singleton: true,
                    note: 'Radar / Pain Points Section',
                    meta: { icon: 'radar', sort: 3 }
                })
            });
            if (!createColl.ok) throw new Error(`Failed to create collection: ${await createColl.text()}`);
            console.log('   ✅ Created lp_radar');
        } else {
            console.log('   - Collection exists.');
        }

        // 3. Define Fields
        const statusChoices = [
            { text: "Critical (Red)", value: "red" },
            { text: "Warning (Orange)", value: "orange" },
            { text: "Safe (Green)", value: "green" }
        ];

        const fields = [
            // --- Group 1: Header ---
            {
                field: 'div_header', type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Section Header' }, sort: 1, special: ['alias', 'no-data'] }
            },
            {
                field: 'section_headline', type: 'string',
                meta: { interface: 'input', sort: 2, width: 'full', note: "The scary title above the metrics." },
                schema: { default_value: "The Silent Killer of Enterprise Growth" }
            },
            {
                field: 'section_subheadline', type: 'text',
                meta: { interface: 'input-multiline', sort: 3, width: 'full', note: "Descriptive text." },
                schema: { default_value: "Inefficiency is not just annoying. It is expensive." }
            },

            // --- Group 2: Financial Metric ---
            {
                field: 'div_money', type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Metric 1: Financial Impact' }, sort: 10, special: ['alias', 'no-data'] }
            },
            {
                field: 'metric_money_value', type: 'string',
                meta: { interface: 'input', sort: 11, width: 'half', note: "e.g. IDR 102M" }
            },
            {
                field: 'metric_money_label', type: 'string',
                meta: { interface: 'input', sort: 12, width: 'half', note: "e.g. Annual Loss / Dept" }
            },
            {
                field: 'metric_money_status', type: 'string',
                meta: { interface: 'select-dropdown', sort: 13, width: 'full', options: { choices: statusChoices } },
                schema: { default_value: "red" }
            },

            // --- Group 3: Time Metric ---
            {
                field: 'div_time', type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Metric 2: Operational Velocity' }, sort: 20, special: ['alias', 'no-data'] }
            },
            {
                field: 'metric_time_value', type: 'string',
                meta: { interface: 'input', sort: 21, width: 'half', note: "e.g. 40%" }
            },
            {
                field: 'metric_time_label', type: 'string',
                meta: { interface: 'input', sort: 22, width: 'half', note: "e.g. Billable Hours Wasted" }
            },
            {
                field: 'metric_time_status', type: 'string',
                meta: { interface: 'select-dropdown', sort: 23, width: 'full', options: { choices: statusChoices } },
                schema: { default_value: "orange" }
            },

            // --- Group 4: Risk Metric ---
            {
                field: 'div_risk', type: 'alias',
                meta: { interface: 'presentation-divider', options: { title: 'Metric 3: Legal Risk' }, sort: 30, special: ['alias', 'no-data'] }
            },
            {
                field: 'metric_risk_value', type: 'string',
                meta: { interface: 'input', sort: 31, width: 'half', note: "e.g. Critical" }
            },
            {
                field: 'metric_risk_label', type: 'string',
                meta: { interface: 'input', sort: 32, width: 'half', note: "e.g. Liability Exposure" }
            },
            {
                field: 'metric_risk_status', type: 'string',
                meta: { interface: 'select-dropdown', sort: 33, width: 'full', options: { choices: statusChoices } },
                schema: { default_value: "red" }
            }
        ];

        // 4. Create Fields
        console.log('\n🏗️  Creating Fields...');

        for (const f of fields) {
            // Check if exists
            const check = await fetch(`${DIRECTUS_URL}/fields/lp_radar/${f.field}`, { headers });

            if (check.ok) {
                console.log(`   - ${f.field} exists. Updating meta...`);
                await fetch(`${DIRECTUS_URL}/fields/lp_radar/${f.field}`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({ meta: f.meta })
                });
            } else {
                console.log(`   - Creating ${f.field}...`);
                const res = await fetch(`${DIRECTUS_URL}/fields/lp_radar`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        field: f.field,
                        type: f.type,
                        meta: f.meta,
                        schema: f.schema || {}
                    })
                });
                if (!res.ok) {
                    console.error(`     ❌ Failed: ${await res.text()}`);
                }
            }
        }

        // 5. Public Access
        console.log('\n🔓 Ensuring Public Access...');
        const permRes = await fetch(`${DIRECTUS_URL}/permissions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                role: null,
                collection: 'lp_radar',
                action: 'read',
                fields: ['*']
            })
        });
        if (permRes.ok) console.log('   ✅ Public Read granted.');
        else console.log('   - Permission likely already exists.');

        console.log('\n🎉 Success: Radar Metrics Admin Panel created.');

    } catch (err) {
        console.error('\n❌ Script failed:', err.message);
        process.exit(1);
    }
}

setupLpRadar();
