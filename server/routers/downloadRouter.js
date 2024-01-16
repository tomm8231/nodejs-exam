import {Router} from 'express'
import excel from 'exceljs'
import db from '../database/connections.js'
import { adminCheck } from '../middelware/authMiddelware.js'

const router = Router()

router.get('/download-excel/:round', adminCheck,  async (req, res) => {
    const round = req.params?.round
  try {
  
    const existingOrders = await db.collection("orders").find({ round, orderedItems: { $exists: true } }).toArray()

    if (existingOrders.length > 0) {
      const counts = await db.collection("orders").aggregate([
          {
            $unwind: "$orderedItems",
          },
          {
            $group: {
              _id: "$orderedItems._id",
              count: {
                $sum: "$orderedItems.quantity",
              },
            },
          },
        ]).toArray()

      const result = existingOrders[0].orderedItems.map((product) => {
        const foundItem = counts.find((item) => item._id === product._id)
        product.quantity = foundItem ? foundItem.count : 0
        return product
      })

      //deconstuerer vores item, og returnere en ny array uden id
    const resultWithoutId = result.map(({_id, ...orderItem}) => orderItem)

    const workbook = new excel.Workbook() 
    const worksheet = workbook.addWorksheet('Sheet 1')

    // Add headers to the worksheet
    if (resultWithoutId.length > 0) {
      const headers = Object.keys(resultWithoutId[0])
      worksheet.addRow(headers) 

      // Add data to the worksheet
      resultWithoutId.forEach(item => {
        const row = Object.values(item)
        worksheet.addRow(row)
      })
    } 
        
    // Set response headers for Excel file download
    try {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename=${round}-stafforders.xlsx`)

        // Send the Excel file to the client
        await workbook.xlsx.write(res)
        res.end()
    } catch (error) {
        console.error(error)
        res.status(400).send({ data: 'Server Error' })
    }

    } else if (existingOrders.length === 0) {
        res.status(400).send({ data: 'Ingen ordre fundet på den angivne runde' })
    }

} catch (error) {
    console.error(error)
    res.status(400).send({ data: 'Server Error' })
  }
}) 

export default router