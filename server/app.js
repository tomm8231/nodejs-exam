import express from "express"
const app = express()

app.get("/", (req, res) => {
    res.send("Hul igennem")
})

const PORT = process.env.PORT || 8080

app.listen(PORT, (res, req) => {
    console.log("Server is running on port", PORT);
})