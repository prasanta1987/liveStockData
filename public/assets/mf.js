let mfCode = window.location.pathname.replace('/', '')


fetch(`https://api.mfapi.in/mf/${mfCode}`)
    .then(res => res.json())
    .then(data => {
        document.querySelector('.mffullname').innerHTML = data.meta.scheme_name
        document.querySelector('.mfcat').innerHTML = data.meta.scheme_category

        let chartDataArray = []
        data.data.forEach(values => {
            let newDateFormat = new Date(retDateFormat(values.date)).getTime()
            chartDataArray.push([newDateFormat, parseFloat(values.nav)])
        })

        chartDataArray = chartDataArray.reverse()
        intraGrpah(chartDataArray)
        console.log(chartDataArray)
    })
    .catch(err => {
        console.log(err)
    })


const retDateFormat = (myDate) => {
    let date = myDate.slice(0, 2)
    let year = myDate.slice(6, 10)

    let monthPos = parseInt(myDate.slice(3, 5)) - 1
    let monthRange = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    let newDate = `${date}-${monthRange[monthPos]}-${year}`
    return newDate
}


const intraGrpah = (datas) => {

    Highcharts.stockChart('container-intra', {
        time: {
            useGMT: true,
        },
        stockTools: {
            gui: {
                enabled: false // disable the built-in toolbar
            }
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        rangeSelector: {
            buttons: [{
                count: 1,
                type: 'month',
                text: '1M'
            }, {
                count: 2,
                type: 'month',
                text: '2H'
            },
            {
                count: 6,
                type: 'month',
                text: '4h'
            }, {
                type: 'all',
                text: 'All'
            }],
            inputEnabled: false,
            selected: 3
        },

        title: {
            text: 'Intra Day Chart'
        },

        exporting: {
            enabled: true
        },
        series: [
            {
                name: 'Nav',
                data: datas,
                color: "#008080"
            }
        ]
    });

}