// Native fetch in Node 18+
async function auditFrontendSeo() {
    const URL = 'http://localhost:3000';
    console.log(`🕵️ Auditing SEO at ${URL}...`);

    try {
        const res = await fetch(URL, { headers: { 'Cache-Control': 'no-cache' } });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const html = await res.text();

        console.log('\n📄 HTML Analysis:');

        // 1. Check Title (regex handles newlines/spaces)
        const titleMatch = html.match(/<title>(.*?)<\/title>/s);
        if (titleMatch) {
            console.log(`   ✅ <title>: "${titleMatch[1].trim()}"`);
        } else {
            console.log('   ❌ <title> NOT FOUND');
        }

        // 2. Check Description
        const descMatch = html.match(/<meta name="description" content="(.*?)"/);
        if (descMatch) {
            console.log(`   ✅ Description: "${descMatch[1]}"`);
        } else {
            console.log('   ❌ Description NOT FOUND');
        }

        // 3. Check Keywords
        const kwMatch = html.match(/<meta name="keywords" content="(.*?)"/);
        if (kwMatch) {
            console.log(`   ✅ Keywords: "${kwMatch[1]}"`);
        } else {
            console.log('   ❌ Keywords NOT FOUND');
        }

        // 4. Check OG
        const ogTitle = html.match(/<meta property="og:title" content="(.*?)"/);
        if (ogTitle) {
            console.log(`   ✅ OG Title: "${ogTitle[1]}"`);
        } else {
            console.log('   ⚠️  OG Title NOT FOUND');
        }

        console.log('\n🏁 Audit Complete.');

    } catch (err) {
        console.error(`❌ Audit Failed: ${err.message}`);
        if (err.cause) console.error(err.cause);
    }
}

auditFrontendSeo();
