export const IMG = {
  hero: 'https://jetourchile.cl/documents/7190100/13275002/X70%2BPlus-Card.webp/c67533fd-ba78-f7d2-53f1-1ce64266c1ce?t=1771255199333',
  x50: 'https://jetourchile.cl/documents/7190100/11940205/X50-Card.webp/97c09178-de06-3240-8213-f5cc446a8a80?t=1755889826966',
  x70: 'https://jetourchile.cl/documents/7190100/13275002/X70%2BPlus-Card.webp/c67533fd-ba78-f7d2-53f1-1ce64266c1ce?t=1771255199333',
  dashing: 'https://jetourchile.cl/documents/7190100/11482279/JETOUR-DASHING%2B%281%29.webp/5aa70ec2-c36a-d479-b2f8-966ac95baa0a?t=1749740112196',
  t1: 'https://jetourchile.cl/documents/7190100/11948154/T1-Card.webp/75f3de9f-ea3e-fd4f-4a42-05e7ae5075d2?t=1756147956003',
  t2: 'https://jetourchile.cl/documents/7190100/11482279/JETOUR-T2%2B%281%29.webp/4f82898e-08d3-459b-8f48-52afb68a6486?t=1749740111919',
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
  { title: 'Atención directa', text: 'Cotización personalizada por WhatsApp con Cris.', icon: '☎' },
  { title: 'Sucursal Bilbao', text: 'Av. Francisco Bilbao, Providencia, Santiago.', icon: '⌖' }
]

export const modelData = [
  { slug:'x50', name:'X50', type:'SUV compacto', tag:'Ciudad', img:IMG.x50, gallery:gallery(IMG.x50,'X50','urbano'), price:12490000, desc:'Compacto, ágil y eficiente. Ideal para ciudad, trabajo diario y primeras escapadas de fin de semana.', specs:{Motor:'1.5L / 1.5T', Potencia:'145 HP', Transmisión:'MT / 6DCT según versión', Tracción:'4x2', Combustible:'Bencina', Pasajeros:'5', Uso:'Ciudad y uso diario'}, features:['Pantalla multimedia','Conectividad smartphone','Cámara y sensores según versión','Diseño juvenil','Excelente relación precio/equipamiento'], versions:[{code:'BX501',name:'1.5L MT LUX',price:12490000,motor:'1.5L',hp:145},{code:'BX503',name:'1.5L MT LUX BICOLOR',price:12790000,motor:'1.5L',hp:145},{code:'BX502',name:'1.5T 6DCT TURBO LUX',price:15490000,motor:'1.5T',hp:145},{code:'BX504',name:'1.5T 6DCT TURBO LUX BICOLOR',price:15790000,motor:'1.5T',hp:145}] },
  { slug:'dashing', name:'Dashing', type:'SUV deportivo', tag:'Diseño', img:IMG.dashing, gallery:gallery(IMG.dashing,'Dashing','deportivo'), price:16490000, desc:'Diseño deportivo y tecnológico para quienes buscan un SUV con presencia, estilo y gran impacto visual.', specs:{Motor:'1.5T / 1.6T GDI', Potencia:'145 a 188 HP', Transmisión:'6MT / 6DCT / 7DCT', Tracción:'4x2', Combustible:'Bencina', Pasajeros:'5', Uso:'Diseño, tecnología y ciudad'}, features:['Diseño deportivo','Interior tecnológico','Versiones Turbo','ADAS según versión','Gran presencia visual'], versions:[{code:'BD01',name:'6MT 1.5L Turbo Special Edition FL',price:16490000,motor:'1.5T',hp:145},{code:'BD02',name:'1.5L 6MT Turbo Lux FL',price:17490000,motor:'1.5T',hp:145},{code:'BD03',name:'6DCT 1.5L Turbo Special Edition FL',price:18490000,motor:'1.5T',hp:145},{code:'BD04',name:'6DCT 1.5L Turbo Lux',price:19490000,motor:'1.5T',hp:145},{code:'BD05',name:'7DCT 1.6L Turbo GDI Limited',price:21990000,motor:'1.6T GDI',hp:188}] },
  { slug:'x70-plus', name:'X70 Plus', type:'SUV familiar', tag:'Familia', img:IMG.x70, gallery:gallery(IMG.x70,'X70 Plus','familiar'), price:20990000, desc:'Espacio, confort y seguridad para la familia. Pensado para viajes, uso diario y máxima comodidad.', specs:{Motor:'1.5T / 1.6T GDI', Potencia:'145 a 188 HP', Transmisión:'6DCT / 7DCT', Tracción:'4x2', Combustible:'Bencina', Pasajeros:'5 a 7 según versión', Uso:'Familia y viajes'}, features:['Gran espacio interior','Confort familiar','Pantalla multimedia','Motor turbo','Versiones de mayor equipamiento'], versions:[{code:'BX705',name:'1.5T 6DCT FL',price:20990000,motor:'1.5T',hp:145},{code:'BX706',name:'1.6T GDI 7DCT LUX FL',price:22490000,motor:'1.6T GDI',hp:188}] },
  { slug:'t1', name:'T1', type:'SUV adventure', tag:'Adventure', img:IMG.t1, gallery:gallery(IMG.t1,'T1','adventure'), price:22990000, desc:'Robusto, versátil y con personalidad outdoor para quienes quieren un SUV diferente.', specs:{Motor:'1.5T / 2.0T', Potencia:'167 a 241 HP', Transmisión:'7DCT / 8AT', Tracción:'4x2 / XWD según versión', Combustible:'Bencina', Pasajeros:'5', Uso:'Aventura y ruta'}, features:['Estilo adventure','Opciones 2.0T XWD','Diseño robusto','Interior tecnológico','Alta presencia en ruta'], versions:[{code:'BT101',name:'1.5T 7DCT LUXURY',price:22990000,motor:'1.5T',hp:167},{code:'BT103',name:'1.5T 7DCT LUXURY MATE',price:23490000,motor:'1.5T',hp:167},{code:'BT102',name:'2.0T 8AT XWD LIMITED',price:26990000,motor:'2.0T',hp:241},{code:'BT104',name:'2.0T 8AT XWD LIMITED MATE',price:27490000,motor:'2.0T',hp:241}] },
  { slug:'t2', name:'T2', type:'SUV off road premium', tag:'Premium', img:IMG.t2, gallery:gallery(IMG.t2,'T2','off road'), price:29990000, desc:'Presencia todoterreno, motor potente y diseño premium para destacar dentro y fuera de la ciudad.', specs:{Motor:'2.0T GDI', Potencia:'241 HP', Transmisión:'7DCT', Tracción:'AWD', Combustible:'Bencina', Pasajeros:'5', Uso:'Off road premium y ruta'}, features:['Diseño off road premium','AWD','Motor 2.0T GDI','Interior tecnológico','Alta presencia y seguridad'], versions:[{code:'BT201',name:'2.0T GDI AWD 7DCT LIMITED',price:29990000,motor:'2.0T GDI',hp:241},{code:'BT202',name:'2.0T GDI AWD 7DCT LIMITED MATE',price:30490000,motor:'2.0T GDI',hp:241}] }
]
