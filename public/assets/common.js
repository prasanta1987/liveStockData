const getUserData = async () => {

    try {
        let res = await fetch('/getUserData', { method: 'POST' })
        let data = await res.json()
        userData = data
        if (document.querySelector('.holdings')) getHoldings(data)

    } catch (error) {
        console.log(error)
        setTimeout(getUserData, 5000)
    }
}

getUserData()

const returnNavValue = async (mfId, mfDate) => {
    let res = await fetch(`https://api.mfapi.in/mf/${mfId}`)
    let data = await res.json()

    let dtdNav = 0

    data.data.forEach(nav => {
        if (nav.date == mfDate) {
            dtdNav = parseFloat(nav.nav)
        }
    })

    return dtdNav
}

const returnCurrentNavValue = async (mfId) => {
    let res = await fetch(`https://api.mfapi.in/mf/${mfId}`)
    let data = await res.json()

    return parseFloat(data.data[0].nav)
}

const returnHoldingDatas = (mfId) => {

    let totalinvested = 0, totalAvlUnits = 0, mfName;

    userData.buyTransactions.forEach(data => {
        if (data.mfId == mfId) {
            totalinvested += data.buyPrice
            totalAvlUnits += data.buyPrice / data.buyNav
            mfName = data.name
        }
    })

    let avgNav = totalinvested / totalAvlUnits

    let holdinfDetail = {
        mfName: mfName,
        invested: totalinvested,
        avlUnits: totalAvlUnits,
        avgNav: avgNav
    }
    return holdinfDetail
}

document.querySelector('.mfname').addEventListener('keyup', e => {
    let mfName = e.target.value
    mfName = mfName.replace(' ', '%20')
    mfName = mfName.replace('&', '%26')
    if (mfName.length > 3) {
        let url = `https://api.mfapi.in/mf/search?q=${mfName}`
        console.log(url)
        fetch(url)
            .then(res => res.json())
            .then(data => {
                document.querySelector('.suggestionresponse').innerHTML = ''
                data.forEach(mfs => {
                    document.querySelector('.suggestionresponse').innerHTML += `
                    <span class="p-1 border suggestion">
                        <span class="name text-dark"><a href="/${mfs.schemeCode}">${mfs.schemeName}</a></span>
                        <button id="${mfs.schemeCode}" 
                            class="btn btn-sm btn-outline-success"
                            onClick="addMfIDtoModal('${mfs.schemeName}','${mfs.schemeCode}')"
                            data-toggle="modal" data-target="#trnsModal">ADD</button>
                    </span>`
                })
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        document.querySelector('.suggestionresponse').innerHTML = ''
    }
})

const returnGmtTime = (date) => {
    let newDate = new Date(date).getTime()
    return (newDate - 19800000)
}

const formatCurrency = (x) => {
    x = x.toString();
    var afterPoint = '';
    if (x.indexOf('.') > 0)
        afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;

    return res
}
