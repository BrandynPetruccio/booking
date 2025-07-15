import { NextRequest, NextResponse } from 'next/server';

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  smsOptIn: boolean;
  notes: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingFormData = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      service,
      date,
      time,
      smsOptIn,
      notes,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !service || !date || !time) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          error: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // Generate appointment ID
    const appointmentId = `APT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    // For now, we'll just log the appointment
    console.log('📅 New appointment booked:', {
      id: appointmentId,
      firstName,
      lastName,
      email,
      phone,
      service,
      date,
      time,
      smsOptIn,
      notes,
    });

    // ========== ADD GHL INTEGRATION HERE ==========
    try {
      // 1. Create or update contact in GHL
      const contactResponse = await fetch(
        'https://rest.gohighlevel.com/v1/contacts/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            name: `${firstName} ${lastName}`,
            tags: ['booking-page', service],
            customField: {
              sms_opt_in: smsOptIn,
              booking_notes: notes,
            }
          })
        }
      );

      if (!contactResponse.ok) {
        console.error('Failed to create contact:', await contactResponse.text());
      }

      const contact = await contactResponse.json();

      // 2. Format date/time for GHL (needs ISO format)
      // Assuming date is "2025-07-20" and time is "10:00 AM"
      const [year, month, day] = date.split('-');
      const appointmentDateTime = new Date(`${date} ${time}`);
      const startTime = appointmentDateTime.toISOString();
      
      // Add 1 hour for end time
      const endDateTime = new Date(appointmentDateTime.getTime() + 60 * 60 * 1000);
      const endTime = endDateTime.toISOString();

      // 3. Create appointment in GHL
      const appointmentResponse = await fetch(
        'https://rest.gohighlevel.com/v1/appointments/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            calendarId: 'Ix9BcL7eCVXMhDpntyH1',
            contactId: contact.id || contact.contact.id, // GHL sometimes nests the ID
            startTime: startTime,
            endTime: endTime,
            title: `${service} - ${firstName} ${lastName}`,
            appointmentStatus: 'confirmed',
            notes: notes
          })
        }
      );

      if (!appointmentResponse.ok) {
        console.error('Failed to create appointment:', await appointmentResponse.text());
      }

      console.log('✅ GHL integration successful');
    } catch (ghlError) {
      // Log GHL errors but don't fail the whole request
      console.error('❌ GHL integration error:', ghlError);
      // You might want to notify yourself about this error
    }
    // ========== END GHL INTEGRATION ==========

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Appointment scheduled successfully',
      appointment: {
        id: appointmentId,
        date,
        time,
        service,
        smsOptIn,
      },
    });
  } catch (error) {
    console.error('❌ Booking error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}
