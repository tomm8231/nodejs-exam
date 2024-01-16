import db from './connections.js';

await db.createCollection('products');

await db.createCollection('users')


// await db.collection('orders').insertOne({
//   round: 's2s_oct_24',
//   isOpen: true,
//   softDeadline: '24-01-01',
// });

// await db.collection('orders').insertOne({
//   round: 'fjallraven_feb_24',
//   isOpen: true,
//   softDeadline: '31-01-01',
// });
