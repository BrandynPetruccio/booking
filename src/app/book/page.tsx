// src/app/book/page.tsx

import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

// This function now runs on the server
async function createBooking(formData: FormData) {
  'use server';

  // --- 1. Connect to the Database ---
  const sql = neon(process.env.DATABASE_URL!);

  // --- 2. Extract Data from the Form ---
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const service = formData.get('service') as string;
  const appointment_date = formData.get('date') as string;
  const appointment_time = formData.get('time') as string;
  const sms_opt_in = formData.get('smsOptIn') === 'on';
  const notes = formData.get('notes') as string;
  const appointment_id = `APT-${Date.now()}`;

  // --- 3. Insert Data into the Database ---
  try {
    await sql`
      INSERT INTO bookings (
        appointment_id, first_name, last_name, email, phone, service,
        appointment_date, appointment_time, sms_opt_in, notes
      ) VALUES (
        ${appointment_id}, ${firstName}, ${lastName}, ${email}, ${phone}, ${service},
        ${appointment_date}, ${appointment_time}, ${sms_opt_in}, ${notes}
      )
    `;
    revalidatePath('/book');
  } catch (error) {
    console.error('Database insertion error:', error);
    // You can handle errors here, maybe return a message
  }
}

// --- Your Page Component (No more useState or handleSubmit!) ---
export default function BookingPage() {
  const services: string[] = [
    'Initial Consultation', 'Follow-up Appointment', 'Strategy Session', 'Review Meeting',
  ];
  const timeSlots: string[] = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Book Your Appointment</h1>
          <p className="text-gray-600">Schedule your consultation with Brandyn Petruccio</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          {/* The form now calls the server action directly */}
          <form action={createBooking} className="space-y-6">
            {/* All your input fields remain the same... */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">First Name *</label>
                <input type="text" id="firstName" name="firstName" required className="w-full rounded-md border-gray-300"/>
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">Last Name *</label>
                <input type="text" id="lastName" name="lastName" required className="w-full rounded-md border-gray-300"/>
              </div>
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
              <input type="email" id="email" name="email" required className="w-full rounded-md border-gray-300"/>
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">Phone *</label>
              <input type="tel" id="phone" name="phone" required className="w-full rounded-md border-gray-300"/>
            </div>
            <div>
              <label htmlFor="service" className="mb-1 block text-sm font-medium text-gray-700">Service *</label>
              <select id="service" name="service" required defaultValue="" className="w-full rounded-md border-gray-300">
                <option value="" disabled>Select a service</option>
                {services.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
               <div>
                <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">Date *</label>
                <input type="date" id="date" name="date" required min={new Date().toISOString().split('T')[0]} className="w-full rounded-md border-gray-300"/>
              </div>
              <div>
                <label htmlFor="time" className="mb-1 block text-sm font-medium text-gray-700">Time *</label>
                <select id="time" name="time" required defaultValue="" className="w-full rounded-md border-gray-300">
                    <option value="" disabled>Select a time</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-start">
              <input type="checkbox" id="smsOptIn" name="smsOptIn" className="mr-3 mt-1 h-4 w-4"/>
              <label htmlFor="smsOptIn" className="text-sm">SMS Reminders (Optional)</label>
            </div>
            <div>
              <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
              <textarea id="notes" name="notes" rows={3} className="w-full rounded-md border-gray-300"/>
            </div>
            <button type="submit" className="w-full rounded-md bg-blue-600 py-3 text-white">
              Schedule Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
