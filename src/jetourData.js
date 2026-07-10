const proxied = url =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ''))}&output=webp&w=1200`

export const IMG = {
  hero: proxied('https://jetourchile.cl/documents/7190100/13275002/X70%2BPlus-Card.webp/c67533fd-ba78-f7d2-53f1-1ce64266c1ce?t=1771255199333'),
  x50: proxied('https://jetourchile.cl/documents/7190100/11940205/X50-Card.webp/97c09178-de06-3240-8213-f5cc446a8a80?t=1755889826966'),
  dashing: proxied('https://jetourchile.cl/documents/7190100/11482279/JETOUR-DASHING%2B%281%29.webp/5aa70ec2-c36a-d479-b2f8-966ac95baa0a?t=1749740112196'),
  x70: proxied('https://jetourangola.com/wp-content/uploads/2023/05/Layer-mb1-min-scaled.webp'),
  x70Plus: proxied('https://jetourchile.cl/documents/7190100/13275002/X70%2BPlus-Card.webp/c67533fd-ba78-f7d2-53f1-1ce64266c1ce?t=1771255199333'),
  x90Plus: proxied('https://jetourangola.com/wp-content/uploads/2023/04/Background4.png'),
  t1: proxied('https://jetourchile.cl/documents/7190100/11948154/T1-Card.webp/75f3de9f-ea3e-fd4f-4a42-05e7ae5075d2?t=1756147956003'),
  t2: proxied('https://jetourchile.cl/documents/7190100/11482279/JETOUR-T2%2B%281%29.webp/4f82898e-08d3-459b-8f48-52afb68a6486?t=1749740111919'),
  t1Phev: proxied('https://jetourchile.cl/documents/7190100/13122985/T1PHEV-Card%2B%281%29.webp/691c15b4-cf4f-fdd5-38ca-85048c36538b?t=1769088223015'),
  t2Phev: proxied('https://jetourchile.cl/documents/7190100/13122985/T2PHEV-Card.webp/af488f79-bfbf-f96e-d023-77055858304f?t=1769088336862'),
  desert: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1800&q=80',
  city: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1800&q=80',
  family: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80',
  road: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80'
}

const gallery = (img, name, mood = 'premium') => [
  { img, title: `${name} exterior principal`, kind: 'model' },
  { img, title: `${name} vista frontal`, kind: 'model zoom front' },
  { img, title: `${name} perfil lateral`, kind: 'model zoom side' },
  { img, title: `${name} diseño trasero`, kind: 'model zoom rear' },
  { img: IMG.desert, title: `${name} espíritu adventure`, kind: mood },
  { img: IMG.city, title: `${name} uso urbano`, kind: mood },
  { img: IMG.family, title: `${name} experiencia familiar`, kind: mood },
  { img: IMG.road, title: `${name} ruta y escapadas`, kind: mood }
]

export const benefits = [
  { title: 'Bono Financiamiento', text: 'Beneficios exclusivos según campaña y evaluación.', icon: '▤' },
  { title: 'Toma de usado', text: 'Evaluamos tu vehículo para renovar por un 0 km.', icon: '↻' },
  { title: 'Crédito inteligente', text: 'Alternativas de cuota y valor futuro referencial.', icon: '◉' },
  { title: 'Test Drive', text: 'Agenda tu prueba en sucursal Bilbao, Providencia.', icon: '▣' },
  { title: 'Atención directa', text: 'Cotización personalizada por WhatsApp con tu ejecutivo.', icon: '☎' },
  { title: 'Sucursal Bilbao', text: 'Av. Francisco Bilbao 1147, Providencia, Santiago.', icon: '⌖' }
]

export const modelData = [
  {
    slug: 'x50',
    name: 'X50',
    type: 'SUV compacto',
    tag: 'Ciudad',
    img: IMG.x50,
    quoteImg: IMG.x50,
    imageMode: 'cutout',
    accent: '#b98a3a',
    price: 12490000,
    desc: 'Compacto, ágil y eficiente para el uso diario.',
    specs: { Motor: '1.5L / 1.5T', Potencia: '145 HP', Transmisión: 'MT / 6DCT', Tracción: '4x2', Combustible: 'Bencina', Pasajeros: '5' },
    features: ['Pantalla multimedia', 'Conectividad smartphone', 'Cámara y sensores según versión', 'Control de estabilidad', 'Anclajes ISOFIX'],
    gallery: gallery(IMG.x50, 'X50', 'urbano'),
    versions: [
      { code: 'BX501', name: '1.5L MT LUX', price: 12490000, motor: '1.5L', hp: 145, transmission: 'MT', traction: '4x2' },
      { code: 'BX503', name: '1.5L MT LUX BICOLOR', price: 12790000, motor: '1.5L', hp: 145, transmission: 'MT', traction: '4x2' },
      { code: 'BX502', name: '1.5T 6DCT TURBO LUX', price: 15490000, motor: '1.5T', hp: 145, transmission: '6DCT', traction: '4x2' },
      { code: 'BX504', name: '1.5T 6DCT TURBO LUX BICOLOR', price: 15790000, motor: '1.5T', hp: 145, transmission: '6DCT', traction: '4x2' }
    ]
  },
  {
    slug: 'dashing',
    name: 'Dashing',
    type: 'SUV deportivo',
    tag: 'Diseño',
    img: IMG.dashing,
    quoteImg: IMG.dashing,
    imageMode: 'cutout',
    accent: '#b98a3a',
    price: 16490000,
    desc: 'Diseño deportivo y tecnológico con gran presencia visual.',
    specs: { Motor: '1.5T / 1.6T GDI', Potencia: '145 a 188 HP', Transmisión: '6MT / 6DCT / 7DCT', Tracción: '4x2', Combustible: 'Bencina', Pasajeros: '5' },
    features: ['Diseño deportivo', 'Interior tecnológico', 'Versiones turbo', 'ADAS según versión', 'Cámara y sensores según versión'],
    gallery: gallery(IMG.dashing, 'Dashing', 'deportivo'),
    versions: [
      { code: 'BD01', name: '6MT 1.5L Turbo Special Edition FL', price: 16490000, motor: '1.5T', hp: 145, transmission: '6MT', traction: '4x2' },
      { code: 'BD02', name: '1.5L 6MT Turbo Lux FL', price: 17490000, motor: '1.5T', hp: 145, transmission: '6MT', traction: '4x2' },
      { code: 'BD03', name: '6DCT 1.5L Turbo Special Edition FL', price: 18490000, motor: '1.5T', hp: 145, transmission: '6DCT', traction: '4x2' },
      { code: 'BD04', name: '6DCT 1.5L Turbo Lux', price: 19490000, motor: '1.5T', hp: 145, transmission: '6DCT', traction: '4x2' },
      { code: 'BD05', name: '7DCT 1.6L Turbo GDI Limited', price: 21990000, motor: '1.6T GDI', hp: 188, transmission: '7DCT', traction: '4x2' }
    ]
  },
  {
    slug: 'x70',
    name: 'X70',
    type: 'SUV familiar',
    tag: 'Espacio',
    img: IMG.x70,
    quoteImg: IMG.x70,
    imageMode: 'cutout',
    accent: '#9b6d2a',
    price: 17490000,
    desc: 'Espacio, comodidad y versatilidad para la familia.',
    specs: { Motor: '1.5T', Potencia: '145 HP', Transmisión: '6MT / 6DCT', Tracción: '4x2', Combustible: 'Bencina', Pasajeros: '7' },
    features: ['Amplio espacio interior', 'Tres corridas de asientos', 'Pantalla multimedia', 'Motor turbo', 'Confort para viajes'],
    gallery: gallery(IMG.x70, 'X70', 'familiar'),
    versions: [
      { code: 'BX701', name: '1.5T 6MT TURBO FL', price: 17490000, motor: '1.5T', hp: 145, transmission: '6MT', traction: '4x2' },
      { code: 'BX702', name: '1.5T 6DCT TURBO FL', price: 19490000, motor: '1.5T', hp: 145, transmission: '6DCT', traction: '4x2' }
    ]
  },
  {
    slug: 'x70-plus',
    name: 'X70 Plus',
    type: 'SUV familiar premium',
    tag: 'Familia',
    img: IMG.x70Plus,
    quoteImg: IMG.x70Plus,
    imageMode: 'cutout',
    accent: '#9b6d2a',
    price: 20990000,
    desc: 'Mayor confort, tecnología y espacio para viajar en familia.',
    specs: { Motor: '1.5T / 1.6T GDI', Potencia: '145 a 188 HP', Transmisión: '6DCT / 7DCT', Tracción: '4x2', Combustible: 'Bencina', Pasajeros: '7' },
    features: ['Gran espacio interior', 'Confort familiar', 'Pantalla multimedia', 'Motor turbo', 'Equipamiento superior'],
    gallery: gallery(IMG.x70Plus, 'X70 Plus', 'familiar'),
    versions: [
      { code: 'BX705', name: '1.5T 6DCT FL', price: 20990000, motor: '1.5T', hp: 145, transmission: '6DCT', traction: '4x2' },
      { code: 'BX706', name: '1.6T GDI 7DCT LUX FL', price: 22490000, motor: '1.6T GDI', hp: 188, transmission: '7DCT', traction: '4x2' }
    ]
  },
  {
    slug: 'x90-plus',
    name: 'X90 Plus',
    type: 'SUV familiar premium',
    tag: 'Premium',
    img: IMG.x90Plus,
    quoteImg: IMG.x90Plus,
    imageMode: 'cutout',
    accent: '#9b6d2a',
    price: 27490000,
    desc: 'SUV amplio y potente, orientado al máximo confort familiar.',
    specs: { Motor: '2.0T GDI', Potencia: '241 HP', Transmisión: '7DCT', Tracción: '4x2', Combustible: 'Bencina', Pasajeros: '7' },
    features: ['Tres corridas de asientos', 'Motor 2.0T GDI', 'Pantalla multimedia', 'Confort premium', 'Asistencias según versión'],
    gallery: gallery(IMG.x90Plus, 'X90 Plus', 'premium'),
    versions: [
      { code: 'BX901', name: '2.0T GDI 7DCT', price: 27490000, motor: '2.0T GDI', hp: 241, transmission: '7DCT', traction: '4x2' }
    ]
  },
  {
    slug: 't1',
    name: 'T1',
    type: 'SUV adventure',
    tag: 'Adventure',
    img: IMG.t1,
    quoteImg: IMG.t1,
    imageMode: 'cutout',
    accent: '#8b6a38',
    price: 22990000,
    desc: 'Robusto, versátil y con personalidad outdoor.',
    specs: { Motor: '1.5T / 2.0T', Potencia: '167 a 241 HP', Transmisión: '7DCT / 8AT', Tracción: '4x2 / XWD', Combustible: 'Bencina', Pasajeros: '5' },
    features: ['Estilo adventure', 'Opciones XWD', 'Diseño robusto', 'Interior tecnológico', 'Alta presencia en ruta'],
    gallery: gallery(IMG.t1, 'T1', 'adventure'),
    versions: [
      { code: 'BT101', name: '1.5T 7DCT LUXURY', price: 22990000, motor: '1.5T', hp: 167, transmission: '7DCT', traction: '4x2' },
      { code: 'BT103', name: '1.5T 7DCT LUXURY MATE', price: 23490000, motor: '1.5T', hp: 167, transmission: '7DCT', traction: '4x2' },
      { code: 'BT102', name: '2.0T 8AT XWD LIMITED', price: 26990000, motor: '2.0T', hp: 241, transmission: '8AT', traction: 'XWD' },
      { code: 'BT104', name: '2.0T 8AT XWD LIMITED MATE', price: 27490000, motor: '2.0T', hp: 241, transmission: '8AT', traction: 'XWD' }
    ]
  },
  {
    slug: 't2',
    name: 'T2',
    type: 'SUV off road premium',
    tag: 'Premium',
    img: IMG.t2,
    quoteImg: IMG.t2,
    imageMode: 'cutout',
    accent: '#8b6a38',
    price: 29990000,
    desc: 'Presencia todoterreno, potencia y diseño premium.',
    specs: { Motor: '2.0T GDI', Potencia: '241 HP', Transmisión: '7DCT', Tracción: 'XWD', Combustible: 'Bencina', Pasajeros: '5' },
    features: ['Diseño off road premium', 'Tracción XWD', 'Motor 2.0T GDI', 'Interior tecnológico', 'Alta presencia y seguridad'],
    gallery: gallery(IMG.t2, 'T2', 'off road'),
    versions: [
      { code: 'BT201', name: '2.0T GDI AWD 7DCT LIMITED', price: 29990000, motor: '2.0T GDI', hp: 241, transmission: '7DCT', traction: 'XWD' },
      { code: 'BT202', name: '2.0T GDI AWD 7DCT LIMITED MATE', price: 30490000, motor: '2.0T GDI', hp: 241, transmission: '7DCT', traction: 'XWD' }
    ]
  },
  {
    slug: 't1-phev',
    name: 'T1 PHEV',
    type: 'SUV híbrido enchufable',
    tag: 'PHEV',
    img: IMG.t1Phev,
    quoteImg: IMG.t1Phev,
    imageMode: 'cutout',
    accent: '#477a68',
    price: 29990000,
    desc: 'Tecnología híbrida enchufable con diseño adventure.',
    specs: { Motor: '1.5T PHEV', Potencia: '341 HP', Transmisión: 'Híbrida', Tracción: '4x2', Combustible: 'PHEV', Pasajeros: '5' },
    features: ['Sistema híbrido enchufable', 'Diseño adventure', 'Interior tecnológico', 'Alta eficiencia', 'Conectividad'],
    gallery: gallery(IMG.t1Phev, 'T1 PHEV', 'híbrido'),
    versions: [
      { code: 'PT101', name: '1.5T PHEV LIMITED', price: 29990000, motor: '1.5T PHEV', hp: 341, transmission: 'PHEV', traction: '4x2' },
      { code: 'PT102', name: '1.5T PHEV LIMITED MATE', price: 30490000, motor: '1.5T PHEV', hp: 341, transmission: 'PHEV', traction: '4x2' }
    ]
  },
  {
    slug: 't2-phev',
    name: 'T2 PHEV',
    type: 'SUV híbrido enchufable',
    tag: 'PHEV',
    img: IMG.t2Phev,
    quoteImg: IMG.t2Phev,
    imageMode: 'cutout',
    accent: '#477a68',
    price: 36990000,
    desc: 'Potencia híbrida enchufable y diseño todoterreno.',
    specs: { Motor: '1.5T PHEV', Potencia: '375 HP', Transmisión: 'Híbrida', Tracción: '4x2', Combustible: 'PHEV', Pasajeros: '5' },
    features: ['Sistema híbrido enchufable', 'Diseño todoterreno', 'Interior premium', 'Alta potencia', 'Conectividad'],
    gallery: gallery(IMG.t2Phev, 'T2 PHEV', 'híbrido'),
    versions: [
      { code: 'PT201', name: '1.5T PHEV LIMITED', price: 36990000, motor: '1.5T PHEV', hp: 375, transmission: 'PHEV', traction: '4x2' },
      { code: 'PT202', name: '1.5T PHEV LIMITED MATE', price: 37490000, motor: '1.5T PHEV', hp: 375, transmission: 'PHEV', traction: '4x2' }
    ]
  }
]