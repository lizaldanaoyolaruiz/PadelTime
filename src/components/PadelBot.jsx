import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, MessageCircle, Plus } from 'lucide-react';
import api from '../services/axios';
import './padelbot.css';

function formatTime() {
  return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

const WELCOME = {
  id: 0,
  role: 'bot',
  text: '¡Hola! 👋 Soy tu asistente de PadelSaaS. ¿En qué puedo ayudarte hoy? Puedo buscar pistas, consultar disponibilidad o guiarte en el proceso de reserva.',
  time: formatTime(),
};

export default function PadelBot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: 'user', text, time: formatTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chatbot', { message: text });
      const botText = res.data.reply || res.data.message || '¿En qué más puedo ayudarte?';
      setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: botText, time: formatTime() }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'bot',
        text: 'Lo siento, no pude procesar tu consulta en este momento. Intentá de nuevo más tarde. 🙏',
        time: formatTime(),
      }]);
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
            <button className="pb-close" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
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
                <div className={`pb-bubble pb-bubble--${msg.role}`}>
                  <p>{msg.text}</p>
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
            <button className="pb-attach" tabIndex={-1}>
              <Plus size={17} />
            </button>
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
