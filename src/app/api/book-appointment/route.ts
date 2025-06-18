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

interface Appointment extends BookingFormData {
  id: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  appointment?: {
    id: string;
    date: string;
    time: string;
    service: string;
    smsOptIn: boolean;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format',
          error: 'INVALID_EMAIL',
        },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid phone number format',
          error: 'INVALID_PHONE',
        },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot book appointments in the past',
          error: 'INVALID_DATE',
        },
        { status: 400 }
      );
    }

    // Generate appointment ID
    const appointmentId = `APT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    // Create appointment object
    const appointment: Appointment = {
      id: appointmentId,
      firstName,
      lastName,
      email,
      phone: phone.replace(/\D/g, ''), // Clean phone number
      service,
      date,
      time,
      smsOptIn,
      notes: notes || '',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // For now, we'll just log the appointment (later you can add database/email/SMS)
    console.log('📅 New appointment booked:', appointment);
    
    if (smsOptIn) {
      console.log('📱 SMS opt-in enabled for:', phone);
    }

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