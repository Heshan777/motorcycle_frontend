interface TestimonialData {
  id: string;
  author: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
}

export const testimonials: TestimonialData[] = [
  {
    id: '1',
    author: 'Alex Chen',
    role: 'Adventure Rider',
    avatar: '🧑',
    text: 'Finding my dream bike was incredibly easy. The selection is amazing and the team is super helpful!',
    rating: 5,
  },
  {
    id: '2',
    author: 'Maria Garcia',
    role: 'Leasing Customer',
    avatar: '👩',
    text: 'The leasing process was smooth and transparent. Best motorcycle rental experience I have had!',
    rating: 5,
  },
  {
    id: '3',
    author: 'James Wilson',
    role: 'First-Time Rider',
    avatar: '👨',
    text: 'Great customer support and excellent bike selection. Booked my test ride in minutes!',
    rating: 5,
  },
  {
    id: '4',
    author: 'Linda Park',
    role: 'Repeat Customer',
    avatar: '🎓',
    text: 'Professional service, premium bikes, and fantastic booking experience. Highly recommend!',
    rating: 5,
  },
];

export const faqs = [
  {
    id: '1',
    question: 'How do I book a motorcycle test ride?',
    answer: 'Navigate to any motorcycle in our catalog, click the booking form at the bottom, fill in your details and preferred date, and submit. We\'ll confirm your test ride within 24 hours!',
  },
  {
    id: '2',
    question: 'What are your leasing options?',
    answer: 'We offer flexible leasing plans from 3 months to 12 months with all-inclusive maintenance, insurance, and roadside support. Visit our Leasing Offer page for detailed pricing and terms.',
  },
  {
    id: '3',
    question: 'Can I compare multiple motorcycles?',
    answer: 'Yes! Use our comparison tool to compare up to 3 bikes side-by-side and see specifications, pricing, and features at a glance.',
  },
  {
    id: '4',
    question: 'Do you offer delivery?',
    answer: 'We provide free delivery for leased motorcycles within metro areas. For purchases, delivery options depend on your location. Contact us for details.',
  },
  {
    id: '5',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit cards, debit cards, bank transfers, and installment plans with partner financing. All transactions are secure and encrypted.',
  },
  {
    id: '6',
    question: 'Is there a warranty on motorcycles?',
    answer: 'All our motorcycles come with manufacturer warranty. Leased bikes include 24/7 support and maintenance coverage at no extra cost.',
  },
  {
    id: '7',
    question: 'How can I save my favorite motorcycles?',
    answer: 'Click the heart icon on any motorcycle card to add it to your wishlist. Your favorites are saved locally and you can view them anytime.',
  },
  {
    id: '8',
    question: 'What if I need to cancel my booking?',
    answer: 'Bookings can be cancelled up to 7 days before the scheduled date for a full refund. Leasing contracts have flexible cancellation terms depending on the plan.',
  },
];
