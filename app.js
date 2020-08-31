const express = require('express')
const path = require("path");
const axios = require("axios").default;
const HTMLParser = require('node-html-parser');
const fs = require('fs')

const BSESymbol = require('./bseEqComp')

const userPrifileFile = path.join(__dirname, './user_profile/userProfile.json')

const userProfileCheck = (req, res, next) => {

    let userData = JSON.parse(fs.readFileSync(userPrifileFile).toString())
    let keys = Object.keys(userData).length

    if (keys > 0) {
        return next()
    } else {
        res.sendFile(path.join(__dirname, '/public/registration.html'));
    }

}

fs.exists(userPrifileFile, (res) => {
    if (!res) {
        fs.mkdirSync(path.join(__dirname, './user_profile'))
        fs.writeFileSync(userPrifileFile, '{}')
    }
})


// require('events').EventEmitter.defaultMaxListeners = 0

const app = express()

app.get('/', userProfileCheck, (req, res) => res.sendFile(path.join(__dirname, '/public/home.html')));
app.get('/watchlist', userProfileCheck, (req, res) => res.sendFile(path.join(__dirname, '/public/watchlist.html')));
app.get('/userProfile', userProfileCheck, (req, res) => res.sendFile(path.join(__dirname, '/public/registration.html')));
app.get('/:symbol', userProfileCheck, (req, res) => res.sendFile(path.join(__dirname, '/public/symbol.html')));

app.use(express.static(path.join(__dirname, '/public')));


// local File Handling Starts Here


app.post('/getUserData', (req, res) => res.status(200).json(getUserProfile()))

const getUserProfile = () => {
    let userData = JSON.parse(fs.readFileSync(userPrifileFile).toString())

    return userData
}

app.post('/updateName/:name', (req, res) => {

    const name = req.params.name
    let userData = getUserProfile()

    userData.name = name

    try {
        fs.writeFileSync(userPrifileFile, JSON.stringify(userData))
        res.status(200).json({ "message": "User Name Saved Successfully" })
    } catch (error) {
        res.status(501).json({ "error": "Something Went Wrong" })
    }

})

app.post('/buyShare/:symbol/:price/:qty/:date', (req, res) => {

    const name = req.params.symbol
    const price = req.params.price
    const qty = req.params.qty
    const date = req.params.date

    let data = {
        id: new Date().getTime(),
        symbol: name,
        date: date,
        price: parseFloat(price),
        qty: parseInt(qty)
    }

    let userData = getUserProfile()

    userData.transactions.buy.push(data)

    try {
        fs.writeFileSync(userPrifileFile, JSON.stringify(userData))
        res.status(200).json({ "message": "Data Written Successfully" })
    } catch (error) {
        res.status(501).json({ "error": 'Something Went Wrong' })
    }

})

app.post('/sellShare/:symbol/:price/:qty/:date', (req, res) => {

    const name = req.params.symbol
    const price = req.params.price
    const qty = req.params.qty
    const date = req.params.date

    let data = {
        id: new Date().getTime(),
        symbol: name,
        date: date,
        price: parseFloat(price),
        qty: parseInt(qty)
    }

    let userData = getUserProfile()
    userData.transactions.sell.push(data)

    try {
        fs.writeFileSync(userPrifileFile, JSON.stringify(userData))
        res.status(200).json({ "message": "Data Written Successfully" })
    } catch (error) {
        res.status(501).json({ "error": "Something Went Wrong" })
    }

})

app.post('/removeSymbol/:symbol', (req, res) => {

    const symbol = req.params.symbol
    let userData = getUserProfile()
    let userAddedSymbols = userData.watchList || []


    let symbolIndex = userAddedSymbols.indexOf(symbol)
    let updatedWatchList = userAddedSymbols.splice(symbolIndex, 1)

    userAddedSymbols = []
    userAddedSymbols.push(userAddedSymbols)

    try {
        fs.writeFileSync(userPrifileFile, JSON.stringify(userData))
        res.status(200).json({ "message": "Watchlist Updated Successfully" })
    } catch (error) {
        res.status(501).json({ "error": "Something Went Wrong" })
    }

})

app.post('/addSymbol/:symbol', (req, res) => {

    const symbol = req.params.symbol
    let userData = getUserProfile()

    userWatchList = userData.watchList || []
    userWatchList.push(symbol)


    userData.watchList = userWatchList

    try {
        fs.writeFileSync(userPrifileFile, JSON.stringify(userData))
        res.status(200).json({ "message": "Watchlist Updated Successfully" })
    } catch (error) {
        res.status(501).json({ "error": "Something Went Wrong" })
    }


})

// local File Handling Ends Here

// NSE Data Strts Here

app.post('/marketStatus', (req, res) => {
    axios.get('https://www.nseindia.com/api/marketStatus')
        .then(data => res.status(200).json(data.data))
        .catch((err) => res.status(500).json(err))
})



// NSE Data Ends Here


// Start Ticker Tape Datas

app.post('/tickerData/:symbol', (req, res) => {
    let symbol = req.params.symbol
    const url = `https://quotes-api.tickertape.in/quotes?sids=${symbol}`

    axios.get(url)
        .then(data => res.status(200).json(data.data))
        .catch(() => res.status(500).json({ "error": "Failed to Fetch" }))
})

app.post('/tickerInfo/:symbol', (req, res) => {
    let symbol = req.params.symbol
    const url = `https://api.tickertape.in/stocks/info/${symbol}`

    axios.get(url)
        .then(data => res.status(200).json(data.data))
        .catch(() => res.status(500).json({ "error": "Failed to Fetch" }))
})

app.post('/search/:text', (req, res) => {
    let text = req.params.text
    const url = `https://api.tickertape.in/search?text=${text}`

    axios.get(url)
        .then(data => res.status(200).json(data.data))
        .catch(() => res.status(500).json({ "error": "Failed to Fetch" }))
})

app.post('/getMMI', (req, res) => {
    const url = 'https://api.tickertape.in/mmi/now'
    axios.get(url)
        .then(data => res.status(200).json(data.data))
        .catch(() => res.status(500).json({ "error": "Failed to Fetch" }))
})

// End Ticker Tape


// Moneycontrol Data Starts here

app.post('/moneycontrolSearch/:text', (req, res) => {
    let text = req.params.text
    const url = `https://www.moneycontrol.com/mccode/common/autosuggestion_solr.php?query=${text}&type=1&format=json`

    axios.get(url)
        .then(data => res.status(200).json(data.data))
        .catch(() => res.status(500).json({ "error": "Failed to Fetch" }))
})

app.post('/moneycontrolStockData/:scid', (req, res) => {
    let scid = req.params.scid
    const url = `https://priceapi.moneycontrol.com/pricefeed/nse/equitycash/${scid}`

    axios.get(url)
        .then(data => res.status(200).json(data.data))
        .catch(() => res.status(500).json({ "error": "Failed to Fetch" }))
})


// Groww Data
app.post('/growwLiveData/:symbol', (req, res) => {

    const symbol = req.params.symbol.toUpperCase()
    const url = `https://groww.in/v1/api/stocks_data/v1/accord_points/exchange/NSE/segment/CASH/latest_prices_ohlc/${symbol}`
    axios.get(url)
        .then(data => res.status(200).json(data.data))
        .catch(() => res.status(500).json({ "error": "Failed to Fetch" }))
})

app.post('/growwChanrt/:symbol', (req, res) => {

    const symbol = req.params.symbol.toUpperCase()
    const url = `https://groww.in/v1/api/stocks_data/v1/accord_graph_points/exchange/NSE/segment/CASH/prices/${symbol}?&range=D`
    axios.get(url)
        .then(data => res.status(200).json(data.data))
        .catch(() => res.status(500).json({ "error": "Failed to Fetch" }))
})

// Moneycontrol Data Ends here
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`)
})

