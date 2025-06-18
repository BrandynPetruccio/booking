import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Appointment - Brandyn Petruccio',
  description: 'Schedule your appointment with Brandyn Petruccio. Choose your preferred date and time, and opt-in for SMS reminders.',
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}