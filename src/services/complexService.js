import api from './api';

const delay = (ms = 600) => new Promise(res => setTimeout(res, ms));

const MOCK_DATA = [
  {
    id: 1,
    name: 'Padel Center Madrid',
    image: null,
    owner: 'Carlos García',
    email: 'admin@padelcenter.es',
    phone: '+34 911 234 567',
    city: 'Madrid',
    province: 'Madrid',
    address: 'Calle Gran Vía 45',
    courts: 12,
    registeredAt: '2023-10-12',
    status: 'PENDING',
    observations: '',
  },
  {
    id: 2,
    name: 'Indoor Arena BCN',
    image: null,
    owner: 'María López',
    email: 'hola@indoorbcn.com',
    phone: '+34 932 456 789',
    city: 'Barcelona',
    province: 'Cataluña',
    address: 'Av. Diagonal 123',
    courts: 8,
    registeredAt: '2023-10-11',
    status: 'PENDING',
    observations: '',
  },
  {
    id: 3,
    name: 'Valencia Padel Pro',
    image: null,
    owner: 'José Martínez',
    email: 'info@valenciapadel.es',
    phone: '+34 963 111 222',
    city: 'Valencia',
    province: 'Valencia',
    address: 'Calle Colón 78',
    courts: 15,
    registeredAt: '2023-10-10',
    status: 'PENDING',
    observations: '',
  },
  {
    id: 4,
    name: 'Sevilla Padel Club',
    image: null,
    owner: 'Ana Rodríguez',
    email: 'ana@sevillapadel.es',
    phone: '+34 955 333 444',
    city: 'Sevilla',
    province: 'Andalucía',
    address: 'Av. Constitución 55',
    courts: 6,
    registeredAt: '2023-09-28',
    status: 'APPROVED',
    observations: '',
  },
  {
    id: 5,
    name: 'Bilbao Sport Center',
    image: null,
    owner: 'Pedro Fernández',
    email: 'pedro@bilbaosport.es',
    phone: '+34 944 555 666',
    city: 'Bilbao',
    province: 'País Vasco',
    address: 'Gran Vía 10',
    courts: 10,
    registeredAt: '2023-09-20',
    status: 'APPROVED',
    observations: '',
  },
  {
    id: 6,
    name: 'Málaga Padel Hub',
    image: null,
    owner: 'Laura Sánchez',
    email: 'laura@malagapadel.es',
    phone: '+34 952 777 888',
    city: 'Málaga',
    province: 'Andalucía',
    address: 'Paseo Marítimo 30',
    courts: 4,
    registeredAt: '2023-09-15',
    status: 'REJECTED',
    observations: 'Documentación incompleta.',
  },
  {
    id: 7,
    name: 'Zaragoza Padel Arena',
    image: null,
    owner: 'David Torres',
    email: 'david@zaragozapadel.es',
    phone: '+34 976 999 000',
    city: 'Zaragoza',
    province: 'Aragón',
    address: 'Calle Alfonso I 22',
    courts: 8,
    registeredAt: '2023-09-10',
    status: 'SUSPENDED',
    observations: 'Suspendido por incumplimiento de normativa.',
  },
  {
    id: 8,
    name: 'Murcia Padel & Sport',
    image: null,
    owner: 'Elena Jiménez',
    email: 'elena@murciapadel.es',
    phone: '+34 968 111 333',
    city: 'Murcia',
    province: 'Murcia',
    address: 'Av. Libertad 66',
    courts: 5,
    registeredAt: '2023-10-05',
    status: 'PENDING',
    observations: '',
  },
  {
    id: 9,
    name: 'Granada Padel Club',
    image: null,
    owner: 'Roberto Navarro',
    email: 'roberto@granadapadel.es',
    phone: '+34 958 222 444',
    city: 'Granada',
    province: 'Andalucía',
    address: 'Calle Reyes Católicos 12',
    courts: 7,
    registeredAt: '2023-10-08',
    status: 'PENDING',
    observations: '',
  },
  {
    id: 10,
    name: 'Alicante Sport Hub',
    image: null,
    owner: 'Carmen Vega',
    email: 'carmen@alicantepadel.es',
    phone: '+34 965 444 888',
    city: 'Alicante',
    province: 'Valencia',
    address: 'Av. del Mar 33',
    courts: 9,
    registeredAt: '2023-09-25',
    status: 'APPROVED',
    observations: '',
  },
];

export async function getAllComplexes() {
  await delay();
  return { data: MOCK_DATA.map(c => ({ ...c })) };
  // Real: return api.get('/admin/complexes');
}

export async function approveComplex(id) {
  await delay(500);
  return { data: { id, status: 'APPROVED' } };
  // Real: return api.patch(`/api/complexes/${id}/approve`);
}

export async function rejectComplex(id, reason = '') {
  await delay(500);
  return { data: { id, status: 'REJECTED', reason } };
  // Real: return api.patch(`/api/complexes/${id}/reject`, { reason });
}

export async function suspendComplex(id) {
  await delay(500);
  return { data: { id, status: 'SUSPENDED' } };
  // Real: return api.patch(`/api/complexes/${id}/suspend`);
}

export async function createComplex(data) {
  await delay(600);
  const newComplex = {
    ...data,
    id: Date.now(),
    image: null,
    registeredAt: new Date().toISOString().split('T')[0],
    status: 'PENDING',
    observations: data.observations || '',
  };
  return { data: newComplex };
  // Real: return api.post('/admin/complexes', data);
}

export async function sendApprovalEmail(id) {
  await delay(300);
  return { data: { sent: true } };
  // Real: return api.post('/api/notifications/approval', { complexId: id });
}

export async function sendRejectionEmail(id) {
  await delay(300);
  return { data: { sent: true } };
  // Real: return api.post('/api/notifications/rejection', { complexId: id });
}
