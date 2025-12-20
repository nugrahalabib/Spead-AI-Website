import { createDirectus, rest, staticToken, readCollections, createCollection, updateCollection, readItems, createItem, updateItem, createPermission } from '@directus/sdk';

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

async function restoreFull() {
    console.log("🚑 RESTORING 'lp_silent_killer' FULLY...");

    try {
        const token = await getAuthToken();
        const client = createDirectus(DIRECTUS_URL).with(staticToken(token)).with(rest());

        // 1. CHECK COLLECTION
        const collections = await client.request(readCollections());
        const exists = collections.find(c => c.collection === 'lp_silent_killer');

        if (!exists) {
            console.log("   ⚠️ Collection Missing! Recreating...");
            await client.request(createCollection({
                collection: 'lp_silent_killer',
                schema: {},
                meta: {
                    singleton: true,
                    hidden: false,
                    icon: 'radar',
                    note: 'Problem Agitation Section (Radar)',
                    display_template: '{{section_headline}}',
                    sort: 3
                }
            }));
        } else {
            console.log("   ✅ Collection Exists.");
            // Force singleton meta just in case
            await client.request(updateCollection('lp_silent_killer', {
                meta: { singleton: true, hidden: false, icon: 'radar' }
            }));
        }

        // 2. CHECK ITEM (ROW 1)
        // For Singletons, Directus expects a row to exist.
        try {
            // Try reading as singleton first
            const item = await client.request(readItems('lp_silent_killer', { limit: 1 }));
            if (!item || item.length === 0) {
                throw new Error("No items");
            }
            console.log("   ✅ Item Exists.");
        } catch (e) {
            console.log("   ⚠️ Content Missing! Creating Default Row...");
            try {
                const defaultData = {
                    section_headline: "The {Silent Killer:pink} of Enterprise Valuation",

                    node_1_badge: "FINANCIAL LEAK",
                    node_1_title: "IDR 102M",
                    node_1_subtitle: "LOSS PER EMPLOYEE / YR",
                    node_1_chart_type: "bar_chart_decline",
                    node_1_bullets: ["Wasted Billable Hours", "Un-invoiced Overage", "Revenue Leakage"],

                    node_2_badge: "ADMIN DRAIN",
                    node_2_title: "40% Time",
                    node_2_subtitle: "NON-BILLABLE WORK",
                    node_2_chart_type: "radial_progress",
                    node_2_bullets: ["Manual Data Entry", "Document Search", "Formatting & Reports"],

                    node_3_badge: "CRITICAL LIABILITY",
                    node_3_title: "High Risk",
                    node_3_subtitle: "HUMAN ERROR",
                    node_3_chart_type: "alert_box",
                    node_3_bullets: ["Contract Loopholes", "Missed Clauses", "Compliance Failures"]
                };
                await client.request(createItem('lp_silent_killer', defaultData));
                console.log("   ✅ Content Restored.");
            } catch (createErr) {
                console.error("   ❌ Failed to create item:", createErr);
            }
        }

        // 3. CHECK PERMISSIONS
        console.log("   🔒 Verifying Permissions...");
        await client.request(createPermission({
            role: null,
            collection: 'lp_silent_killer',
            action: 'read',
            fields: ['*']
        })).catch(() => { }); // Ignore Duplicate

        console.log("✅ RESTORE COMPLETE. PLEASE REFRESH DIRECTUS.");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

restoreFull();
