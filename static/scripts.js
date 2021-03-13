var ctx = document.getElementById("myChart").getContext("2d");
let data, chart, labels, originData,
    type = "line",
    unit = "month",
    display = "duration";

//#region Handle Option Changes

function handleChange(ev) {

    switch (ev.name) {
        case "duration":
            handleDurationChange(ev);
            break;
        case "type":
            handleTypeChange(ev);
            break;
        case "unit":
            handleUnitChange(ev);
            break;
        case "display":
            handleDisplayChange(ev);
            break;
    }
}

function handleDurationChange(ev) {
    switch (ev.value) {
        case "all":
            convertData(originData);
            break;
        default:
            let period = parseInt(ev.value);
            let date = new Date();
            date.setDate(date.getDate() - period);
            let cloned = JSON.parse(JSON.stringify(originData));

            Object.keys(cloned).forEach(k => {
                if ((new Date(k)).getTime() < date.getTime()) {
                    delete cloned[k];
                }
            });

            convertData(cloned);
            break;
    }
}

function handleTypeChange(ev) {
    type = ev.value;
    renderChart();
}

function handleUnitChange(ev) {
    unit = ev.value;
    renderChart();
}


function handleDisplayChange(ev) {
    display = ev.value;
    renderChart();
}

function convertData(input) {
    labels = Object.keys(input);
    data = labels.map((date) => {
        // return input[date];
        return {
            x: new Date(date),
            y: input[date],
            origin: input[date]
        }
    });

    renderChart();
}

//#endregion

function getData(search) {
    fetch(`/data${search || window.location.search}`)
        .then((rs) => rs.json())
        .then((rs) => {
            originData = rs;
            convertData(originData);
        });
}

function renderChart() {

    if (chart) {
        chart.destroy();
        chart = undefined;
    }


    if (display === "duration") {
        data = data.map(r => {
            r.y = r.origin;
            return r;
        })
    } else {
        let total = 0;
        data = data.map(r => {
            r.y = total += r.origin;
            return r;
        })
    }

    chart = new Chart(ctx, {
        type,
        data: {
            // labels,
            datasets: [
                {
                    label: `Users`,
                    data,
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    lineTension: 0,
                    borderWidth: 2
                },
            ],
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit
                    },
                }],

                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Users'
                    }
                }]
            },
            title: {
                display: true,
                text: `User Growth — total ${data.reduce(calculateTotal, 0)} users`
            }
        },
    });

}

function calculateTotal(total, value) {
    if (typeof value === "object") return total += value.origin;
    return total += value;
}

window.addEventListener('DOMContentLoaded', (event) => {
    getData()
});
