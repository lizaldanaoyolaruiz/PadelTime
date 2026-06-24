import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, MessageCircle, RotateCcw } from 'lucide-react';
import api from '../services/axios';
import './padelbot.css';

function formatTime() {
  return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

function makeWelcome() {
  return {
    id: Date.now(),
    role: 'bot',
    text: '¡Hola! 👋 Soy PadelBot, tu asistente de PadelTime. Puedo consultar disponibilidad de canchas, darte links de reserva directa o por WhatsApp. ¿En qué te puedo ayudar?',
    time: formatTime(),
    bookingOptions: null,
  };
}

export default function PadelBot() {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState([makeWelcome()]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  const resetChat = () => {
    setMessages([makeWelcome()]);
    setSessionId(null);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: 'user', text, time: formatTime(), bookingOptions: null };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chatbot', { message: text, sessionId });
      const { reply, bookingOptions, alternativasOpciones, sessionId: newSessionId } = res.data;

      if (!sessionId && newSessionId) setSessionId(newSessionId);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'bot',
          text: reply || '¿En qué más puedo ayudarte?',
          time: formatTime(),
          bookingOptions: bookingOptions || null,
          alternativasOpciones: alternativasOpciones || null,
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'bot',
          text: 'Lo siento, no pude procesar tu consulta en este momento. Intentá de nuevo más tarde. 🙏',
          time: formatTime(),
          bookingOptions: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="pb-root">
      {open && (
        <div className="pb-widget">
          {/* Header */}
          <div className="pb-header">
            <div className="pb-header-left">
              <div className="pb-avatar">
                <Bot size={18} />
              </div>
              <div>
                <p className="pb-name">PadelBot</p>
                <p className="pb-status">
                  <span className="pb-dot" />
                  En línea
                </p>
              </div>
            </div>
            <div className="pb-header-actions">
              <button className="pb-close" onClick={resetChat} title="Nueva conversación">
                <RotateCcw size={15} />
              </button>
              <button className="pb-close" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="pb-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`pb-row pb-row--${msg.role}`}>
                {msg.role === 'bot' && (
                  <div className="pb-avatar pb-avatar--sm">
                    <Bot size={13} />
                  </div>
                )}
                <div
                  className={`pb-bubble pb-bubble--${msg.role}${(msg.bookingOptions || msg.alternativasOpciones) ? ' pb-bubble--wide' : ''}`}
                >
                  <p>{msg.text}</p>

                  {msg.bookingOptions && (
                    <div className="pb-booking">
                      <p className="pb-booking-meta">
                        {msg.bookingOptions.complejo} · {msg.bookingOptions.fechaFormateada} · {msg.bookingOptions.horario}
                      </p>
                      {msg.bookingOptions.disponibles.map(court => (
                        <div key={court.courtId} className="pb-court-card">
                          <div className="pb-court-info">
                            <strong>{court.nombre}</strong>
                            <span>{court.tipo} · ${court.precio}/hr</span>
                          </div>
                          <div className="pb-court-actions">
                            <a href={court.linkReserva} target="_blank" rel="noreferrer" className="pb-btn-reserva">
                              Reservar online
                            </a>
                            {court.linkWhatsApp && (
                              <a href={court.linkWhatsApp} target="_blank" rel="noreferrer" className="pb-btn-wa">
                                WhatsApp
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.alternativasOpciones && (
                    <div className="pb-booking">
                      <p className="pb-booking-meta">
                        {msg.alternativasOpciones.complejo} · {msg.alternativasOpciones.fechaFormateada} · Horarios disponibles
                      </p>
                      {msg.alternativasOpciones.slots.map(slot => (
                        <div key={slot.horario} className="pb-slot-group">
                          <p className="pb-slot-label">🕐 {slot.horarioLabel}</p>
                          {slot.canchas.map(court => (
                            <div key={court.courtId} className="pb-court-card">
                              <div className="pb-court-info">
                                <strong>{court.nombre}</strong>
                                <span>{court.tipo} · ${court.precio}/hr</span>
                              </div>
                              <div className="pb-court-actions">
                                <a href={court.linkReserva} target="_blank" rel="noreferrer" className="pb-btn-reserva">
                                  Reservar
                                </a>
                                {court.linkWhatsApp && (
                                  <a href={court.linkWhatsApp} target="_blank" rel="noreferrer" className="pb-btn-wa">
                                    WhatsApp
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="pb-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="pb-row pb-row--bot">
                <div className="pb-avatar pb-avatar--sm">
                  <Bot size={13} />
                </div>
                <div className="pb-bubble pb-bubble--bot">
                  <div className="pb-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="pb-input-wrap">
            <input
              ref={inputRef}
              type="text"
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading}
              maxLength={300}
            />
            <button
              className="pb-send"
              onClick={send}
              disabled={loading || !input.trim()}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* FAB trigger */}
      <button className={`pb-fab${open ? ' pb-fab--open' : ''}`} onClick={() => setOpen(o => !o)}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
