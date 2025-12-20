import { createDirectus, rest, authentication, createCollection, createField, updateCollection, createItem, readItems } from '@directus/sdk';
import 'dotenv/config';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055')
    .with(rest())
    .with(authentication());

async function authenticate() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        })
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    await directus.setToken(data.data.access_token);
}

const COLLECTION_NAME = 'journey_items';

// Data to seed (extracted from src/app/journey/page.tsx)
const seedData = [
    // Experience
    {
        category: 'experience',
        title: "Strategic Initiative Analyst",
        subtitle: "Caliana Indonesia (PT Data Nusantara Adhikarya)",
        date_range: "Jul 2024 - Present",
        description: "Leading research for new business units (DNA Academy) and formulating 'Digital City' strategic proposals for regional governments directly under the CEO.",
        sort: 1
    },
    {
        category: 'experience',
        title: "Contract & Claim Management Officer",
        subtitle: "PT Waskita Karya (Persero) Tbk",
        date_range: "Aug 2022 - Jul 2024",
        description: "Managed contracts for National Strategic Projects (UIII, Hang Nadim Airport). Restructured documentation for ISO compliance and conducted risk analysis for billion-rupiah contracts.",
        sort: 2
    },
    {
        category: 'experience',
        title: "Exclusive Creator & Affiliate",
        subtitle: "Shopee",
        date_range: "May 2022 - Jun 2024",
        description: "Invited as a premium creator/affiliate based on high-performance metrics.",
        sort: 3
    },
    {
        category: 'experience',
        title: "Content Creator (@cuanincuy)",
        subtitle: "TikTok / Self-employed",
        date_range: "Nov 2021 - Present",
        description: "Built a tech & lifestyle community of 140K+ followers with 2.5M+ monthly views.",
        sort: 4
    },
    {
        category: 'experience',
        title: "Junior Architect Intern",
        subtitle: "PT Airmas Asri",
        date_range: "Jan 2020 - Mar 2020",
        description: "Designed concepts for School PIK 2 and conducted facade studies for major high-rise projects.",
        sort: 5
    },
    // Ventures
    {
        category: 'ventures',
        title: "Founder",
        subtitle: "Joki Hidup",
        date_range: "Jan 2025 - Present",
        description: "Academic assistance platform employing Master's degree professionals.",
        sort: 6
    },
    {
        category: 'ventures',
        title: "Owner",
        subtitle: "Gultik & Soto Masnug",
        date_range: "Feb 2024 - Present",
        description: "F&B Business elevating street food culture for the Gen Z market. 5-Star ratings on Google Maps.",
        sort: 7
    },
    {
        category: 'ventures',
        title: "Asset Manager",
        subtitle: "Mutiara 27",
        date_range: "Jan 2021 - Present",
        description: "Property management overseeing 100+ residential units/doors.",
        sort: 8
    },
    {
        category: 'ventures',
        title: "Owner & Visualizer",
        subtitle: "LAB.in Studio",
        date_range: "Sep 2020 - Present",
        description: "Creative studio providing end-to-end architectural design, build services, and visual rendering.",
        sort: 9
    },
    // Education
    {
        category: 'education',
        title: "Magister Manajemen (MM) New Ventures Innovation",
        subtitle: "Prasetiya Mulya University",
        date_range: "Oct 2024 - Present",
        description: "GPA: 3.50",
        sort: 10
    },
    {
        category: 'education',
        title: "Bachelor of Architecture",
        subtitle: "Diponegoro University (UNDIP)",
        date_range: "Aug 2017 - Dec 2021",
        description: "GPA: 3.65 (Cumlaude)",
        sort: 11
    },
    // Certifications
    {
        category: 'certifications',
        title: "Google for Startups Graduation",
        subtitle: "Google Cloud",
        date_range: "Dec 2025",
        description: "",
        highlight: true,
        sort: 12
    },
    {
        category: 'certifications',
        title: "Understanding Int. Construction Contracts",
        subtitle: "Waskita Toll Road",
        date_range: "Feb 2023",
        description: "",
        sort: 13
    },
    {
        category: 'certifications',
        title: "4th Winner Ecohouse Design Competition",
        subtitle: "UGM",
        date_range: "Sep 2019",
        description: "",
        sort: 14
    },
    {
        category: 'certifications',
        title: "BIM Learning Basic Modeling",
        subtitle: "WIKA",
        date_range: "Jun 2020",
        description: "",
        sort: 15
    },
    {
        category: 'certifications',
        title: "Financial Planning Trainer",
        subtitle: "Undip",
        date_range: "Mar 2022",
        description: "",
        sort: 16
    },
    // Organization
    {
        category: 'organization',
        title: "Trainer & Speaker: Financial Planning Training",
        subtitle: "Undip",
        date_range: "2022",
        description: "",
        sort: 17
    },
    {
        category: 'organization',
        title: "Head of Architectural Videography",
        subtitle: "Diponegoro University Club",
        date_range: "2018-2019",
        description: "",
        sort: 18
    },
    {
        category: 'organization',
        title: "Volunteer: BEKRAF",
        subtitle: "Indonesia Creative Digital Architecture",
        date_range: "2018",
        description: "",
        sort: 19
    }
];

async function setupJourney() {
    try {
        await authenticate();
        console.log(`Authenticated as ${process.env.ADMIN_EMAIL}`);
        console.log(`Checking collection: ${COLLECTION_NAME}...`);

        // 1. Check if collection exists, if not create it
        try {
            await directus.request(readItems(COLLECTION_NAME, { limit: 1 }));
            console.log(`Collection ${COLLECTION_NAME} exists.`);
        } catch (error) {
            console.log(`Creating collection ${COLLECTION_NAME}...`);
            await directus.request(createCollection({
                collection: COLLECTION_NAME,
                name: 'Journey Items',
                schema: {},
                meta: {
                    icon: 'timeline',
                    note: 'Timeline entries for Experience, Ventures, Education, etc.',
                    display_template: '{{title}}',
                    sort_field: 'sort', // AUTO-ENABLE SORTING
                    ordering_direction: 'asc'
                }
            }));

            // Create Fields
            console.log('Creating fields...');

            // Status field is default

            // Sort field (Critical for drag-and-drop)
            await directus.request(createField(COLLECTION_NAME, {
                field: 'sort',
                type: 'integer',
                meta: {
                    interface: 'input',
                    hidden: true, // Usually hidden in form, managed by drag-drop
                    sort: 1
                }
            }));

            // Category (Dropdown)
            await directus.request(createField(COLLECTION_NAME, {
                field: 'category',
                type: 'string',
                meta: {
                    interface: 'select-dropdown',
                    options: {
                        choices: [
                            { text: 'Experience', value: 'experience' },
                            { text: 'Ventures', value: 'ventures' },
                            { text: 'Education', value: 'education' },
                            { text: 'Certifications', value: 'certifications' },
                            { text: 'Organization', value: 'organization' }
                        ]
                    },
                    display: 'labels',
                    width: 'half',
                    sort: 2,
                    required: true
                }
            }));

            // Title
            await directus.request(createField(COLLECTION_NAME, {
                field: 'title',
                type: 'string',
                meta: {
                    interface: 'input',
                    width: 'half',
                    sort: 3,
                    required: true
                }
            }));

            // Subtitle (Company/School/Org)
            await directus.request(createField(COLLECTION_NAME, {
                field: 'subtitle',
                type: 'string',
                meta: {
                    interface: 'input',
                    width: 'half',
                    sort: 4
                }
            }));

            // Date Range
            await directus.request(createField(COLLECTION_NAME, {
                field: 'date_range',
                type: 'string',
                meta: {
                    interface: 'input',
                    width: 'half',
                    sort: 5
                }
            }));

            // Highlight (Boolean)
            await directus.request(createField(COLLECTION_NAME, {
                field: 'highlight',
                type: 'boolean',
                meta: {
                    interface: 'boolean',
                    width: 'half',
                    sort: 6,
                    note: 'Highlight this item with special styling?'
                }
            }));

            // Description (Short)
            await directus.request(createField(COLLECTION_NAME, {
                field: 'description',
                type: 'text',
                meta: {
                    interface: 'textarea',
                    width: 'full',
                    sort: 7
                }
            }));

            // Icon (String for Lucide)
            await directus.request(createField(COLLECTION_NAME, {
                field: 'icon',
                type: 'string',
                meta: {
                    interface: 'input',
                    width: 'half',
                    sort: 8,
                    note: 'Lucide icon name (e.g., Briefcase, GraduationCap)'
                }
            }));

            // Detail Content (Markdown)
            await directus.request(createField(COLLECTION_NAME, {
                field: 'detail_content',
                type: 'text',
                meta: {
                    interface: 'markdown',
                    width: 'full',
                    sort: 9,
                    note: 'Full details shown in popup'
                }
            }));

            // Related Post (O2M -> M2O usually, simpler to use M2O here)
            // We need a proper relation field. For simplicity in script, we'll skip complex relation creation if it's tricky, 
            // but we can add the field placeholder.
            // ... Skipping relations for script simplicity, better configured in UI if needed, or simple integer for ID.
        }

        // 2. Check if Empty & Seed
        const existing = await directus.request(readItems(COLLECTION_NAME, { limit: 1 }));
        if (existing.length === 0) {
            console.log('Seeding initial data...');
            for (const item of seedData) {
                await directus.request(createItem(COLLECTION_NAME, item));
            }
            console.log('Seeding complete.');
        } else {
            console.log('Collection already has data. Skipping seed.');
        }

        // 3. Update Collection Meta to Ensure Sort is Active
        console.log('Ensuring Sort configuration...');
        await directus.request(updateCollection(COLLECTION_NAME, {
            meta: {
                sort_field: 'sort'
            }
        }));

        // Also grant public read access? 
        // We can do that via role update or assume the user will do it/already done by 'fix-permissions.mjs'

        console.log('Setup complete! Go to Directus Admin > Settings > Data Model > Journey Items to verify.');

    } catch (error) {
        console.error('Error setting up Journey:', error);
    }
}

setupJourney();
