import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import useAuthStore from '../../store/authStore';
import { confirmDelete } from '../../utils/alerts';
import {
  canReviewComplex,
  createReview,
  updateReview,
  deleteReview,
  getComplexReviews,
} from '../../api/reviewsApi';
import './ClubReviews.css';

const AVAILABLE_TAGS = ['Buena iluminación', 'Vestuarios limpios', 'Césped en buen estado'];

const ClubReviews = ({ complexId }) => {
  const { isAuthenticated, user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);

  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [myReview, setMyReview] = useState(null);

  const cargarReviews = useCallback(async () => {
    if (!complexId) return;
    try {
      const res = await getComplexReviews(complexId);
      const data = res.data || {};
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setAverage(data.average || 0);
      setCount(data.count || 0);
    } catch {
      // si falla, se mantienen los valores por defecto
    }
  }, [complexId]);

  const cargarCanReview = useCallback(async () => {
    if (!complexId || !isAuthenticated) return;
    try {
      const res = await canReviewComplex(complexId);
      const data = res.data || {};
      setAlreadyReviewed(!!data.alreadyReviewed);
      setMyReview(data.review || null);
    } catch {
      // si falla, se asume que el usuario puede valorar
    }
  }, [complexId, isAuthenticated]);

  useEffect(() => { cargarReviews(); }, [cargarReviews]);
  useEffect(() => { cargarCanReview(); }, [cargarCanReview]);

  // si el backend no devuelve la review propia en can-review, la buscamos en la lista pública
  useEffect(() => {
    if (alreadyReviewed && !myReview && user) {
      const userId = user._id || user.id;
      const found = reviews.find((r) => r.user?._id === userId || r.user?.id === userId);
      if (found) setMyReview(found);
    }
  }, [alreadyReviewed, myReview, reviews, user]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const openCreateModal = () => {
    setEditingReview(null);
    setRating(0);
    setComment('');
    setSelectedTags([]);
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    if (!myReview) return;
    setEditingReview(myReview);
    setRating(myReview.rating || 0);
    setComment(myReview.comment || '');
    setSelectedTags(Array.isArray(myReview.tags) ? myReview.tags : []);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!myReview) return;
    const result = await confirmDelete('Se eliminará tu valoración de este complejo.');
    if (!result.isConfirmed) return;

    try {
      await deleteReview(myReview._id);
      toast.success('Valoración eliminada.');
      setMyReview(null);
      setAlreadyReviewed(false);
      cargarReviews();
      cargarCanReview();
    } catch (err) {
      const message = err.response?.data?.message;
      toast.error(message || 'Ocurrió un error al eliminar la valoración.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Por favor, selecciona una calificación.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingReview) {
        await updateReview(editingReview._id, { rating, comment, tags: selectedTags });
        toast.success('Valoración actualizada.');
      } else {
        await createReview({ complexId, rating, comment, tags: selectedTags });
        toast.success('¡Gracias por tu valoración!');
      }
      setIsModalOpen(false);
      setEditingReview(null);
      setRating(0);
      setComment('');
      setSelectedTags([]);
      cargarReviews();
      cargarCanReview();
    } catch (err) {
      const message = err.response?.data?.message;
      toast.error(message || 'Ocurrió un error al guardar la valoración.');
    } finally {
      setSubmitting(false);
    }
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

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => reviews.filter((r) => r.rating === star).length);
  const maxCount = Math.max(1, ...ratingCounts);

  return (
    <div className="reviews-container">
      <h2 className="reviews-main-title">Opiniones de Jugadores</h2>

      <div className="reviews-box">
        <div className="reviews-summary-col">
          <div className="score-display">
            <span className="score-number">{average.toFixed(1)}</span>
            <div className="score-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={star <= Math.round(average)} />
              ))}
            </div>
            <span className="score-based">Basado en {count} reseñas</span>
          </div>

          {alreadyReviewed ? (
            <div className="my-review-box">
              <span className="my-review-title">Tu valoración</span>
              {myReview && (
                <>
                  <div className="review-stars-small">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < myReview.rating} />
                    ))}
                  </div>
                  {myReview.comment && <p className="review-text">{myReview.comment}</p>}
                </>
              )}
              <div className="my-review-actions">
                <button className="btn-secondary" onClick={openEditModal}>Editar</button>
                <button className="btn-danger" onClick={handleDelete}>Eliminar valoración</button>
              </div>
            </div>
          ) : (
            <button className="btn-rate" onClick={openCreateModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Valorar Experiencia
            </button>
          )}
        </div>

        <div className="reviews-bars-col">
          {[5, 4, 3, 2, 1].map((star, index) => (
            <div className="bar-row" key={star}>
              <span className="bar-label">{star}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(ratingCounts[index] / maxCount) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="reviews-list-col">
          {reviews.length === 0 && (
            <p className="review-text">Todavía no hay reseñas para este complejo.</p>
          )}
          {reviews.map((review) => (
            <div className="review-item" key={review._id}>
              <div className="review-header">
                <div className="review-user-info">
                  <span className="review-name">{review.user?.name}</span>
                  <div className="review-stars-small">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < review.rating} />
                    ))}
                  </div>
                </div>
                <span className="review-date">{formatearFecha(review.createdAt)}</span>
              </div>
              <p className="review-text">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            <h3>{editingReview ? 'Editar tu valoración' : '¿Cómo fue tu experiencia hoy?'}</h3>

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

              <div className="modal-tags-selector">
                {AVAILABLE_TAGS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className={`tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <textarea
                className="modal-textarea"
                placeholder="Cuéntanos qué te pareció el complejo..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
              ></textarea>
              <button type="submit" className="btn-submit-review" disabled={submitting}>
                {submitting ? 'Guardando...' : editingReview ? 'Guardar Cambios' : 'Enviar Valoración'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubReviews;
