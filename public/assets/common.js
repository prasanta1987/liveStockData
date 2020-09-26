const getUserData = async () => {

    try {
        let res = await fetch('/getUserData', { method: 'POST' })
        let data = await res.json()

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