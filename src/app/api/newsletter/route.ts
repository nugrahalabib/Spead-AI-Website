import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://127.0.0.1:8055';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate email
        if (!body.email) {
            return NextResponse.json(
                { error: 'Email is required.' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address.' },
                { status: 400 }
            );
        }

        // Get IP and User Agent
        const ip_address = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const user_agent = request.headers.get('user-agent') || 'unknown';

        // Prepare data
        const subscriberData: Record<string, any> = {
            email: body.email.toLowerCase().trim(),
            source: body.source || 'other',
            subscribed_to: body.subscribed_to || ['news', 'blog'],
            ip_address: ip_address.split(',')[0].trim(),
            user_agent: user_agent.substring(0, 500),
        };

        // Submit to Directus
        const res = await fetch(`${DIRECTUS_URL}/items/newsletter_subscribers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscriberData),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('Directus error:', errorData);

            // Check for duplicate email
            if (errorData?.errors?.[0]?.message?.includes('unique') ||
                errorData?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
                return NextResponse.json(
                    { error: 'You\'re already subscribed! Thank you for your interest.' },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { error: 'Failed to subscribe. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed!',
        });

    } catch (error) {
        console.error('Newsletter API error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}
