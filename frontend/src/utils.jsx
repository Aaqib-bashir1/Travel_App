export const renderReviewStars = (rating) => {
  const maxStars = 5;
  const filledStars = Math.round(rating); // round to nearest integer
  const emptyStars = maxStars - filledStars;

  return (
    <div className="stars">
      {Array(filledStars).fill().map((_, i) => (
        <span key={i} className="star filled">★</span>
      ))}
      {Array(emptyStars).fill().map((_, i) => (
        <span key={i + filledStars} className="star empty">☆</span>
      ))}
    </div>
  );
};
