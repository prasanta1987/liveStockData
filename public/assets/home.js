
let invested = 0
let holdingMfIds = []
let totalPL = 0, totalinv = 0, crntVal = 0;

const getHoldings = (userData) => {

    userData.buyTransactions.forEach(trns => {

        (!holdingMfIds.includes(trns.mfId)) && holdingMfIds.push(trns.mfId)

        //     console.log(trns)
        //     invested += trns.buyPrice

        //     document.querySelector('.holdingdata').innerHTML += `
        //         <tr class="mf${trns.mfId}" data-id="${trns.id}">
        //             <td>${trns.name}</td>
        //             <td>${trns.buyNav}</td>
        //             <td>${trns.buyPrice}</td>
        //             <td>~</td>
        //             <td>~</td>
        //         </tr>`

        //         })

        //         document.querySelector('.holdingdata').innerHTML += `
        //         <tr>
        //             <th>Total</th>
        //             <th>${invested}</th>
        //             <th>~</th>
        //             <th>~</th>
        //         </tr>`

        // holdingMfIds.forEach(ids=>{
        //     returnCurrentNavValue(ids)
        //     .then(res=>console.log(res))

    })


    holdingMfIds.forEach(ids => {
        let data = returnHoldingDatas(ids)

        returnCurrentNavValue(ids)
            .then(currentNav => {
                let currentValue = parseFloat((currentNav * data.avlUnits).toFixed(2))
                let pl = parseFloat((currentValue - data.invested).toFixed(2))

                totalPL += pl
                totalinv += data.invested
                crntVal += currentValue

                document.querySelector('.holdingdata').innerHTML += `
                    <tr>
                        <td class="text-left"><a class="links" href="/${ids}">${data.mfName}</a></td>
                        <td id="inv-${ids}">${data.invested}</td>
                        <td>${currentValue}</td>
                        <td class="${(pl < 0 ? 'text-danger' : 'text-success')}">${pl}</td>
                    </tr>`

                if (totalPL > 0) {
                    document.querySelector('.tpl').style.color = '#28a745'
                } else {
                    document.querySelector('.tpl').style.color = '#dc3545'
                }
                document.querySelector('.ti').innerHTML = formatCurrency(totalinv.toFixed(2))
                document.querySelector('.cv').innerHTML = formatCurrency(crntVal.toFixed(2))
                document.querySelector('.tpl').innerHTML = totalPL.toFixed(2)
            })
            .catch(err => {
                console.log(err)
            })

    })

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
        .then(data => {
            console.log(data)
            location.reload()
        })
        .catch(err => console.log(err))
}