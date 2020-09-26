const express = require('express')
const path = require("path");
const axios = require("axios").default;
const HTMLParser = require('node-html-parser');
const fs = require('fs')

// require('events').EventEmitter.defaultMaxListeners = 0

const app = express()

const userPrifileFile = path.join(__dirname, './user_profile/userProfile.json')

fs.exists(userPrifileFile, (res) => {
    if (!res) {
        fs.mkdirSync(path.join(__dirname, './user_profile'))
        fs.writeFileSync(userPrifileFile,
            JSON.stringify({
                name: null,
                watchList: [],
                buyOrder: [],
                sellOrder: []
            })
        )
    }
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/home.html')));
app.get('/:mfId', (req, res) => res.sendFile(path.join(__dirname, '/public/mf.html')));

app.use(express.static(path.join(__dirname, '/public')));

app.post('/getUserData', (req, res) => res.status(200).json(getUserProfile()))

const getUserProfile = () => {
    let userData = JSON.parse(fs.readFileSync(userPrifileFile).toString())

    return userData
}



app.post('/buyMF/:name/:id/:date/:buyNav/:buyPrice', (req, res) => {

    let mfName = req.params.name
    let mfId = req.params.id
    let buyDate = req.params.date
    let buyNav = parseFloat(req.params.buyNav)
    let buyPrice = parseFloat(req.params.buyPrice)

    let unitAvl = buyPrice / buyNav

    let data = {
        name: mfName,
        mfId: mfId,
        buyDate: buyDate,
        buyNav: buyNav,
        buyPrice: buyPrice,
        unitAvl: unitAvl
    }

    let userData = getUserProfile()
    userData.buyTransactions.push(data)

    try {
        fs.writeFileSync(userPrifileFile, JSON.stringify(userData, null, 4))
        res.status(200).json({ "message": "Data Written Successfully" })
    } catch (error) {
        res.status(501).json({ "error": 'Something Went Wrong' })
    }
})


// Moneycontrol Data Ends here
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`)
})

