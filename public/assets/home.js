
const getHoldings = (userData) => {

    userData.buyTransactions.forEach(trns => {
        console.log(trns)

        document.querySelector('.holdingdata').innerHTML += `
            <tr>
                <td>${trns.name}</td>
            </tr>
        `

    })

    document.querySelector('.holdingdata').innerHTML += `
        <tr>
            <td></td>
        </tr>
    `
}

const addMfIDtoModal = (mfName, mfId) => {
    let mfTitleMarkup = document.querySelector('.modalmfname')

    mfTitleMarkup.innerHTML = mfName
    mfTitleMarkup.setAttribute('data-mfid', mfId)
}

const addTrns = () => {
    let scmName = document.querySelector('.modalmfname').innerHTML
    let scmid = document.querySelector('.modalmfname').getAttribute('data-mfid')
    let buyPrice = document.querySelector('#buyprice').value
    let buyDate = returnGmtTime(document.querySelector('#buydate').value)

}