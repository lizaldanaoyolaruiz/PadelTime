import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const timeOptions = [];
for (let h = 0; h < 24; h++) {
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  timeOptions.push(`${hour12.toString().padStart(2, '0')}:00 ${ampm}`);
}

export const BlockModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({
    name: '',
    recurrence: 'daily',
    day: '',
    startTime: '02:00 PM',
    endTime: '03:00 PM'
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        recurrence: initialData.recurrence || 'daily',
        day: initialData.day || '',
        startTime: initialData.startTime || '02:00 PM',
        endTime: initialData.endTime || '03:00 PM'
      });
    } else {
      setForm({
        name: '',
        recurrence: 'daily',
        day: '',
        startTime: '02:00 PM',
        endTime: '03:00 PM'
      });
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Editar bloqueo' : 'Nuevo bloqueo'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="ej. Mantenimiento"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Recurrencia</Form.Label>
            <Form.Select
              value={form.recurrence}
              onChange={e => setForm({
                ...form,
                recurrence: e.target.value,
                day: e.target.value === 'daily' ? '' : form.day
              })}
            >
              <option value="daily">Diario</option>
              <option value="weekly">Semanal (día específico)</option>
            </Form.Select>
          </Form.Group>
          {form.recurrence === 'weekly' && (
            <Form.Group className="mb-3">
              <Form.Label>Día</Form.Label>
              <Form.Select
                value={form.day}
                onChange={e => setForm({ ...form, day: e.target.value })}
              >
                <option value="">Selecciona un día</option>
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miércoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
                <option value="sábado">Sábado</option>
                <option value="domingo">Domingo</option>
              </Form.Select>
            </Form.Group>
          )}
          <div className="row">
            <div className="col-6">
              <Form.Group className="mb-3">
                <Form.Label>Inicio</Form.Label>
                <Form.Select
                  value={form.startTime}
                  onChange={e => setForm({ ...form, startTime: e.target.value })}
                >
                  {timeOptions.map(t => <option key={t}>{t}</option>)}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-6">
              <Form.Group className="mb-3">
                <Form.Label>Fin</Form.Label>
                <Form.Select
                  value={form.endTime}
                  onChange={e => setForm({ ...form, endTime: e.target.value })}
                >
                  {timeOptions.map(t => <option key={t}>{t}</option>)}
                </Form.Select>
              </Form.Group>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="success" onClick={handleSave}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};