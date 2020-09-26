
const getHoldings = (userData) => {

    userData.buyTransactions.forEach(trns => {
        console.log(trns)

        document.querySelector('.holdingdata').innerHTML += `
            <tr>
                <td>${trns.name}</td>
                <td>${trns.buyPrice}</td>
            </tr>
        `

    })

    document.querySelector('.holdingdata').innerHTML += `
        <tr>
            <td>Total</td>
        </tr>
    `
}

const addMfIDtoModal = (mfName, mfId) => {
    let mfTitleMarkup = document.querySelector('.modalmfname')

    mfTitleMarkup.innerHTML = mfName
    mfTitleMarkup.setAttribute('data-mfid', mfId)
}


document.querySelector('#buydate').addEventListener('change', (e) => {

    let scmid = document.querySelector('.modalmfname').getAttribute('data-mfid')
    let buyDate = moment(new Date(e.target.value).getTime()).format('DD-MM-YYYY')

    returnNavValue(scmid, buyDate)
        .then(nav => {
            document.querySelector('.navappl').innerHTML = nav
            if (nav == 0) {
                document.querySelector('.bp').style.display = 'none'
            } else {
                document.querySelector('.bp').style.display = 'block'
            }
        })
        .catch(err => console.log(err))
})

const addTrns = () => {
    let scmName = document.querySelector('.modalmfname').innerHTML
    let scmid = document.querySelector('.modalmfname').getAttribute('data-mfid')
    let buyPrice = document.querySelector('#buyprice').value
    let buyNav = parseFloat(document.querySelector('.navappl').innerHTML)
    let buyDate = moment(new Date(document.querySelector('#buydate').value).getTime()).format('DD-MM-YYYY')


    fetch(`/buyMF/${scmName}/${scmid}/${buyDate}/${buyNav}/${buyPrice}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
}