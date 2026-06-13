import { useState } from 'react';
import { toast } from 'sonner';
import './ClubReviews.css';

const ClubReviews = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const mockReviews = [
    {
      id: 1,
      name: 'Carlos M.',
      date: 'Hace 2 días',
      rating: 5,
      text: 'Las canchas panorámicas son increíbles, la visibilidad es perfecta y el mantenimiento del césped es de 10. Muy recomendado.'
    },
    {
      id: 2,
      name: 'Elena R.',
      date: 'Hace 1 semana',
      rating: 5,
      text: 'Excelente ambiente y vestuarios muy limpios. El sistema de reserva es muy ágil.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Por favor, selecciona una calificación.');
      return;
    }
    
    setIsModalOpen(false);
    setRating(0);
    setComment('');
    toast.success('¡Gracias por tu valoración!');
  };

  const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <svg 
      viewBox="0 0 24 24" 
      className={`star-icon ${filled ? 'filled' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  return (
    <div className="reviews-container">
      <h2 className="reviews-main-title">Opiniones de Jugadores</h2>
      
      <div className="reviews-box">
        <div className="reviews-summary-col">
          <div className="score-display">
            <span className="score-number">4.8</span>
            <div className="score-stars">
              <StarIcon filled={true} />
              <StarIcon filled={true} />
              <StarIcon filled={true} />
              <StarIcon filled={true} />
              <StarIcon filled={true} />
            </div>
            <span className="score-based">Basado en 124 reseñas</span>
          </div>
          <button className="btn-rate" onClick={() => setIsModalOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Valorar Experiencia
          </button>
        </div>

        <div className="reviews-bars-col">
          {[5, 4, 3, 2, 1].map((star) => (
            <div className="bar-row" key={star}>
              <span className="bar-label">{star}</span>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '2%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="reviews-list-col">
          {mockReviews.map((review) => (
            <div className="review-item" key={review.id}>
              <div className="review-header">
                <div className="review-user-info">
                  <span className="review-name">{review.name}</span>
                  <div className="review-stars-small">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < review.rating} />
                    ))}
                  </div>
                </div>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            <h3>Califica tu experiencia</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-stars-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon 
                    key={star}
                    filled={star <= (hoverRating || rating)}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
              
              <textarea 
                className="modal-textarea"
                placeholder="Cuéntanos qué te pareció el complejo..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
              ></textarea>
              
              <button type="submit" className="btn-submit-review">Enviar Valoración</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubReviews;