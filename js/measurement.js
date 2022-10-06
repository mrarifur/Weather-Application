const toggle = document.getElementById("toggle");
const modalContainer = document.getElementById("modal-container");
const closeBtn = document.getElementById("close");
const graphBtn = document.getElementById("graph");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("show-nav");
});

graphBtn.addEventListener("click", () => {
  modalContainer.classList.add("show-modal");
});

closeBtn.addEventListener("click", () => {
  modalContainer.classList.remove("show-modal");
});

window.addEventListener("click", (e) => {
  if (e.target == modalContainer) {
    modalContainer.classList.remove("show-modal");
  }
});
const measurementType = document.getElementById("measurementType");
// const myChart = echarts.init(document.getElementById("chart"));
const timeInterval = document.getElementById("timeInterval");

function getMeasurementsName() {
  fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather/names")
    .then((res) => res.json())
    .then((results) => {
      results.forEach((result) => {
        const name = result.name;

        console.log(name);
        console.log("result", result);
        const option = document.createElement("option");
        if (name == "humidity_in") option.selected = true;
        option.text = name;
        option.value = name;
        measurementType.add(option);
      });

      showTableAndChart("line", measurementType.value, "now");
    });
}
getMeasurementsName();

measurementType.onchange = function (e) {
  showTableAndChart("line", measurementType.value, timeInterval.value);
};

timeInterval.onchange = function () {
  showTableAndChart("line", measurementType.value, timeInterval.value);
};

function getValuesByMeasurement(measurement, timeInterval) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  if (timeInterval == "now") {
    return latestDataOfSingleType(measurement).then((results) => {
      if (results.length < 20) {
        return latestDataOfSingleTypeByInterval(measurement).then((results) =>
          showTable(results, measurement)
        );
      } else {
        const first25Resuts = results.filter((result, index) => index < 25);
        return showTable(first25Resuts, measurement);
      }
    });
  } else {
    return latestDataOfSingleTypeByInterval(measurement, timeInterval).then(
      (results) => showTable(results, measurement)
    );
  }
}

function latestDataOfSingleTypeByInterval(measurementType, timeInterval) {
  return fetch(
    `http://webapi19sa-1.course.tamk.cloud/v1/weather/${measurementType}/${
      timeInterval ? timeInterval : ""
    }`
  )
    .then((res) => res.json())
    .then((results) => results);
}

function latestDataOfSingleType(measurementType) {
  return fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather")
    .then((res) => res.json())
    .then((results) => {
      const data = results.filter((result) => {
        return result.data[measurementType];
      });

      const reversedData = [];
      for (i = data.length - 1; i >= 0; i--) {
        reversedData.push(data[i]);
      }
      return reversedData;
    });
}

function showTable(results, measurement) {
  const times = [];
  const values = [];
  let totalValue = 0;

  results.forEach((result, index) => {
    const dateTime = new Date(result.date_time);
    const { date_time, data } = result;
    const time = dateTime.toTimeString().split(" ")[0];

    times.push(time);
    const measurementValue = result[measurement] || result.data[measurement];
    values.push(parseFloat(measurementValue));
    totalValue += parseFloat(measurementValue);
    const row = tableBody.insertRow();

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${dateTime.toLocaleDateString()}</td>
      <td data-sort=${dateTime.getTime()}>${time}</td>
      <td data-sort=${measurementValue}>${measurementValue}</td>
    `;
  });

  return {
    times,
    values,
    totalValue,
  };
}

function showTableAndChart(chartType, measurementType, timeInterval) {
  document.querySelector("#chartReport").innerHTML =
    '<canvas id="chart"></canvas>';
  var ctx = document.getElementById("chart").getContext("2d");
  getValuesByMeasurement(measurementType, timeInterval).then((chartObj) => {
    const { times, values, totalValue } = chartObj;
    // ------------------- //

    myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: times,
        datasets: [
          {
            label: measurementType,
            data: values,
            backgroundColor: [
              "rgba(8, 207, 91, 0.6)",
              "red",
              "green",
              "yellow",
              "violet",
              "blue",
              "#30336b",
              "Purple",
              "Orange",
            ],
            borderColor: "grey",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
}
