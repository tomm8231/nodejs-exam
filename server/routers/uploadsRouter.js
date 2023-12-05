import { Router } from 'express'
const router = Router()
import multer from 'multer'

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
    
    res.send({data: req.file})
})

export default router