import { Router } from 'express';
import db from '../database/connections.js';
import { adminCheck } from '../middelware/authMiddelware.js';

const router = Router();

router.get('/api/orders/:round', adminCheck, async (req, res) => {
  const round = req.params?.round;

  try {
    const existingOrders = await db.collection('orders').find({ round, orderedItems: { $exists: true } }).toArray();

    if (existingOrders.length > 0) {
      const counts = await db.collection('orders').aggregate([
        {
          $unwind: '$orderedItems',
        },
        {
          $group: {
            _id: '$orderedItems._id',
            count: {
              $sum: '$orderedItems.quantity',
            },
          },
        },
      ]).toArray();

      const result = existingOrders[0].orderedItems.map((product) => {
        const foundItem = counts.find((item) => item._id === product._id);
        product.quantity = foundItem ? foundItem.count : 0;
        return product;
      });

      res.status(200).send({ data: result });
    } else {
      const existingProducts = await db.collection('products').find({ round }).toArray();
      res.status(200).send({ data: existingProducts, message: 'No orders' });
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});

router.get('/api/orders/:round/users', adminCheck, async (req, res) => {
  const round = req.params?.round;

  try {
    const activeOrInactiveRounds = await db.collection('orders').find({ round, isOpen: { $exists: true } }).sort({ staffNumber: 1 }).toArray();
    if (activeOrInactiveRounds.length > 0) {
      const orders = await db.collection('orders').find({ round, orderedItems: { $exists: true } }).sort({ staffNumber: 1 }).toArray();
      const users = orders.map((order) => ({
        staffNumber: order.staffNumber,
        name: order.name,
      }));
      res.status(200).send({ data: users });
    } else {
      res.status(400).send({ data: 'Not found' });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/api/orders/status/:round', async (req, res) => {
  const round = req.params?.round;

  try {
    const statusOrder = await db.collection('orders').find({ round, isOpen: { $exists: true } }).toArray();

    if (statusOrder[0]) {
      res.status(200).send({ data: statusOrder[0].isOpen });
    } else {
      res.status(400).send({ data: 'Something went wrong in the database' });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/api/orders/:round/:staffNumber', async (req, res) => {
  const round = req.params?.round;
  let staffNumber = req.params?.staffNumber;

  if (req.session.user.role !== 'ADMIN') {
    staffNumber = req.session.user.uid;
  }

  try {
    const existingOrder = await db.collection('orders').find({ round, staffNumber }).toArray();

    if (existingOrder[0]) {
      res.status(200).send({ data: existingOrder[0].orderedItems });
    } else {
      res.status(400).send({ data: 'Not order found' });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/api/orders', async (req, res) => {
  const staffNumber = req.session.user?.uid;
  const { round } = req.body;
  const existingOrder = await db.collection('orders').findOne({ staffNumber, round });
  try {
    if (!existingOrder) {
      const user = await db.collection('users').findOne({ staffNumber });
      req.body.name = user.name;
      await db.collection('orders').insertOne(req.body);
    } else {
      const newData = req.body;
      await db.collection('orders').updateOne(
        { staffNumber, round },
        { $set: newData },
      );
    }
    res.status(200).send({ data: 'Order made' });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).send({ data: 'Something went wrong in the database' });
  }
});

router.delete('/api/orders', adminCheck, async (req, res) => {
  const { staffNumber } = req.body;

  try {
    const openOrders = await db.collection('orders').find({ isOpen: true }).toArray();

    openOrders.forEach(async (order) => {
      await db.collection('orders').deleteOne({ staffNumber, round: order.round });
    });
  } catch (error) {
    console.log(error);
  }
});

router.put('/api/orders/:round', adminCheck, async (req, res) => {
  const round = req.params?.round;
  const { isOpen } = req.body;

  try {
    await db.collection('orders').updateOne({ round, isOpen: { $exists: true } }, { $set: { isOpen } });
    res.status(200).send({ data: 'updated status' });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).send({ data: 'failed to update status' });
  }
});

export default router;
