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



// Moneycontrol Data Ends here
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`)
})

