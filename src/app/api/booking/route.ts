import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://127.0.0.1:8055';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('Booking request received:', body);

        // Validate required fields
        if (!body.full_name || !body.email || !body.company) {
            return NextResponse.json(
                { error: 'Name, email, and company are required.' },
                { status: 400 }
            );
        }

        // Validate email format
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

        // Prepare data for Directus - only include non-empty values
        const bookingData: Record<string, string> = {
            full_name: body.full_name,
            email: body.email,
            company: body.company,
        };

        // Add optional fields only if they have values
        if (body.phone) bookingData.phone = body.phone;
        if (body.job_title) bookingData.job_title = body.job_title;
        if (body.selected_plan) bookingData.selected_plan = body.selected_plan;
        if (body.team_size) bookingData.team_size = body.team_size;
        if (body.use_case) bookingData.use_case = body.use_case;
        if (body.timeline) bookingData.timeline = body.timeline;
        if (body.referral_source) bookingData.referral_source = body.referral_source;
        if (body.utm_source) bookingData.utm_source = body.utm_source;
        if (body.utm_medium) bookingData.utm_medium = body.utm_medium;
        if (body.utm_campaign) bookingData.utm_campaign = body.utm_campaign;

        bookingData.ip_address = ip_address.split(',')[0].trim();
        bookingData.user_agent = user_agent.substring(0, 500);

        console.log('Sending to Directus:', bookingData);

        // Submit to Directus
        const res = await fetch(`${DIRECTUS_URL}/items/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });

        const responseText = await res.text();
        console.log('Directus response status:', res.status);
        console.log('Directus response:', responseText);

        if (!res.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                errorData = { message: responseText };
            }

            console.error('Directus error:', errorData);

            // Check for duplicate email (if constraint exists)
            if (errorData?.errors?.[0]?.message?.includes('unique')) {
                return NextResponse.json(
                    { error: 'This email is already registered. We\'ll be in touch soon!' },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { error: errorData?.errors?.[0]?.message || 'Failed to submit booking. Please try again.' },
                { status: 500 }
            );
        }

        const data = JSON.parse(responseText);

        return NextResponse.json({
            success: true,
            message: 'Booking submitted successfully!',
            id: data.data?.id,
        });

    } catch (error) {
        console.error('Booking API error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        );
    }
}

// Handle other methods
export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}
