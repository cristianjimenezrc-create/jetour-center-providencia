export const IMG = {
  hero: '/vehicles/x70-plus-card.webp',
  x50: '/vehicles/x50-card.webp',
  x50Secondary: '/vehicles/x50-design.webp',
  x50White: '/vehicles/x50-mt-lux.webp',
  x50Black: '/vehicles/x50-6dct-lux.webp',
  dashing: '/vehicles/dashing-card.webp',
  dashingSecondary: '/vehicles/dashing-6mt-se.png',
  dashingRed: '/vehicles/dashing-6mt-lux.png',
  dashingBlue: '/vehicles/dashing-6dct-se.png',
  dashingGray: '/vehicles/dashing-6dct-lux.png',
  dashingTechGray: '/vehicles/dashing-7dct-limited.png',
  x70: '/vehicles/x70-card.webp',
  x70Secondary: '/vehicles/x70-confort.webp',
  x70Black: '/vehicles/x70-6mt.webp',
  x70White: '/vehicles/x70-6dct.webp',
  x70Plus: '/vehicles/x70-plus-card.webp',
  x70PlusSecondary: '/vehicles/x70-plus-6dct.webp',
  x70PlusBlue: '/vehicles/x70-plus-7dct.webp',
  x90Plus: '/vehicles/x90-plus.png',
  x90PlusSecondary: '/vehicles/x90-plus-interior.webp',
  t1: '/vehicles/t1-card.webp',
  t1Secondary: '/vehicles/t1-confort.webp',
  t1Gray: '/vehicles/t1-7dct-luxury.webp',
  t1Blue: '/vehicles/t1-8at-limited.webp',
  t2: '/vehicles/t2-card.webp',
  t2Secondary: '/vehicles/t2-limited.png',
  t1Phev: '/vehicles/t1-phev-card.webp',
  t1PhevGreen: '/vehicles/t1-phev-limited.webp',
  t2Phev: '/vehicles/t2-phev-card.webp',
  t2PhevSecondary: '/vehicles/t2-phev-limited.webp',
  desert: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1800&q=80',
  city: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1800&q=80',
  family: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80',
  road: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80'
}

const gallery = (images, name, mood = 'premium') => {
  const [primary, secondary = primary] = images
  return [
    { img: primary, title: `${name} exterior principal`, kind: 'model' },
    { img: secondary, title: `${name} segunda vista oficial`, kind: 'model' },
    { img: primary, title: `${name} detalle exterior`, kind: 'model zoom front' },
    { img: secondary, title: `${name} diseño y confort`, kind: 'model zoom side' },
    { img: IMG.desert, title: `${name} espíritu adventure`, kind: mood },
    { img: IMG.city, title: `${name} uso urbano`, kind: mood },
    { img: IMG.family, title: `${name} experiencia familiar`, kind: mood },
    { img: IMG.road, title: `${name} ruta y escapadas`, kind: mood }
  ]
}

const v = ({ code, name, price, motor, hp, transmission, traction = '4x2', features, source, quoteImages }) => ({
  code, name, price, motor, hp, transmission, traction, features, source, quoteImages
})

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
    slug: 'x50', name: 'X50', type: 'SUV compacto', tag: 'Ciudad', img: IMG.x50,
    quoteImages: [IMG.x50, IMG.x50Secondary], imageMode: 'cutout', accent: '#b98a3a', price: 12490000,
    desc: 'Compacto, ágil y eficiente para el uso diario.',
    specs: { Motor: '1.5L / 1.5T', Potencia: '111 / 154 HP', Transmisión: '5MT / 6DCT', Tracción: '4x2', Combustible: 'Gasolina', Pasajeros: '5' },
    features: ['Radio touch 10,25”', 'Smart Key', 'Control crucero', 'Sensor trasero', 'Control de estabilidad', 'Asistencia en pendiente'],
    gallery: gallery([IMG.x50, IMG.x50Secondary], 'X50', 'urbano'),
    versions: [
      v({ code: 'BX501', name: '1.5L MT LUX', price: 12490000, motor: '1.5L', hp: 111, transmission: '5MT', quoteImages: [IMG.x50White, IMG.x50Secondary], features: ['2 airbags', 'Sensor estacionamiento trasero', 'Radio touch 10,25”', 'Smart Key', 'Control crucero', 'Llantas 17”'], source: 'https://jetourchile.cl/w/x50' }),
      v({ code: 'BX502', name: '1.5T 6DCT TURBO LUX', price: 15490000, motor: '1.5T', hp: 154, transmission: '6DCT', quoteImages: [IMG.x50Black, IMG.x50Secondary], features: ['6 airbags', 'Sensor estacionamiento trasero', 'Cámara panorámica 360°', 'Advertencia de colisión', 'Radio touch 10,25”', 'Modos Eco/Normal/Sport'], source: 'https://jetourchile.cl/w/x50' })
    ]
  },
  {
    slug: 'dashing', name: 'Dashing', type: 'SUV deportivo', tag: 'Diseño', img: IMG.dashing,
    quoteImages: [IMG.dashing, IMG.dashingSecondary], imageMode: 'cutout', accent: '#b98a3a', price: 16490000,
    desc: 'Diseño deportivo y tecnológico con gran presencia visual.',
    specs: { Motor: '1.5T / 1.6T GDI', Potencia: '145 / 188 HP', Transmisión: '6MT / 6DCT / 7DCT', Tracción: '4x2', Combustible: 'Bencina', Pasajeros: '5' },
    features: ['Motor turbo', 'Radio touch con conectividad', 'Smart Key', 'Control crucero', 'Sensor trasero', 'Equipamiento según versión'],
    gallery: gallery([IMG.dashing, IMG.dashingSecondary], 'Dashing', 'deportivo'),
    versions: [
      v({ code: 'BD01', name: '6MT 1.5L TURBO SPECIAL EDITION FL', price: 16490000, motor: '1.5T', hp: 145, transmission: '6MT', quoteImages: [IMG.dashingSecondary, IMG.dashing], features: ['4 airbags', 'Sensor de proximidad trasero', 'Radio touch 12,8”', 'Smart Key + botón de encendido', 'Control crucero', 'Neumáticos 235/60 R18'], source: 'https://jetourchile.cl/w/dashing' }),
      v({ code: 'BD02', name: '6MT 1.5L TURBO LUX FL', price: 17490000, motor: '1.5T', hp: 145, transmission: '6MT', quoteImages: [IMG.dashingRed, IMG.dashing], features: ['4 airbags', 'Sensor de proximidad trasero', 'Cámara panorámica 360°', 'Radio touch 12,8”', 'Smart Key + botón de encendido', 'Neumáticos 235/55 R19'], source: 'https://jetourchile.cl/w/dashing' }),
      v({ code: 'BD03', name: '6DCT 1.5L TURBO SPECIAL EDITION FL', price: 18490000, motor: '1.5T', hp: 145, transmission: '6DCT', quoteImages: [IMG.dashingBlue, IMG.dashing], features: ['4 airbags', 'Sensor de proximidad trasero', 'Encendido remoto', 'Radio touch 12,8”', 'Modos Eco/Sport', 'Neumáticos 235/60 R18'], source: 'https://jetourchile.cl/w/dashing' }),
      v({ code: 'BD04', name: '6DCT 1.5L TURBO LUX FL', price: 19490000, motor: '1.5T', hp: 145, transmission: '6DCT', quoteImages: [IMG.dashingGray, IMG.dashing], features: ['6 airbags', 'Cámara panorámica 540°', 'Sensor de lluvia', 'Advertencia de colisión frontal y lateral', 'Sistema de seguridad ADAS', 'Portalón eléctrico regulable'], source: 'https://jetourchile.cl/w/dashing' }),
      v({ code: 'BD05', name: '7DCT 1.6L TURBO GDI LIMITED FL', price: 21990000, motor: '1.6T GDI', hp: 188, transmission: '7DCT', quoteImages: [IMG.dashingTechGray, IMG.dashing], features: ['6 airbags', 'Sensores delanteros y traseros', 'Cámara panorámica 540°', 'Sistema de seguridad ADAS', 'Control crucero adaptativo', 'Climatizador dual automático'], source: 'https://jetourchile.cl/w/dashing' })
    ]
  },
  {
    slug: 'x70', name: 'X70', type: 'SUV familiar', tag: 'Espacio', img: IMG.x70,
    quoteImages: [IMG.x70, IMG.x70Secondary], imageMode: 'photo', accent: '#9b6d2a', price: 17490000,
    desc: 'Espacio, comodidad y versatilidad para la familia.',
    specs: { Motor: '1.5T', Potencia: '145 HP', Transmisión: '6MT / 6DCT', Tracción: '4x2', Combustible: 'Bencina', Pasajeros: '7' },
    features: ['7 pasajeros', '6 airbags', 'Radio touch 10,25”', 'Sunroof panorámico', 'Control crucero', 'Llantas aleación 20”'],
    gallery: gallery([IMG.x70, IMG.x70Secondary], 'X70', 'familiar'),
    versions: [
      v({ code: 'BX701', name: '1.5L 6MT TURBO FL', price: 17490000, motor: '1.5T', hp: 145, transmission: '6MT', quoteImages: [IMG.x70Black, IMG.x70Secondary], features: ['6 airbags', 'Cámara de retroceso', 'Sensor de proximidad trasero', 'Monitor presión de neumáticos', 'Sunroof panorámico', 'Radio touch 10,25”'], source: 'https://jetourchile.cl/w/x70' }),
      v({ code: 'BX702', name: '1.5L 6DCT TURBO FL', price: 19490000, motor: '1.5T', hp: 145, transmission: '6DCT', quoteImages: [IMG.x70White, IMG.x70Secondary], features: ['6 airbags', 'Cámara de retroceso', 'Sensores delanteros y traseros', 'Portalón trasero eléctrico', 'Sunroof panorámico', 'Modos Eco/Sport'], source: 'https://jetourchile.cl/w/x70' })
    ]
  },
  {
    slug: 'x70-plus', name: 'X70 Plus', type: 'SUV familiar premium', tag: 'Familia', img: IMG.x70Plus,
    quoteImages: [IMG.x70Plus, IMG.x70PlusSecondary], imageMode: 'cutout', accent: '#9b6d2a', price: 20990000,
    desc: 'Mayor confort, tecnología y espacio para viajar en familia.',
    specs: { Motor: '1.5T / 1.6T GDI', Potencia: '145 / 188 HP', Transmisión: '6DCT / 7DCT', Tracción: '4x2', Combustible: 'Bencina', Pasajeros: '7' },
    features: ['7 pasajeros', 'Cámara panorámica 360°', 'Radio touch 10,25”', 'Climatizador dual', 'Sunroof panorámico', 'Modos Eco/Normal/Sport'],
    gallery: gallery([IMG.x70Plus, IMG.x70PlusSecondary], 'X70 Plus', 'familiar'),
    versions: [
      v({ code: 'BX705', name: '1.5T 6DCT FL', price: 20990000, motor: '1.5T', hp: 145, transmission: '6DCT', quoteImages: [IMG.x70PlusSecondary, IMG.x70Plus], features: ['4 airbags', 'Cámara panorámica 360°', 'Advertencia cambio de carril', 'Asistencia electrónica de frenado', 'Climatizador dual', 'Sunroof panorámico'], source: 'https://jetourchile.cl/w/x70-plus' }),
      v({ code: 'BX706', name: '1.6L GDI 7DCT LUX FL', price: 22490000, motor: '1.6T GDI', hp: 188, transmission: '7DCT', quoteImages: [IMG.x70PlusBlue, IMG.x70Plus], features: ['6 airbags', 'Sensor de proximidad trasero', 'Cámara panorámica 360°', 'Sensor de lluvia', 'Carga inalámbrica', 'Purificador de aire'], source: 'https://jetourchile.cl/w/x70-plus' })
    ]
  },
  {
    slug: 'x90-plus', name: 'X90 Plus', type: 'SUV familiar premium', tag: 'Premium', img: IMG.x90Plus,
    quoteImages: [IMG.x90Plus, IMG.x90PlusSecondary], imageMode: 'cutout', accent: '#9b6d2a', price: 27490000,
    desc: 'SUV amplio y potente, orientado al máximo confort familiar.',
    specs: { Motor: '2.0T GDI', Potencia: '241 HP', Transmisión: '7DCT', Tracción: '4x2', Combustible: 'Bencina', Pasajeros: '7' },
    features: ['7 pasajeros', '6 airbags', 'Cámara 360°', 'ADAS', 'Control crucero adaptativo', 'Sunroof panorámico'],
    gallery: gallery([IMG.x90Plus, IMG.x90PlusSecondary], 'X90 Plus', 'premium'),
    versions: [
      v({ code: 'BX901', name: '2.0T GDI 7DCT', price: 27490000, motor: '2.0T GDI', hp: 241, transmission: '7DCT', quoteImages: [IMG.x90Plus, IMG.x90PlusSecondary], features: ['6 airbags', 'Cámara panorámica 360°', 'Sistema de seguridad ADAS', 'Control crucero adaptativo', 'Climatizador dual + aire 3ª fila', 'Sunroof panorámico'], source: 'https://jetourchile.cl/w/x90-plus' })
    ]
  },
  {
    slug: 't1', name: 'T1', type: 'SUV adventure', tag: 'Adventure', img: IMG.t1,
    quoteImages: [IMG.t1, IMG.t1Secondary], imageMode: 'cutout', accent: '#8b6a38', price: 22990000,
    desc: 'Robusto, versátil y con personalidad outdoor.',
    specs: { Motor: '1.5T / 2.0T', Potencia: '167 / 241 HP', Transmisión: '7DCT / 8AT', Tracción: '4x2 / XWD', Combustible: 'Bencina', Pasajeros: '5' },
    features: ['6 airbags', 'Freno electrónico con AutoHold', 'Monitor presión neumáticos', 'Diseño adventure', 'Interior tecnológico', 'Equipamiento según versión'],
    gallery: gallery([IMG.t1, IMG.t1Secondary], 'T1', 'adventure'),
    versions: [
      v({ code: 'BT101', name: '1.5T 7DCT LUXURY', price: 22990000, motor: '1.5T', hp: 167, transmission: '7DCT', traction: '4x2', quoteImages: [IMG.t1Gray, IMG.t1Secondary], features: ['6 airbags', '3 modos de conducción', 'Freno electrónico con AutoHold', 'Monitor presión de neumáticos', 'Neumáticos 235/65 R18', 'Distancia entre ejes 2.800 mm'], source: 'https://jetourchile.cl/w/t1' }),
      v({ code: 'BT102', name: '2.0T 8AT XWD LIMITED', price: 26990000, motor: '2.0T', hp: 241, transmission: '8AT', traction: 'XWD', quoteImages: [IMG.t1Blue, IMG.t1], features: ['Sistema de seguridad ADAS', 'Control crucero adaptativo', 'Frenado de emergencia AEB', 'Monitoreo punto ciego', 'Cámara 360° + chasis 180°', 'Asientos eléctricos ventilados y calefaccionados'], source: 'https://jetourchile.cl/w/t1' })
    ]
  },
  {
    slug: 't2', name: 'T2', type: 'SUV off road premium', tag: 'Premium', img: IMG.t2,
    quoteImages: [IMG.t2, IMG.t2Secondary], imageMode: 'cutout', accent: '#8b6a38', price: 29990000,
    desc: 'Presencia todoterreno, potencia y diseño premium.',
    specs: { Motor: '2.0T GDI', Potencia: '241 HP', Transmisión: '7DCT', Tracción: 'AWD', Combustible: 'Bencina', Pasajeros: '5' },
    features: ['AWD inteligente', 'ADAS', 'Cámara 360° + chasis 180°', 'Pantalla 15,6”', 'Sunroof panorámico', 'Llantas 20”'],
    gallery: gallery([IMG.t2, IMG.t2Secondary], 'T2', 'off road'),
    versions: [
      v({ code: 'BT201', name: '2.0T GDI AWD 7DCT LIMITED', price: 29990000, motor: '2.0T GDI', hp: 241, transmission: '7DCT', traction: 'AWD', quoteImages: [IMG.t2Secondary, IMG.t2], features: ['Tracción inteligente AWD', 'Sistema de seguridad ADAS', 'Cámara 360° + chasis transparente 180°', 'Pantalla 15,6” con CarPlay/Android Auto', 'Climatizador dual', 'Sunroof panorámico'], source: 'https://jetourchile.cl/w/t2' })
    ]
  },
  {
    slug: 't1-phev', name: 'T1 PHEV', type: 'SUV híbrido enchufable', tag: 'PHEV', img: IMG.t1Phev,
    quoteImages: [IMG.t1Phev], imageMode: 'cutout', accent: '#477a68', price: 29990000,
    desc: 'Tecnología híbrida enchufable con diseño adventure.',
    specs: { Motor: '1.5T PHEV', Potencia: '341 HP combinados', Transmisión: 'Híbrida', Tracción: '4x2', Combustible: 'PHEV', Pasajeros: '5' },
    features: ['6 airbags', 'ADAS', 'Control crucero adaptativo', 'Cámara 540°', 'Pantalla 15,6” inalámbrica', 'Autonomía combinada +1.000 km'],
    gallery: gallery([IMG.t1Phev], 'T1 PHEV', 'híbrido'),
    versions: [
      v({ code: 'PT101', name: '1.5T PHEV LIMITED', price: 29990000, motor: '1.5T PHEV', hp: 341, transmission: 'DHT', quoteImages: [IMG.t1PhevGreen, IMG.t1Phev], features: ['6 airbags', 'Sistema de seguridad ADAS', 'Control crucero adaptativo', 'Cámara 540°', 'Asistente mantenimiento de carril', 'Autonomía combinada +1.000 km'], source: 'https://jetourchile.cl/w/t1-phev' })
    ]
  },
  {
    slug: 't2-phev', name: 'T2 PHEV', type: 'SUV híbrido enchufable', tag: 'PHEV', img: IMG.t2Phev,
    quoteImages: [IMG.t2Phev, IMG.t2PhevSecondary], imageMode: 'cutout', accent: '#477a68', price: 36990000,
    desc: 'Potencia híbrida enchufable y diseño todoterreno.',
    specs: { Motor: '1.5T PHEV', Potencia: '375 HP combinados', Transmisión: 'Híbrida', Tracción: '4x2', Combustible: 'PHEV', Pasajeros: '5' },
    features: ['6 airbags', 'ADAS', 'Control crucero adaptativo', 'Cámara 540°', 'Pantalla 15,6” inalámbrica', 'Autonomía hasta 1.000 km'],
    gallery: gallery([IMG.t2Phev, IMG.t2PhevSecondary], 'T2 PHEV', 'híbrido'),
    versions: [
      v({ code: 'PT201', name: '1.5T PHEV LIMITED', price: 36990000, motor: '1.5T PHEV', hp: 375, transmission: 'DHT', quoteImages: [IMG.t2PhevSecondary, IMG.t2Phev], features: ['6 airbags', 'Sistema de seguridad ADAS', 'Control crucero adaptativo', 'Cámara 540°', 'Asistente mantenimiento de carril', 'Autonomía hasta 1.000 km'], source: 'https://jetourchile.cl/w/t2-phev' })
    ]
  }
]
