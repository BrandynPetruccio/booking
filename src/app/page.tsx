import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Brandyn Petruccio
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Professional Consultation Services
          </p>
          
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Schedule Your Consultation
            </h2>
            <p className="mb-6 text-gray-600">
              Book your appointment online and receive confirmation via email. 
              Optional SMS reminders available.
            </p>
            
            <Link
              href="/book"
              className="inline-block rounded-md bg-blue-600 px-8 py-3 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Book Appointment
            </Link>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Questions? Call us at{' '}
              <a href="tel:+12137252867" className="text-blue-600 hover:underline">
                +1(213) 725-2867
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}