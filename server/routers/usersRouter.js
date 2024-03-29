import { Router } from 'express';
import db from '../database/connections.js';
import { adminCheck } from '../middelware/authMiddelware.js';
import { hashPassword, comparePassword, randomPassword } from '../encrypt/encryption.js';
import { sendMail } from '../nodemailer/sendEmail.js';

const router = Router();

const userCollection = db.collection('users');

router.get('/api/users', adminCheck, async (req, res) => {
  const response = await userCollection.find({ role: 'USER' }).sort({staffNumber: 1}).toArray();

  res.status(200).send({ data: response });
});

router.get('/api/users/:staffNumber', async (req, res) => {
  const staffNumber = req.session.user.uid;

  const response = await userCollection.findOne({ staffNumber });
  res.status(200).send({ data: response });
});

router.delete('/api/users/:staffNumber', adminCheck, async (req, res) => {
  const { staffNumber } = req.params;

  const response = await userCollection.deleteOne({ staffNumber });
  res.status(200).send({ data: response });
});

router.put('/api/users/password', async (req, res) => {
  const { oldPassWord, newPassWord } = req.body;
  const staffNumber = req.session.user.uid;

  const user = await userCollection.findOne({ staffNumber });

  const match = await comparePassword(oldPassWord, user.hashedPassword);

  if (match) {
    const hashedPassWord = await hashPassword(newPassWord);
    await userCollection.updateOne({ staffNumber }, { $set: { hashedPassword: hashedPassWord } });
    res.status(200).send({ data: 'Password updated' });
  } else {
    res.status(401).send({ data: 'Passwords does not match' });
  }
});

router.put('/api/users/resetpassword', adminCheck, async (req, res) => {
  try {
    const { staffNumber } = req.body;
    const newRandomPassword = await randomPassword();
    const hashedPassword = await hashPassword(newRandomPassword);

    await userCollection.updateOne({ staffNumber }, { $set: { hashedPassword } });

    const user = await userCollection.findOne({ staffNumber });
    const text = `Dit nye password er: ${newRandomPassword}\nDu bør skifte dette hurtigst muligt. \nMvh admin`;
    await sendMail(user.email, 'password reset', text);

    res.status(200).send({ data: 'Password reset' });
  } catch (error) {
    res.status(500).send({ data: error.message });
  }
});

router.put('/api/users/:staffnumber', adminCheck, async (req, res) => {
  const staffNumber = req.params.staffnumber;
  const { name, email } = req.body;

  const foundUserOnStaffNumber = await userCollection.find({ staffNumber }).toArray();

  if (foundUserOnStaffNumber[0].name !== name) {
    await userCollection.updateOne(
      { staffNumber },
      {
        $set: {
          name,
        },
      },
    );
  }

  if (foundUserOnStaffNumber[0].email !== email) {
    const foundUser = await userCollection.find({ email }).toArray();
    if (foundUser.length < 1) {
      await userCollection.updateOne(
        { staffNumber },
        {
          $set: {
            email,
          },
        },
      );
      res.status(200).send({ data: 'User updated' });
    } else {
      res.status(400).send({ data: 'Email address already assigned to another user' });
    }
  } else {
    res.status(200).send({ data: 'User updated' });
  }
});

export default router;
