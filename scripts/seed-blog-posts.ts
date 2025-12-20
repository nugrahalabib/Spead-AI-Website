/**
 * Seed 5 initial blog posts
 */

const URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@spead.ai';
const PASSWORD = 'password123';

async function main() {
    console.log('🌱 Seeding 5 Blog Posts...\n');

    const loginRes = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { data: { access_token: token } } = await loginRes.json();
    console.log('✅ Authenticated\n');

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Get categories
    const catRes = await fetch(`${URL}/items/blog_categories`, { headers });
    const { data: categories } = await catRes.json();
    console.log('📁 Found categories:', categories.map((c: any) => c.name).join(', '));

    // Get authors
    const authRes = await fetch(`${URL}/items/authors`, { headers });
    const { data: authors } = await authRes.json();
    const authorId = authors?.[0]?.id || null;
    console.log('👤 Using author:', authors?.[0]?.name || 'None');

    const getCat = (name: string) => categories.find((c: any) => c.name === name)?.id || categories[0]?.id;

    const blogs = [
        {
            status: 'published',
            title: 'The End of Prompt Engineering: Why Autonomous Agents Are the New Code',
            slug: 'end-of-prompt-engineering',
            excerpt: 'We are moving from chatting with AI to managing AI workforces. Here is the blueprint for the transition and what it means for the expertise economy.',
            content: `<h2>The Paradigm Shift</h2>
<p>For years, we have been refining the art of <strong>prompt engineering</strong> – crafting the perfect instructions to coax large language models into producing desired outputs. But this era is ending.</p>

<h2>Enter Autonomous Agents</h2>
<p>The future belongs to <em>autonomous agents</em>: AI systems that can plan, execute, and iterate without constant human supervision. These agents don't just respond to prompts; they <strong>pursue goals</strong>.</p>

<h3>Key Characteristics</h3>
<ul>
<li>Goal-oriented behavior with self-correction</li>
<li>Tool use and API integration</li>
<li>Memory and context management</li>
<li>Multi-step reasoning and planning</li>
</ul>

<h2>What This Means for You</h2>
<p>The skill of the future is not writing better prompts – it is <strong>architecting agent systems</strong>. Think less like a user, more like a manager of an AI workforce.</p>`,
            category: getCat('Architecture'),
            author: authorId,
            is_featured: 'yes',
            read_time: 8,
            published_date: new Date().toISOString(),
            tags: [{ tag: 'AI Agents' }, { tag: 'Architecture' }, { tag: 'Future of AI' }],
            seo_title: 'Why Autonomous AI Agents Are Replacing Prompt Engineering',
            seo_description: 'Discover why autonomous AI agents are the future and how to architect systems for the expertise economy.'
        },
        {
            status: 'published',
            title: 'Designing for Trust: The UX of Black Box Logic',
            slug: 'designing-for-trust',
            excerpt: 'How to build user interfaces that expose the reasoning chains of AI without overwhelming the operator.',
            content: `<h2>The Transparency Paradox</h2>
<p>Users demand transparency from AI systems, yet showing every reasoning step creates cognitive overload. How do we balance these needs?</p>

<h2>Progressive Disclosure</h2>
<p>The solution lies in <strong>progressive disclosure</strong> – showing just enough information at each level:</p>
<ul>
<li><strong>Surface level</strong>: Confidence scores and simple explanations</li>
<li><strong>Intermediate</strong>: Key decision factors and alternatives considered</li>
<li><strong>Deep dive</strong>: Full reasoning chains for power users</li>
</ul>

<h2>Design Patterns That Work</h2>
<h3>1. Confidence Indicators</h3>
<p>Visual cues that communicate certainty without requiring interpretation.</p>

<h3>2. Explainable Summaries</h3>
<p>One-sentence rationales that humans can instantly parse.</p>

<h3>3. Interactive Exploration</h3>
<p>Allow users to ask "why?" at any point and get contextual answers.</p>`,
            category: getCat('Design'),
            author: authorId,
            is_featured: 'no',
            read_time: 5,
            published_date: new Date(Date.now() - 86400000).toISOString(),
            tags: [{ tag: 'UX Design' }, { tag: 'AI Transparency' }, { tag: 'Trust' }],
            seo_title: 'UX Design for AI Transparency - Building Trust Through Design',
            seo_description: 'Learn design patterns for exposing AI reasoning while maintaining usability.'
        },
        {
            status: 'published',
            title: 'Cognitive Offloading: A New Framework for Enterprise Productivity',
            slug: 'cognitive-offloading-framework',
            excerpt: 'Measuring the ROI of AI not just in time saved, but in mental energy preserved for high-value strategic thinking.',
            content: `<h2>Beyond Time Savings</h2>
<p>Traditional ROI metrics for AI focus on hours saved. But the real value lies in <strong>cognitive offloading</strong> – freeing human minds for work only humans can do.</p>

<h2>The Cognitive Load Model</h2>
<p>Every task requires mental energy:</p>
<ul>
<li><strong>Intrinsic load</strong>: Inherent complexity of the task</li>
<li><strong>Extraneous load</strong>: Friction from tools and processes</li>
<li><strong>Germane load</strong>: Energy for learning and innovation</li>
</ul>

<h2>Measuring Cognitive ROI</h2>
<p>Track these metrics:</p>
<ol>
<li>Decision fatigue reduction</li>
<li>Context-switching frequency</li>
<li>Time-to-insight improvement</li>
<li>Strategic initiative capacity</li>
</ol>

<h2>Implementation Strategy</h2>
<p>Start with tasks that are high-frequency, low-creativity, and high-friction. These are prime candidates for AI delegation.</p>`,
            category: getCat('Strategy'),
            author: authorId,
            is_featured: 'no',
            read_time: 6,
            published_date: new Date(Date.now() - 172800000).toISOString(),
            tags: [{ tag: 'Productivity' }, { tag: 'Enterprise AI' }, { tag: 'ROI' }],
            seo_title: 'Cognitive Offloading - Measuring Real AI ROI in Enterprise',
            seo_description: 'A new framework for measuring AI value beyond time savings.'
        },
        {
            status: 'published',
            title: 'Vector Databases 101: The Memory of the Machine',
            slug: 'vector-databases-101',
            excerpt: 'A technical deep dive into RAG pipelines and how we optimized retrieval latency by 40%.',
            content: `<h2>Why Vector Databases Matter</h2>
<p>Traditional databases store data in rows and columns. Vector databases store <strong>embeddings</strong> – mathematical representations of meaning.</p>

<h2>The RAG Pipeline</h2>
<p>Retrieval-Augmented Generation (RAG) combines search with generation:</p>
<ol>
<li><strong>Encode</strong>: Convert query to vector</li>
<li><strong>Search</strong>: Find similar vectors in the database</li>
<li><strong>Retrieve</strong>: Fetch original documents</li>
<li><strong>Generate</strong>: Feed to LLM with context</li>
</ol>

<h2>Optimization Techniques</h2>
<h3>Index Selection</h3>
<p>HNSW for speed, IVF for memory efficiency, hybrid for balance.</p>

<h3>Chunk Strategy</h3>
<p>Optimal chunk size depends on your use case: smaller for precise retrieval, larger for context preservation.</p>

<h3>Re-ranking</h3>
<p>A lightweight re-ranker on top results can improve relevance by 30%+.</p>`,
            category: getCat('Engineering'),
            author: authorId,
            is_featured: 'no',
            read_time: 12,
            published_date: new Date(Date.now() - 259200000).toISOString(),
            tags: [{ tag: 'Vector Database' }, { tag: 'RAG' }, { tag: 'Technical' }],
            seo_title: 'Vector Databases and RAG Pipeline Optimization Guide',
            seo_description: 'Technical deep dive into vector databases and RAG optimization techniques.'
        },
        {
            status: 'published',
            title: 'The Ethics of Alignment in Automated Legal Defense',
            slug: 'ethics-of-alignment-legal-ai',
            excerpt: 'When agents make decisions that affect legal outcomes, whose morality do they inherit?',
            content: `<h2>The Alignment Problem in Law</h2>
<p>As AI systems increasingly participate in legal processes, we face a profound question: <em>whose values should they embody?</em></p>

<h2>Competing Interests</h2>
<ul>
<li><strong>The client</strong>: Wants the best possible outcome</li>
<li><strong>The system</strong>: Seeks justice and fairness</li>
<li><strong>Society</strong>: Demands equitable access</li>
<li><strong>The profession</strong>: Upholds ethical standards</li>
</ul>

<h2>Case Study: Bail Recommendations</h2>
<p>AI systems recommending bail decisions have shown racial bias because they learned from historical data that reflected systemic inequities.</p>

<h2>Principles for Ethical Legal AI</h2>
<ol>
<li>Transparency in decision factors</li>
<li>Human oversight for high-stakes decisions</li>
<li>Regular bias audits</li>
<li>Diverse training data and perspectives</li>
<li>Clear accountability chains</li>
</ol>

<h2>The Path Forward</h2>
<p>We need legal AI that is not just technically accurate, but morally aligned with our highest aspirations for justice.</p>`,
            category: getCat('Ethics'),
            author: authorId,
            is_featured: 'no',
            read_time: 7,
            published_date: new Date(Date.now() - 345600000).toISOString(),
            tags: [{ tag: 'AI Ethics' }, { tag: 'Legal Tech' }, { tag: 'Alignment' }],
            seo_title: 'AI Ethics in Legal Defense - Alignment and Morality',
            seo_description: 'Exploring ethical challenges when AI makes decisions affecting legal outcomes.'
        }
    ];

    console.log('\n📝 Creating blog posts...');
    for (const blog of blogs) {
        const res = await fetch(`${URL}/items/blogs`, {
            method: 'POST',
            headers,
            body: JSON.stringify(blog)
        });
        if (res.ok) {
            console.log('   ✓', blog.title.substring(0, 50) + '...');
        } else {
            const err = await res.json();
            console.log('   ✗', blog.slug, err?.errors?.[0]?.message || 'Failed');
        }
    }

    console.log('\n✨ Done! 5 blog posts created.');
}

main().catch(console.error);
