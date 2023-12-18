import db from "../databases/connections.js";
import { sendMail } from "../nodemailer/sendEmail.js";

function handleSocket(socket) {

    socket.on("client-admin-order-status", async (data) => {
        await db.collection("messages").insertOne(data);

        socket.broadcast.emit("server-admin-message", data);
        socket.broadcast.emit("server-sent-round-message", data);
    });

    socket.on("client-admin-message", async (data) => {
        // data.date = new Date();
        console.log(data);
        const roundOrders = await db.collection("orders").find({ round: data.round, staffNumber: { $exists: true } }).toArray()
        const staffNumbersFromRound = roundOrders.map(order => order.staffNumber);
        const roundUsers = await db.collection("users").find({
            staffNumber: { $in: staffNumbersFromRound }
        }).toArray();
        const emails = roundUsers.map(user => user.email);

        await db.collection("messages").insertOne(data);
        const message = `Der er kommet en ny besked vedr. bestillingsrunde ${data.round}: ${data.message}`

        sendMail(emails, `Vedr. ${data.round}`, message)
        socket.broadcast.emit("server-admin-message", data);
    });
}

export default handleSocket;