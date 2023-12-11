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
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })


router.post("/api/upload", upload.single('file'), async (req, res) => {

    const roundName = req.body.roundName.trim().replace(/\s+/g, '_')
    const softDeadline = req.body.softDeadline


    try {

        const foundRound = await productsCollection.find({ round: roundName }).toArray()

        if (foundRound.length > 0) {
            return res.status(400).send({ error: "Navn på runde allerede i brug" })
        }

        if (!req.file) {
            return res.status(400).send({ error: 'Invalid file or file is empty.' })
        }

        const allData = xlsx.readFile(req.file.path)
        const spreadsheetName = allData.SheetNames[0]
        const sheet = allData.Sheets[spreadsheetName]
        const jsonData = xlsx.utils.sheet_to_json(sheet)
        const jsonDataWithRoundName = jsonData.map(jsonDataItem => ({ ...jsonDataItem, round: roundName }))

        await productsCollection.insertMany(jsonDataWithRoundName)
        await ordersCollection.insertOne({ round: roundName, isOpen: true, softDeadline })

        res.status(200).send({ data: jsonDataWithRoundName })

    } catch (error) {
        console.error('Error processing file:', error)
        res.status(500).send({ error: 'Internal Server Error' })
    } finally {

        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting file:', err)
            }

        })

    }
})

export default router