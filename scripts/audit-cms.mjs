import { createDirectus, rest, authentication, readFields, readRelations } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

async function auditCms() {
    try {
        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            })
        });
        const loginData = await loginRes.json();
        await directus.setToken(loginData.data.access_token);

        console.log('--- AUDIT START ---');

        // 1. Check Global Logo
        console.log('\n[Global] Checking website_logo...');
        const globalFields = await directus.request(readFields('global'));
        const logoField = globalFields.find(f => f.field === 'website_logo');

        if (!logoField) console.error('❌ website_logo field MISSING in Global');
        else {
            console.log(`✅ website_logo exists. Interface: ${logoField.meta?.interface} (Expected: file-image)`);
            if (logoField.meta?.interface !== 'file-image') console.warn('⚠️ Interface mismatch! Should be file-image');
        }

        const relations = await directus.request(readRelations());
        const logoRel = relations.find(r => r.collection === 'global' && r.field === 'website_logo');
        if (logoRel) console.log('✅ website_logo Relation found (Linked to directus_files)');
        else console.error('❌ website_logo Relation MISSING!');


        // 2. Check SEO Keywords (Global)
        console.log('\n[SEO] Checking keywords structure...');
        const seoFields = await directus.request(readFields('seo'));
        ['home_keywords', 'journey_keywords'].forEach(k => {
            const f = seoFields.find(field => field.field === k);
            if (f) {
                console.log(`✅ ${k}: Interface '${f.meta?.interface}' (Expected: list)`);
                // Deep check options if possible, but interface is good proxy
            } else {
                console.error(`❌ ${k} MISSING!`);
            }
        });

        // 3. Check Posts Keywords
        console.log('\n[Posts] Checking seo_keywords...');
        const postFields = await directus.request(readFields('posts'));
        const postSeoVal = postFields.find(f => f.field === 'seo_keywords');
        if (postSeoVal) {
            console.log(`✅ seo_keywords: Interface '${postSeoVal.meta?.interface}' (Expected: list)`);
        } else {
            console.error(`❌ seo_keywords MISSING in Posts!`);
        }

        console.log('--- AUDIT COMPLETE ---');

    } catch (e) { console.error('Audit failed:', e); }
}

auditCms();
