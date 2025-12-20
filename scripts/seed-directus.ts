/**
 * Directus News Schema Seeder v5
 * Creates Authors, Categories, and Posts with proper relations
 */

import * as fs from 'fs';

// ============== CONFIG ==============
const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

// ============== LOGGING ==============
const logFile = 'seed-v5.log';
try { fs.writeFileSync(logFile, ''); } catch (e) { }

const log = (msg: string) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const line = `[${timestamp}] ${msg}`;
    console.log(line);
    try { fs.appendFileSync(logFile, line + '\n'); } catch (e) { }
};

// ============== SAMPLE DATA ==============

const AUTHORS = [
    {
        name: 'Dr. Sarah Chen',
        slug: 'sarah-chen',
        role: 'Chief AI Architect',
        bio: 'Leading the development of Spead AI\'s core reasoning engine. PhD in Machine Learning from Stanford.',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
        email: 'sarah.chen@spead.ai',
        linkedin_url: 'https://linkedin.com/in/sarahchen',
        twitter_handle: 'drsarahchen'
    },
    {
        name: 'Alex Rivera',
        slug: 'alex-rivera',
        role: 'Head of Engineering',
        bio: 'Building scalable infrastructure for enterprise AI. Former Google Cloud architect.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        email: 'alex.rivera@spead.ai',
        linkedin_url: 'https://linkedin.com/in/alexrivera',
        twitter_handle: 'alexrivera_eng'
    },
    {
        name: 'Elena Kowalski',
        slug: 'elena-kowalski',
        role: 'Events Director',
        bio: 'Orchestrating Spead AI\'s global events and community initiatives.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        email: 'elena.k@spead.ai'
    },
    {
        name: 'Marcus Thompson',
        slug: 'marcus-thompson',
        role: 'Security Lead',
        bio: 'Ensuring enterprise-grade security across all Spead AI products. CISSP certified.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        email: 'security@spead.ai'
    },
    {
        name: 'Spead AI Editorial',
        slug: 'editorial-team',
        role: 'Communications Team',
        bio: 'Official communications and press releases from Spead AI.',
        avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        email: 'press@spead.ai'
    }
];

const CATEGORIES = [
    { name: 'Press Release', slug: 'press', color: 'text-blue-400', icon: 'newspaper', description: 'Official announcements and media coverage' },
    { name: 'Product Update', slug: 'update', color: 'text-emerald-400', icon: 'zap', description: 'New features, improvements, and releases' },
    { name: 'Security Alert', slug: 'alert', color: 'text-red-400', icon: 'shield-alert', description: 'Security patches and vulnerability notices' },
    { name: 'Events', slug: 'event', color: 'text-purple-400', icon: 'calendar', description: 'Conferences, webinars, and community gatherings' },
    { name: 'Engineering', slug: 'engineering', color: 'text-cyan-400', icon: 'cpu', description: 'Technical deep-dives and architecture insights' }
];

const POSTS = [
    {
        title: 'Spead AI Raises $85M Series B to Scale Enterprise Self-Healing Systems',
        slug: 'series-b-announcement',
        excerpt: 'The funding round led by Sequoia will fuel expansion of our autonomous legal reasoning engine and global infrastructure.',
        content: `# Spead AI Raises $85M Series B

**San Francisco, CA** — Spead AI is proud to announce the closing of our Series B funding round, raising $85M to accelerate the development of our enterprise-grade "Self-Healing" systems.

## What This Means

This investment will allow us to:
- Expand our autonomous legal reasoning engine
- Build redundant server infrastructure across 3 continents
- Hire 50+ engineers specializing in AI safety and reliability

> "This is a pivotal moment for Spead AI and the entire enterprise AI industry. We're building technology that doesn't just assist—it anticipates, adapts, and autonomously resolves."
> — Dr. Sarah Chen, Chief AI Architect

## The Investors

The round was led by **Sequoia Capital** with participation from Andreessen Horowitz, Greylock Partners, and strategic angels from the legal tech industry.

## What's Next

We're immediately deploying capital toward:
1. **R&D Acceleration**: Doubling our research team
2. **Global Expansion**: New offices in London and Singapore
3. **Enterprise Partnerships**: Onboarding Fortune 500 clients

Stay tuned for more updates as we execute on this vision.`,
        category_slug: 'press',
        author_slug: 'sarah-chen',
        tags: ['Funding', 'Series B', 'Enterprise AI', 'Growth'],
        is_featured: true,
        read_time: 4,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop',
        seo_title: 'Spead AI Raises $85M Series B | Enterprise AI Funding News',
        seo_description: 'Spead AI closes $85M Series B led by Sequoia to scale self-healing enterprise AI systems globally.'
    },
    {
        title: 'Model v2.4 Release: 40% Faster Inference with Zero Accuracy Loss',
        slug: 'model-v2-4-release',
        excerpt: 'Our latest quantization techniques have dramatically reduced latency while maintaining 99.9% accuracy on contract analysis.',
        content: `# Model v2.4 Release Notes

We're excited to announce **Model v2.4**, our fastest release yet.

## Performance Highlights

| Metric | v2.3 | v2.4 | Improvement |
|--------|------|------|-------------|
| Inference Time | 450ms | 270ms | **40% faster** |
| Accuracy | 99.87% | 99.91% | +0.04% |
| Memory Usage | 8.2GB | 6.1GB | **26% reduction** |

## Key Features

### 1. Advanced Quantization
We've implemented INT8 quantization with dynamic calibration, reducing model size without sacrificing quality.

### 2. Streaming Responses
Real-time token streaming is now available for all enterprise endpoints.

### 3. Extended Context Window
The context window has been expanded from 32K to **128K tokens**.

## Migration Guide

Existing API integrations require no changes. The new model is automatically deployed to all production instances.

\`\`\`bash
# Verify your instance version
curl -X GET https://api.spead.ai/v1/version
\`\`\`

## Deprecation Notice

Model v2.2 will be deprecated on February 1, 2026. Please ensure all workflows are updated.`,
        category_slug: 'update',
        author_slug: 'alex-rivera',
        tags: ['Release Notes', 'Performance', 'Model Update', 'Engineering'],
        is_featured: false,
        read_time: 3,
        image: null,
        seo_title: 'Model v2.4 Release: 40% Faster AI Inference | Spead AI',
        seo_description: 'Spead AI Model v2.4 delivers 40% faster inference with improved accuracy. Upgrade guide included.'
    },
    {
        title: 'Critical Security Patch: Vector Injection Vulnerability Mitigated',
        slug: 'dec-2025-security-patch',
        excerpt: 'An automatic patch has been deployed to all enterprise clusters addressing a newly discovered vector injection vulnerability.',
        content: `# Security Advisory: December 2025

## Summary

A critical vulnerability was discovered in our embedding pipeline that could allow specially crafted inputs to manipulate vector search results.

**Severity**: Critical (CVSS 8.1)
**Status**: ✅ Patched

## Timeline

- **Dec 9, 11:42 UTC**: Vulnerability reported via bug bounty
- **Dec 9, 14:00 UTC**: Initial triage completed
- **Dec 10, 02:30 UTC**: Patch developed and tested
- **Dec 10, 06:00 UTC**: Automatic deployment to all clusters

## Technical Details

The vulnerability existed in the input sanitization layer of our embedding API. Malicious actors could inject control sequences that influenced the semantic similarity calculations.

## Actions Required

**None**. All patches have been automatically applied. You can verify your cluster status:

\`\`\`bash
curl https://api.spead.ai/v1/security/status
\`\`\`

## Acknowledgments

We thank the security researcher who responsibly disclosed this issue through our bug bounty program.`,
        category_slug: 'alert',
        author_slug: 'marcus-thompson',
        tags: ['Security', 'Patch', 'Critical', 'Vulnerability'],
        is_featured: false,
        read_time: 2,
        image: null,
        seo_title: 'Security Patch: Vector Injection Fix | Spead AI',
        seo_description: 'Critical security patch deployed for vector injection vulnerability. All systems updated.'
    },
    {
        title: 'Spead Summit 2025: Defining the Post-SaaS Era',
        slug: 'summit-2025-announcement',
        excerpt: 'Join 500+ CTOs in San Francisco as we unveil the roadmap for our Neural Operating System.',
        content: `# Spead Summit 2025

**February 15-16, 2025 | San Francisco, CA**

Join us for the most anticipated enterprise AI event of the year.

## What to Expect

### Day 1: Vision & Strategy
- **Keynote**: The Future of Autonomous Enterprise Systems
- **Panel**: How Fortune 500 Companies Are Adopting AI
- **Workshop**: Building Your First Self-Healing Workflow

### Day 2: Deep Dives
- **Technical Session**: Architecture of the Neural Operating System
- **Hands-On Lab**: Advanced Prompt Engineering
- **Networking**: Executive Dinner at the Palace Hotel

## Speakers

- **Dr. Sarah Chen** — Chief AI Architect, Spead AI
- **Michael Chang** — CTO, Fortune 100 Law Firm
- **Dr. Yuki Tanaka** — AI Ethics Researcher, MIT

## Registration

Early bird pricing ends January 15, 2025.

| Ticket Type | Price |
|-------------|-------|
| Standard | $599 |
| VIP (includes dinner) | $999 |
| Enterprise (5+ seats) | Custom |

[Register Now →](https://summit.spead.ai)`,
        category_slug: 'event',
        author_slug: 'elena-kowalski',
        tags: ['Event', 'Summit', 'Conference', 'Networking'],
        is_featured: false,
        read_time: 3,
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=630&fit=crop',
        seo_title: 'Spead Summit 2025 | Enterprise AI Conference',
        seo_description: 'Join 500+ CTOs at Spead Summit 2025 in San Francisco. Keynotes, workshops, and networking.'
    },
    {
        title: 'New Integration: Salesforce Data Graph for Real-Time Context',
        slug: 'salesforce-integration',
        excerpt: 'Seamlessly pipe customer context directly into your reasoning engine without ETL pipelines.',
        content: `# Salesforce Data Graph Integration

We're thrilled to announce native integration with **Salesforce Data Graph**, enabling real-time customer context in your AI workflows.

## The Problem We're Solving

Traditional integrations require:
- Complex ETL pipelines
- Data synchronization delays
- Schema mapping headaches

## Our Solution

With the Salesforce Data Graph connector:

\`\`\`javascript
const context = await spead.context.fromSalesforce({
  accountId: 'ACC-12345',
  include: ['opportunities', 'cases', 'contacts']
});

const response = await spead.reason({
  prompt: 'Summarize this customer relationship',
  context: context
});
\`\`\`

## Features

✅ **Real-time sync** — No batch jobs, no delays
✅ **Automatic schema detection** — Works with custom objects
✅ **Row-level security** — Respects Salesforce permissions
✅ **Audit logging** — Full visibility into data access

## Getting Started

1. Navigate to **Settings → Integrations**
2. Click **Connect Salesforce**
3. Authorize with OAuth 2.0
4. Start building!

Documentation: [docs.spead.ai/integrations/salesforce](https://docs.spead.ai)`,
        category_slug: 'update',
        author_slug: 'alex-rivera',
        tags: ['Integration', 'Salesforce', 'CRM', 'Data'],
        is_featured: false,
        read_time: 3,
        image: null,
        seo_title: 'Salesforce Data Graph Integration | Spead AI',
        seo_description: 'Connect Salesforce to Spead AI for real-time customer context. No ETL required.'
    },
    {
        title: 'Gartner Names Spead AI "Cool Vendor" in Legal Tech AI',
        slug: 'gartner-cool-vendor-2025',
        excerpt: 'Recognition validates our approach to context-aware document generation and compliance enforcement.',
        content: `# Gartner Cool Vendor Recognition

We're honored to announce that Spead AI has been named a **Gartner Cool Vendor** in the Legal Tech AI category for 2025.

## What This Means

Gartner's Cool Vendor report highlights innovative companies that are transforming their industries. Selection criteria include:

- **Innovation**: Novel approach to solving industry problems
- **Impact**: Demonstrable value for enterprises
- **Intrigue**: Technologies that warrant attention

## Why Spead AI

According to the report, Spead AI stands out for:

> "...its unique combination of context-aware document generation, compliance automation, and self-healing error correction that dramatically reduces legal department workloads."

## Our Journey

From our founding 18 months ago to serving 50+ enterprise clients, this recognition validates our vision of building AI that truly understands legal complexity.

## Thank You

To our customers, investors, and team: this milestone belongs to all of us.

---

*Gartner does not endorse any vendor, product or service depicted in its research publications.*`,
        category_slug: 'press',
        author_slug: 'editorial-team',
        tags: ['Awards', 'Gartner', 'Recognition', 'Legal Tech'],
        is_featured: false,
        read_time: 2,
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=630&fit=crop',
        seo_title: 'Spead AI Named Gartner Cool Vendor 2025 | Legal Tech AI',
        seo_description: 'Spead AI recognized as Gartner Cool Vendor in Legal Tech AI for 2025.'
    }
];

// ============== MAIN EXECUTION ==============

async function main() {
    log('🚀 Spead AI Directus Seeder v5');
    log('━'.repeat(50));

    try {
        // 1. Authenticate
        log('🔐 Authenticating...');
        const loginRes = await fetch(`${URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${await loginRes.text()}`);
        }

        const { data: { access_token: token } } = await loginRes.json();
        log('✅ Authenticated');

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Helper function
        const api = async (method: string, path: string, body?: any) => {
            const res = await fetch(`${URL}${path}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            });
            const text = await res.text();
            if (!res.ok && !text.includes('already exists') && !text.includes('RECORD_NOT_UNIQUE')) {
                if (res.status === 403) return { skipped: true }; // Collection exists
                throw new Error(`${method} ${path}: ${res.status} - ${text}`);
            }
            try { return JSON.parse(text); } catch { return { ok: true }; }
        };

        // 2. Delete existing items (clean slate)
        log('🗑️  Clearing existing data...');
        try { await api('DELETE', '/items/posts'); } catch (e) { }
        try { await api('DELETE', '/items/authors'); } catch (e) { }
        try { await api('DELETE', '/items/categories'); } catch (e) { }
        log('   Cleared posts, authors, categories');

        // 3. Create Categories Collection
        log('📁 Setting up Categories...');
        try {
            await api('POST', '/collections', {
                collection: 'categories',
                schema: {},
                meta: { icon: 'folder', hidden: false }
            });
        } catch (e) { }

        // Add fields
        for (const field of ['name:string', 'slug:string', 'color:string', 'icon:string', 'description:text']) {
            const [name, type] = field.split(':');
            try { await api('POST', '/fields/categories', { field: name, type, schema: {} }); } catch (e) { }
        }
        log('   ✓ Categories collection ready');

        // 4. Create Authors Collection
        log('📁 Setting up Authors...');
        try {
            await api('POST', '/collections', {
                collection: 'authors',
                schema: {},
                meta: { icon: 'person', hidden: false }
            });
        } catch (e) { }

        for (const field of ['name:string', 'slug:string', 'role:string', 'bio:text', 'avatar:string', 'email:string', 'linkedin_url:string', 'twitter_handle:string']) {
            const [name, type] = field.split(':');
            try { await api('POST', '/fields/authors', { field: name, type, schema: {} }); } catch (e) { }
        }
        log('   ✓ Authors collection ready');

        // 5. Create Posts Collection
        log('📁 Setting up Posts...');
        try {
            await api('POST', '/collections', {
                collection: 'posts',
                schema: {},
                meta: { icon: 'article', hidden: false }
            });
        } catch (e) { }

        const postFields = [
            'status:string', 'title:string', 'slug:string', 'excerpt:text', 'content:text',
            'image:string', 'tags:json', 'published_date:dateTime', 'is_featured:boolean',
            'read_time:integer', 'seo_title:string', 'seo_description:text', 'canonical_url:string',
            'author:integer', 'category:integer'
        ];
        for (const field of postFields) {
            const [name, type] = field.split(':');
            try { await api('POST', '/fields/posts', { field: name, type, schema: {} }); } catch (e) { }
        }
        log('   ✓ Posts collection ready');

        // 6. Seed Categories
        log('🌱 Seeding categories...');
        const categoryMap: Record<string, number> = {};
        for (const cat of CATEGORIES) {
            const res = await api('POST', '/items/categories', cat);
            if (res?.data?.id) categoryMap[cat.slug] = res.data.id;
            log(`   + ${cat.name}`);
        }

        // 7. Seed Authors
        log('🌱 Seeding authors...');
        const authorMap: Record<string, number> = {};
        for (const author of AUTHORS) {
            const res = await api('POST', '/items/authors', author);
            if (res?.data?.id) authorMap[author.slug] = res.data.id;
            log(`   + ${author.name}`);
        }

        // 8. Seed Posts
        log('🌱 Seeding posts...');
        for (const post of POSTS) {
            const postData = {
                status: 'published',
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: post.content,
                image: post.image,
                tags: post.tags,
                published_date: new Date().toISOString(),
                is_featured: post.is_featured,
                read_time: post.read_time,
                seo_title: post.seo_title,
                seo_description: post.seo_description,
                author: authorMap[post.author_slug] || null,
                category: categoryMap[post.category_slug] || null
            };
            await api('POST', '/items/posts', postData);
            log(`   + ${post.title.substring(0, 50)}...`);
        }

        log('━'.repeat(50));
        log('✨ Seeding Complete!');
        log(`   📊 ${CATEGORIES.length} categories`);
        log(`   👤 ${AUTHORS.length} authors`);
        log(`   📰 ${POSTS.length} posts`);

    } catch (error: any) {
        log(`❌ Error: ${error.message}`);
    }
}

main();
