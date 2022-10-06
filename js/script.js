const toggle = document.getElementById("toggle");
const modalContainer = document.getElementById("modal-container");
const closeBtn = document.getElementById("close");
const graphBtn = document.getElementById("graph");

const table = document.getElementById("table");

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

function showTableAndChart(data, typeOfMeasurement, chartAvailability) {
  let output = `<tr>
          <th>Row</th>
          <th>Date</th>
          <th>Time</th>
          <th>Measurements</th>
          <th>Values</th>
    </tr>`;

  if (typeOfMeasurement === "") {
    data.length = 30;
    for (i = 0; i < data.length; i++) {
      var value = Object.keys(data[i].data);

      output += `<tr class="tableRow">
                        <td>${i + 1}</td>
                        <td>${data[i].date_time
                          .slice(0, 10)
                          .split("-")
                          .reverse()
                          .join("/")}</td>
                        <td>${data[i].date_time.slice(11, 19)}</td>
                        <td>${Object.keys(data[i].data)}</td>
                        <td>${
                          Math.round(Object.values(data[i].data) * 100) / 100
                        }</td>
                    </tr>`;
      // show chart. if chart is available..
      chartAvailability === true
        ? showChart(data, "wind_direction")
        : (graphBtn.style.visibility = "hidden");
    }
  } else if (typeOfMeasurement === "wind_speed") {
    data.map((dataTemp, index) => {
      output += `<tr class="tableRow">
              <td>${index + 1}</td>
              <td>${dataTemp.date_time
                .slice(0, 10)
                .split("-")
                .reverse()
                .join("/")}</td>
              <td>${dataTemp.date_time.slice(11, 19)}</td>
              <td>Wind Speed</td>
              <td>${Math.round(dataTemp.wind_speed * 100) / 100}</td>
        </tr>`;
      // show chart. if chart is available..
      chartAvailability === true
        ? showChart(data, "wind_speed")
        : (graphBtn.disabled = true);
    });
  } else if (typeOfMeasurement === "wind_direction") {
    data.map((dataTemp, index) => {
      output += `<tr class="tableRow">
              <td>${index + 1}</td>
              <td>${dataTemp.date_time
                .slice(0, 10)
                .split("-")
                .reverse()
                .join("/")}</td>
              <td>${dataTemp.date_time.slice(11, 19)}</td>
              <td>Wind Direction</td>
              <td>${Math.round(dataTemp.wind_direction * 100) / 100}</td>
        </tr>`;
      // show chart. if chart is available..
      chartAvailability === true
        ? showChart(data, "wind_direction")
        : (graphBtn.disabled = true);
    });
  }

  table.innerHTML = output;
}

function showChart(data, typeOfMeasurement) {
  const time = data.map((elem) => {
    return elem.date_time.slice(11, 19);
  });

  const value = data.map((elem) => {
    if (typeOfMeasurement === "wind_speed") {
      return elem.wind_speed;
    } else if (typeOfMeasurement === "wind_direction") {
      return elem.wind_direction;
    }
  });

  document.querySelector("#chartReport").innerHTML =
    '<canvas id="chart"></canvas>';
  var ctx = document.getElementById("chart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: time,
      datasets: [
        {
          label: typeOfMeasurement,
          data: value,
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
}

function searchInput() {
  const input = document.getElementById("search");
  const filter = input.value.toUpperCase();
  const tr = table.getElementsByTagName("tr");

  let td, i, txtValue;
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[4];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

getTableData();
