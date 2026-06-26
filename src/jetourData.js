export const IMG = {
  hero: 'https://jetourchile.cl/documents/7190100/11482279/JETOUR-T2%2B%281%29.webp/4f82898e-08d3-459b-8f48-52afb68a6486?t=1749740111919',
  x50: 'https://jetourchile.cl/documents/7190100/11940205/X50-Card.webp/97c09178-de06-3240-8213-f5cc446a8a80?t=1755889826966',
  x70: 'https://jetourchile.cl/documents/7190100/13275002/X70%2BPlus-Card.webp/c67533fd-ba78-f7d2-53f1-1ce64266c1ce?t=1771255199333',
  dashing: 'https://jetourchile.cl/documents/7190100/11482279/JETOUR-DASHING%2B%281%29.webp/5aa70ec2-c36a-d479-b2f8-966ac95baa0a?t=1749740112196',
  t1: 'https://jetourchile.cl/documents/7190100/11948154/T1-Card.webp/75f3de9f-ea3e-fd4f-4a42-05e7ae5075d2?t=1756147956003',
  t2: 'https://jetourchile.cl/documents/7190100/11482279/JETOUR-T2%2B%281%29.webp/4f82898e-08d3-459b-8f48-52afb68a6486?t=1749740111919'
}

const gallery = (img, name) => [
  { img, title: `${name} exterior principal` },
  { img, title: `${name} vista frontal` },
  { img, title: `${name} detalle de diseño` }
]

export const benefits = [
  { title: 'Diseño', text: 'Diseño internacional con líneas modernas.', icon: '☆' },
  { title: 'Tecnología', text: 'Pantallas panorámicas, Apple CarPlay, Android Auto, cámaras 360° y ADAS.', icon: '▣' },
  { title: 'Seguridad', text: 'Airbags, ESP, asistencias a la conducción y estructura reforzada.', icon: '◇' },
  { title: 'Garantía', text: 'Respaldo oficial y atención directa en Guillermo Morales Bilbao.', icon: '✺' }
]

export const modelData = [
  { slug:'x50', name:'X50', type:'SUV Urbano', tag:'Ciudad', img:IMG.x50, gallery:gallery(IMG.x50,'X50'), price:12490000, desc:'SUV urbano moderno, eficiente y muy equipado para el uso diario en ciudad.', specs:{motor:'1.5L / 1.5T', potencia:'145 HP', transmision:'MT / 6DCT según versión', traccion:'4x2', combustible:'Bencina', pasajeros:'5', uso:'Ciudad y uso diario'}, features:['Pantalla multimedia','Conectividad smartphone','Cámara y sensores según versión','Diseño juvenil','Excelente relación precio/equipamiento'], versions:[{code:'BX501',name:'1.5L MT LUX',price:12490000,motor:'1.5L',hp:145},{code:'BX503',name:'1.5L MT LUX BICOLOR',price:12790000,motor:'1.5L',hp:145},{code:'BX502',name:'1.5T 6DCT TURBO LUX',price:15490000,motor:'1.5T',hp:145},{code:'BX504',name:'1.5T 6DCT TURBO LUX BICOLOR',price:15790000,motor:'1.5T',hp:145}] },
  { slug:'dashing', name:'DASHING', type:'SUV Deportivo', tag:'Diseño', img:IMG.dashing, gallery:gallery(IMG.dashing,'Dashing'), price:16490000, desc:'SUV de diseño futurista, líneas deportivas y alto impacto visual.', specs:{motor:'1.5T / 1.6T GDI', potencia:'145 a 188 HP', transmision:'6MT / 6DCT / 7DCT', traccion:'4x2', combustible:'Bencina', pasajeros:'5', uso:'Diseño, tecnología y ciudad'}, features:['Diseño deportivo','Interior tecnológico','Versiones Turbo','ADAS según versión','Gran presencia visual'], versions:[{code:'BD01',name:'6MT 1.5L Turbo Special Edition FL',price:16490000,motor:'1.5T',hp:145},{code:'BD02',name:'1.5L 6MT Turbo Lux FL',price:17490000,motor:'1.5T',hp:145},{code:'BD03',name:'6DCT 1.5L Turbo Special Edition FL',price:18490000,motor:'1.5T',hp:145},{code:'BD04',name:'6DCT 1.5L Turbo Lux',price:19490000,motor:'1.5T',hp:145},{code:'BD05',name:'7DCT 1.6L Turbo GDI Limited',price:21990000,motor:'1.6T GDI',hp:188}] },
  { slug:'x70-plus', name:'X70 PLUS', type:'SUV Familiar', tag:'Familia', img:IMG.x70, gallery:gallery(IMG.x70,'X70 Plus'), price:20990000, desc:'SUV familiar amplio, cómodo y pensado para viajar con más espacio y seguridad.', specs:{motor:'1.5T / 1.6T GDI', potencia:'145 a 188 HP', transmision:'6DCT / 7DCT', traccion:'4x2', combustible:'Bencina', pasajeros:'5 a 7 según versión', uso:'Familia y viajes'}, features:['Gran espacio interior','Confort familiar','Pantalla multimedia','Motor turbo','Versiones de mayor equipamiento'], versions:[{code:'BX705',name:'1.5T 6DCT FL',price:20990000,motor:'1.5T',hp:145},{code:'BX706',name:'1.6T GDI 7DCT LUX FL',price:22490000,motor:'1.6T GDI',hp:188}] },
  { slug:'t1', name:'T1', type:'SUV Adventure', tag:'Adventure', img:IMG.t1, gallery:gallery(IMG.t1,'T1'), price:22990000, desc:'SUV robusto, versátil y preparado para quienes buscan una imagen outdoor.', specs:{motor:'1.5T / 2.0T', potencia:'167 a 241 HP', transmision:'7DCT / 8AT', traccion:'4x2 / XWD según versión', combustible:'Bencina', pasajeros:'5', uso:'Aventura y ruta'}, features:['Estilo adventure','Opciones 2.0T XWD','Diseño robusto','Interior tecnológico','Alta presencia en ruta'], versions:[{code:'BT101',name:'1.5T 7DCT LUXURY',price:22990000,motor:'1.5T',hp:167},{code:'BT103',name:'1.5T 7DCT LUXURY MATE',price:23490000,motor:'1.5T',hp:167},{code:'BT102',name:'2.0T 8AT XWD LIMITED',price:26990000,motor:'2.0T',hp:241},{code:'BT104',name:'2.0T 8AT XWD LIMITED MATE',price:27490000,motor:'2.0T',hp:241}] },
  { slug:'t2', name:'T2', type:'SUV Off Road Premium', tag:'Premium', img:IMG.t2, gallery:gallery(IMG.t2,'T2'), price:29990000, desc:'SUV de presencia todoterreno, motor potente y diseño premium para destacar.', specs:{motor:'2.0T GDI', potencia:'241 HP', transmision:'7DCT', traccion:'AWD', combustible:'Bencina', pasajeros:'5', uso:'Off road premium y ruta'}, features:['Diseño off road premium','AWD','Motor 2.0T GDI','Interior tecnológico','Alta presencia y seguridad'], versions:[{code:'BT201',name:'2.0T GDI AWD 7DCT LIMITED',price:29990000,motor:'2.0T GDI',hp:241},{code:'BT202',name:'2.0T GDI AWD 7DCT LIMITED MATE',price:30490000,motor:'2.0T GDI',hp:241}] }
]
