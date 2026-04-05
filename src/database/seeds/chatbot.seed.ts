import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { City } from '../../cities/entities/city.entity';
import { PaymentMethod } from '../../payment-metods/entities/payment-metod.entity';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

interface CityData {
  city: string;
  variations: string;
  cashOnDelivery: boolean;
  template: string;
  image: string;
}

interface PaymentMethodData {
  method: string;
  variations: string;
  template: string;
  image: string;
}

const cities: CityData[] = [
  {
    city: 'la paz',
    variations: 'lp,lpz,paz,lapaz,pax,lapax',
    cashOnDelivery: true,
    template: `En La Paz, hacemos entregas a domicilio u oficinas *sin costo adicional*!
  Cubrimos las siguientes zonas:
  
  ✅ Zona Central (Sopocachi, Miraflores, Centro)
  ✅ Zona Norte (Av. Buenos Aires, Cementerio, Vita)
  ✅ Zona Sur (Calacoto, Irpavi, Achumani, Obrajes, Alto Obrajes, Seguencoma)
  ✅ Cruce de Villas, Villa Fátima
  ✅ Puntos de encuentro (Teleféricos, Correos, San Francisco)
  
  Las entregas las hacemos de 9:00 a 18:30hrs, con un mínimo de 30 minutos de antelación 🚛🇧🇴
  
  *¿En qué horario podría recibir su pedido y en que dirección?* 😄
  
  _Si su dirección no se encuentra en la lista, podemos coordinar el punto más cercano_ 👍`,
    image:
      'https://www.opinion.com.bo/asset/thumbnail,992,558,center,center/media/opinion/images/2014/07/16/2014N133212.jpg',
  },
  {
    city: 'el alto',
    variations: 'alto,ea,delalto,elalto',
    cashOnDelivery: true,
    template: `En El Alto, hacemos entregas en estaciones de *Teleférico*:

  🟣 Línea Morada: 6 de Marzo (cuartel ingavi)
  🟣 Línea Morada: Faro Murillo
  🟡 Línea Amarilla: Ciudad Satélite
  🔴 Línea Roja: 16 de Julio
  🎯 Punto de encuentro Ceja (Ceibo)
  
  _¿En qué *horario* podría recibir su pedido y en que *punto*?_ 😄
  
  *Las entregas las hacemos de 9:00 a 18:30hrs, con un mínimo de 30 minutos de antelación.* 🚛🇧🇴`,
    image:
      'https://www.elaltoesnoticia.com/wp-content/uploads/2016/02/bandera-de-El-Alto-300x217.jpg',
  },
  {
    city: 'tarija',
    variations: 'tarija,trj,tja',
    cashOnDelivery: false,
    template: `_Nosotros estamos en La Paz!_
  A *Tarija* hacemos envíos hasta la puerta de su casa en *48-72 hrs días habiles* 🏡
  *Trabajamos con una empresa de envíos a nivel nacional*
  
  Para obtener su producto, tenemos estas 2 opciones:
  
  1️⃣ Cancela el producto *el momento* que le llegue a su domicilio o dirección (costo del envío 20bs)
  
  2️⃣ Cancela el producto *Previamente* por depósito o transferencia bancaria y le llega a su domicilio o dirección indicada ( *Envío Gratuito* )
  
  *¿Cuál le conviene?*😊😊
  
  _Todos los productos los probamos antes de enviarlos, en caso de desperfectos se procede al cambio inmediato sin costo_ `,
    image:
      'https://www.novex.com.bo/wp-content/uploads/2023/11/tarija-scaled.jpeg',
  },
  {
    city: 'santa cruz',
    variations: 'scz,sc,cruz,santa,stcruz,santacruz,sta,stc',
    cashOnDelivery: true,
    template: `_Nosotros estamos en La Paz!_
  A *Santa Cruz* hacemos envíos hasta la puerta de su casa en *24 a 48hrs en dias habiles* 🏡
  *Trabajamos con una empresa de envíos a nivel nacional*
  
  Para obtener su producto, tenemos estas 2 opciones:
  
  1️⃣ Cancela el producto *el momento* que le llegue a su domicilio o dirección (costo del envío 20bs)
  
  2️⃣ Cancela el producto *Previamente* por depósito o transferencia bancaria y le llega a su domicilio o dirección indica ( *Envío Gratuito* )
  
  *¿Cuál le conviene?*😊😊
  
  _Todos los productos los probamos antes de enviarlos, en caso de desperfectos se procede al cambio inmediato sin costo_`,
    image:
      'https://www.novex.com.bo/wp-content/uploads/2023/11/santacruz-scaled.jpeg',
  },
  {
    city: 'oruro',
    variations: 'oruro,oru',
    cashOnDelivery: false,
    template: `_Nosotros estamos en La Paz!_
  A *Oruro* hacemos envíos hasta la puerta de su casa en *24-48 hrs días habiles* 🏡
  *Trabajamos con una empresa de envíos a nivel nacional*
  
  Para obtener su producto, tenemos estas 2 opciones:
  
  1️⃣ Cancela el producto *el momento* que le llegue a su domicilio o dirección (costo del envío 20bs)
  
  2️⃣ Cancela el producto *Previamente* por depósito o transferencia bancaria y le llega a su domicilio o dirección indicada ( *Envío Gratuito* )
  
  *¿Cuál le conviene?*😊😊
  
  _Todos los productos los probamos antes de enviarlos, en caso de desperfectos se procede al cambio inmediato sin costo_ `,
    image:
      'https://www.novex.com.bo/wp-content/uploads/2023/11/oruro-scaled.jpeg',
  },
  {
    city: 'potosi',
    variations: 'potosí,potosi,pts,pti',
    cashOnDelivery: false,
    template: `_Nosotros estamos en La Paz!_
  A *Potosi* hacemos envíos hasta la puerta de su casa en *24-48 hrs días habiles* 🏡
  *Trabajamos con una empresa de envíos a nivel nacional*
  
  Para obtener su producto, tenemos estas 2 opciones:
  
  1️⃣ Cancela el producto *el momento* que le llegue a su domicilio o dirección (costo del envío 20bs)
  
  2️⃣ Cancela el producto *Previamente* por depósito o transferencia bancaria y le llega a su domicilio o dirección indicada ( *Envío Gratuito* )
  
  *¿Cuál le conviene?*😊😊
  
  _Todos los productos los probamos antes de enviarlos, en caso de desperfectos se procede al cambio inmediato sin costo_ `,
    image: 'https://www.novex.com.bo/wp-content/uploads/2023/11/potosi.jpeg',
  },
  {
    city: 'sucre',
    variations: 'sucre,chuquisaca,scr,chuqui',
    cashOnDelivery: false,
    template: `_Nosotros estamos en La Paz!_
  A *Sucre* hacemos envíos hasta la puerta de su casa en *48-72 hrs días habiles* 🏡
  *Trabajamos con una empresa de envíos a nivel nacional*
  
  Para obtener su producto, tenemos estas 2 opciones:
  
  1️⃣ Cancela el producto *el momento* que le llegue a su domicilio o dirección (costo del envío 20bs)
  
  2️⃣ Cancela el producto *Previamente* por depósito o transferencia bancaria y le llega a su domicilio o dirección indicada ( *Envío Gratuito* )
  
  *¿Cuál le conviene?*😊😊
  
  _Todos los productos los probamos antes de enviarlos, en caso de desperfectos se procede al cambio inmediato sin costo_ `,
    image: 'https://www.novex.com.bo/wp-content/uploads/2023/11/sucre.jpeg',
  },
  {
    city: 'cochabamba',
    variations: 'cocha,cochabamba,cbb,cbba',
    cashOnDelivery: true,
    template: `_Nosotros estamos en La Paz!_
  A *Cochabamba* hacemos envíos hasta la puerta de su casa en *24 a 48 hrs en dias habiles* 🏡
  *Trabajamos con una empresa de envíos a nivel nacional*
  
  Para obtener su producto, tenemos estas 2 opciones:
  
  1️⃣ Cancela el producto *el momento* que le llegue a su domicilio o dirección (costo del envío 20bs)
  
  2️⃣ Cancela el producto *Previamente* por depósito o transferencia bancaria y le llega a su domicilio o dirección indica ( *Envío Gratuito* 
  
  
  *¿Cuál le conviene?*😊😊
  
  _Todos los productos los probamos antes de enviarlos, en caso de desperfectos se procede al cambio inmediato sin costo_ `,
    image:
      'https://www.novex.com.bo/wp-content/uploads/2023/11/cbba-scaled.jpeg',
  },
  {
    city: 'villazon',
    variations: 'villazon,villazón',
    cashOnDelivery: false,
    template: `Nosotros estamos en La Paz!
  A  *Villazón* hacemos envíos mediante flota 🔊
  
  Para obtener su producto, tenemos esta opción:
  
  1️⃣ Cancela el producto previamente por depósito o transferencia bancaria  (costo del envío 10bs)
  
  Todos los productos los probamos antes de enviarlos`,
    image: 'https://www.novex.com.bo/wp-content/uploads/2023/11/villazon.jpeg',
  },
  {
    city: 'trinidad',
    variations: 'trinidad',
    cashOnDelivery: false,
    template: `Nosotros estamos en La Paz!
  A  *Trinidad* hacemos envíos mediante Ecojet🔊
  
  Para obtener su producto, tenemos esta opción:
  
  1️⃣ Cancela el producto previamente por depósito o transferencia bancaria  (costo del envío 10bs)
  
  Todos los productos los probamos antes de enviarlos`,
    image: 'https://www.novex.com.bo/wp-content/uploads/2023/11/trinidad.jpeg',
  },
  {
    city: 'montero',
    variations: 'montero',
    cashOnDelivery: false,
    template: `Nosotros estamos en La Paz!
  A _*Montero*_ hacemos envíos mediante flota 🔊
  
  Para obtener su producto, tenemos esta opción:
  
  1️⃣ Cancela el producto previamente por depósito o transferencia bancaria  (costo del envío 10bs)
  
  Todos los productos los probamos antes de enviarlos`,
    image: 'https://www.novex.com.bo/wp-content/uploads/2023/11/montero.jpeg',
  },
  {
    city: 'yacuiba',
    variations: 'yacuiba',
    cashOnDelivery: false,
    template: `Nosotros estamos en La Paz!
  A _*Yacuiba*_ hacemos envíos mediante flota 🔊
  
  Para obtener su producto, tenemos esta opción:
  
  1️⃣ Cancela el producto previamente por depósito o transferencia bancaria  (costo del envío 10bs)
  
  Todos los productos los probamos antes de enviarlos`,
    image: 'https://www.novex.com.bo/wp-content/uploads/2023/11/yacuiba.jpeg',
  },
  {
    city: 'tupiza',
    variations: 'tupiza',
    cashOnDelivery: false,
    template: `Nosotros estamos en La Paz!
  A *Tupiza* hacemos envíos mediante flota 🔊
  
  Para obtener su producto, tenemos esta opción:
  
  1️⃣ Cancela el producto previamente por depósito o transferencia bancaria  (costo del envío 10bs)
  
  Todos los productos los probamos antes de enviarlos`,
    image: 'https://www.novex.com.bo/wp-content/uploads/2023/11/tupiza.jpeg',
  },
  {
    city: 'uyuni',
    variations: 'uyuni',
    cashOnDelivery: false,
    template: `Nosotros estamos en La Paz!
  A _Uyuni_ hacemos envíos mediante flota 🔊
  
  Para obtener su producto, tenemos esta opción:
  
  1️⃣ Cancela el producto previamente por depósito o transferencia bancaria  (costo del envío 10bs)
  
  Todos los productos los probamos antes de enviarlos`,
    image: 'https://www.novex.com.bo/wp-content/uploads/2023/11/uyuni.jpeg',
  },
];

const paymentMethods: PaymentMethodData[] = [
  {
    method: 'contraentrega',
    variations: '1,opcion1,metodo1,contraentrega',
    template: `Para confirmar su pedido y realizar el envío a su ciudad, nosotros necesitamos sus datos que irán en el paquete. 📦
  *Nombre*
  *Celular*
  *Dirección*
  *Número de casa o edificio*
  *Ubicación GPS/Google Maps*
  
  También nos ayudaría mucho que nos indique alguna referencia de su dirección (por ejemplo alguna tienda o colegio cercano) 😁 👍`,
    image:
      'https://media.istockphoto.com/id/927427140/es/vector/recibe-paquete-de-mensajer%C3%ADa-al-cliente-concepto-de-entrega.jpg?s=612x612&w=0&k=20&c=ShRo8iEOvM4xcIU0pLjAxA8WoHaqaO6_Ry45uZL8wfw=',
  },
  {
    method: 'pagoqr',
    variations: '2,opcion2,metodo2,qr',
    template: `Aca le comparto nuestros métodos de pago, no olvide enviarnos su comprobante para realizar el envío correspondiente 👍
  *Recuerde que el método de pago Tigo Money cuenta con comisión adicional*`,
    image: 'https://www.novex.com.bo/wp-content/uploads/2023/12/pagoQR.jpeg',
  },
];

async function seedChatbot() {
  if (process.env.NODE_ENV !== 'development') {
    console.log('⛔ Chatbot seeder only runs in development mode');
    process.exit(0);
  }

  console.warn('⚠️ WARNING: Running chatbot seeder in development mode');
  console.warn('⚠️ This will clear and reseed cities and payment methods');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const cityRepository = AppDataSource.getRepository(City);
    const paymentMethodRepository = AppDataSource.getRepository(PaymentMethod);

    // Clear existing data
    await cityRepository.delete({});
    await paymentMethodRepository.delete({});
    console.log('✅ Existing data cleared');

    // Insert cities
    for (const cityData of cities) {
      const city = cityRepository.create(cityData);
      await cityRepository.save(city);
    }
    console.log(`✅ Inserted ${cities.length} cities`);

    // Insert payment methods
    for (const paymentData of paymentMethods) {
      const paymentMethod = paymentMethodRepository.create(paymentData);
      await paymentMethodRepository.save(paymentMethod);
    }
    console.log(`✅ Inserted ${paymentMethods.length} payment methods`);

    console.log('✅ Chatbot seed completed successfully');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

seedChatbot();
