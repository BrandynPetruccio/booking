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
