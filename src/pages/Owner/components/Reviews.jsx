import { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';
import { getOwnerReviews } from '../../../services/reviewService';
import './Reviews.css';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    try {
      const res = await getOwnerReviews();
      const data = res.data || {};
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setAverage(data.average || 0);
      setCount(data.count || 0);
    } catch (err) {
      const status = err.response?.status;
      if (status && ![404, 401, 403].includes(status)) console.error('Error cargando valoraciones:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <div className="panel-wrap"><p style={{ color: 'var(--color-text-muted)' }}>Cargando...</p></div>;
  }

  return (
    <div className="panel-wrap">
      <div className="pg-header">
        <div>
          <h2>Valoraciones</h2>
          <p className="panel-subtitle">Opiniones de los jugadores sobre tu complejo</p>
        </div>
      </div>

      <div className="val-card val-card--summary">
        <h3 className="pg-card-title">Promedio de Satisfacción</h3>
        <div className="val-average">
          <span className="val-average-number">{average.toFixed(1)}</span>
          <div className="val-average-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                fill={star <= Math.round(average) ? 'var(--color-primary)' : 'none'}
                stroke="var(--color-primary)"
              />
            ))}
          </div>
        </div>
        <p className="val-average-meta">Basado en {count} valoraciones</p>
      </div>

      <div className="val-card">
        <h3 className="pg-card-title">Comentarios Recientes</h3>
        {reviews.length === 0 && (
          <p className="pg-card-desc">Todavía no recibiste valoraciones.</p>
        )}
        <div className="val-list">
          {reviews.map((review) => (
            <div className="val-item" key={review._id}>
              <div className="val-item-header">
                <div className="val-item-info">
                  <span className="val-item-name">{review.user?.name}</span>
                  <div className="val-item-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={star <= review.rating ? 'var(--color-primary)' : 'none'}
                        stroke="var(--color-primary)"
                      />
                    ))}
                  </div>
                </div>
                <span className="val-item-date">{formatearFecha(review.createdAt)}</span>
              </div>
              <p className="val-item-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
