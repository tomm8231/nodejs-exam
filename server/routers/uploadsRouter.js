import { Router } from 'express'
const router = Router()
import multer from 'multer'

import * as XLSX from 'xlsx/xlsx.mjs'

import * as fs from 'fs'
XLSX.set_fs(fs)

import { Readable } from 'stream'
XLSX.stream.set_readable(Readable)

import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs'
XLSX.set_cptable(cpexcel)



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


router.post("/api/upload", upload.single('file'), (req, res) => {


    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Invalid file or file is empty.' });
        }

        // Read the uploaded file
        const workbook = XLSX.readFile(req.file.path);
        // Assuming the first sheet in the Excel file contains the data
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Convert sheet data to JSON
        // const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // header: 1 returnerer mærkelig json-struktur
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        console.log(jsonData);

        // Here, you can add your code to save `jsonData` to the database
        // For example, if using Mongoose:
        // const YourModel = mongoose.model('YourModel', yourSchema);
        // await YourModel.insertMany(jsonData);

        // Send the JSON data as a response (optional)
        res.status(200).send({ data: jsonData });

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