const fetchOption = { "method": 'POST' }


google.charts.load('current', { 'packages': ['gauge'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['MMI', parseFloat(sessionStorage.MMI)],
    ]);

    var options = {
        width: 400, height: 400,
        greenFrom: 0, greenTo: 30,
        yellowFrom: 30, yellowTo: 70,
        redFrom: 70, redTo: 100,
        minorTicks: 5
    };

    var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

    chart.draw(data, options);

    setInterval(function () {
        data.setValue(0, 1, parseFloat(sessionStorage.MMI));
        chart.draw(data, options);
    }, 5000);

}