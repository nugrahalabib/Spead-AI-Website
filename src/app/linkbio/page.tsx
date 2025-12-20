import { readItems, readSingleton } from '@directus/sdk';
import directus from '@/lib/directus';
import { Metadata } from 'next';
import LinkBioClient from '@/components/LinkBioClient';

export const metadata: Metadata = {
    title: 'Links - Nugraha Labib',
    description: 'Connect with Nugraha Labib across all platforms.',
};

export const revalidate = 60;

export default async function LinkBioPage() {
    // Fetch all required data in parallel
    const [settings, categories, links] = await Promise.all([
        directus.request(readSingleton('bio_settings')).catch(() => null),
        directus.request(readItems('bio_categories', { sort: ['sort'] })).catch(() => []),
        directus.request(readItems('bio_links', {
            filter: { is_active: { _eq: true } },
            sort: ['sort'],
            fields: ['*', { category: ['*'] }] // Fetch related category data
        })).catch(() => [])
    ]);

    return (
        <LinkBioClient
            settings={settings}
            categories={categories}
            links={links}
        />
    );
}
