import { Router } from 'express'
const router = Router()
import multer from 'multer'

import * as xlsx from 'xlsx/xlsx.mjs'

import * as fs from 'fs'
xlsx.set_fs(fs)

import { Readable } from 'stream'
xlsx.stream.set_readable(Readable)

import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs'
xlsx.set_cptable(cpexcel)

import db from '../databases/connections.js'
const productsCollection = db.collection("products")
const ordersCollection = db.collection("orders")



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const now = Date.now();
        const dateObject = new Date(now);

        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1; // Months are zero-based, so add 1
        const date = (dateObject.getDate()) < 10 ? "0" + dateObject.getDate() : dateObject.getDate()
        const hours = (dateObject.getHours()) < 10 ? "0" + dateObject.getHours() : dateObject.getHours()
        const minutes = (dateObject.getMinutes()) < 10 ? "0" + dateObject.getMinutes() : dateObject.getMinutes()
        const seconds = (dateObject.getSeconds()) < 10 ? "0" + dateObject.getSeconds() : dateObject.getSeconds()
        const milliseconds = (dateObject.getMilliseconds()) < 10 ? "0" + dateObject.getMilliseconds() : dateObject.getMilliseconds()
        const uniqueIdentifier = date + month + year + '_' + hours + minutes + seconds + milliseconds
        const fileName = file.originalname.slice(0, file.originalname.lastIndexOf('.')) + '_' + uniqueIdentifier + file.originalname.slice(file.originalname.lastIndexOf('.'))
        cb(null, fileName)
    }
})

const upload = multer({ storage });


router.post("/api/upload", upload.single('file'), async (req, res) => {

    const roundName = req.body.roundName.trim().replace(/\s+/g, '_')    


    try {

        const foundRound = await productsCollection.find({ round: roundName }).toArray()

        if (foundRound.length > 0) {
            return res.status(400).send({ data: " Navn på runde allerede i brug"})
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Invalid file or file is empty.' });
        }
        
        const allData = xlsx.readFile(req.file.path);
        const spreadsheetName = allData.SheetNames[0];
        const sheet = allData.Sheets[spreadsheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);
        const jsonDataWithRoundName = jsonData.map(jsonDataItem => ({ ...jsonDataItem, round: roundName }));
        
        await productsCollection.insertMany(jsonDataWithRoundName)
        await ordersCollection.insertOne({ round: roundName, isOpen: true })

        res.status(200).send({ data: jsonDataWithRoundName });

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    } finally {

        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }

        });

    }
})

export default router