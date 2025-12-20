import { createDirectus, rest, staticToken, updateCollection, readItems, createItem } from '@directus/sdk';

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
    const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@spead.ai', password: 'password123' })
    });
    const data = await response.json();
    return data.data?.access_token;
}

async function demoteSingleton() {
    console.log("🔓 DEMOTING 'lp_silent_killer' TO STANDARD LIST...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. DISABLE SINGLETON MODE
        // This stops the UI from auto-redirecting to a specific ID (which is failing).
        // It will now show a simple List View.
        console.log("   - Updating Meta: singleton = false");
        await client.request(updateCollection('lp_silent_killer', {
            meta: {
                singleton: false,
                hidden: false,
                icon: 'radar',
                note: 'Silent Killer List (Edit the first item)',
                sort: 3
            }
        }));

        // 2. ENSURE CONTENT EXISTS
        const items = await client.request(readItems('lp_silent_killer')).catch(() => []);
        if (items.length === 0) {
            console.log("   - List is empty. Creating default item...");
            const defaultData = {
                section_headline: "The {Silent Killer:pink} of Enterprise Valuation",
                node_1_badge: "FINANCIAL LEAK",
                node_1_title: "IDR 102M",
                node_1_subtitle: "LOSS PER EMPLOYEE",
                node_1_chart_type: "bar_chart_decline",
                node_1_bullets: ["Wasted Billable Hours", "Un-invoiced Overage"],
                node_2_badge: "ADMIN DRAIN",
                node_2_title: "40% Time",
                node_2_subtitle: "NON-BILLABLE WORK",
                node_2_chart_type: "radial_progress",
                node_2_bullets: ["Manual Data Entry", "Document Search"],
                node_3_badge: "CRITICAL LIABILITY",
                node_3_title: "High Risk",
                node_3_subtitle: "HUMAN ERROR",
                node_3_chart_type: "alert_box",
                node_3_bullets: ["Contract Loopholes", "Missed Clauses"]
            };
            await client.request(createItem('lp_silent_killer', defaultData));
            console.log("   ✅ Item Created.");
        } else {
            console.log("   ✅ Item already exists.");
        }

        console.log("🎉 FIXED: It is now a Regular List. You should be able to open it!");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

demoteSingleton();
