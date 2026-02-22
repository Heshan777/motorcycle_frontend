interface ReviewData {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

const mockReviews: Record<string, ReviewData[]> = {
  '507f1f77bcf86cd799439011': [
    { id: '1', author: 'John D.', rating: 5, comment: 'Incredible speed and handling. Best sport bike ever!', date: '2026-02-10' },
    { id: '2', author: 'Sarah M.', rating: 5, comment: 'Performance is outstanding. Highly recommend!', date: '2026-01-28' },
    { id: '3', author: 'Mike R.', rating: 4, comment: 'Great bike, just wish it had more comfort for long rides.', date: '2026-01-15' },
  ],
  '507f1f77bcf86cd799439012': [
    { id: '4', author: 'Robert K.', rating: 5, comment: 'Classic beauty with modern performance. Love it!', date: '2026-02-05' },
    { id: '5', author: 'Emma T.', rating: 4, comment: 'Smooth ride, perfect for cruising around the city.', date: '2026-01-20' },
  ],
};

export function getReviewsForMotorcycle(motorcycleId: string): ReviewData[] {
  return mockReviews[motorcycleId] || [];
}

export function getAverageRating(motorcycleId: string): number {
  const reviews = getReviewsForMotorcycle(motorcycleId);
  if (reviews.length === 0) return 4.5;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
