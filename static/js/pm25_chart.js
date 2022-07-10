const mainEl = document.querySelector("#main");
const sixEl = document.querySelector("#six");

const pm25HighSite = document.querySelector("#pm25_high_site");
const pm25HighValue = document.querySelector("#pm25_high_value");
const pm25LowSite = document.querySelector("#pm25_low_site");
const pm25LowValue = document.querySelector("#pm25_low_value");

let chart1 = echarts.init(mainEl);
let chart2 = echarts.init(sixEl);

$(document).ready(() => {
  drawPM25();
});

function renderMaxPM25(datas) {
  const result = datas["result"];
  const stationName = datas["stationName"];

  let maxIndex = result.indexOf(Math.max(...result));
  let minIndex = result.indexOf(Math.min(...result));

  pm25HighSite.innerText = stationName[maxIndex];
  pm25HighValue.innerText = result[maxIndex];
  pm25LowSite.innerText = stationName[minIndex];
  pm25LowValue.innerText = result[minIndex];

  console.log(maxIndex, minIndex);
}

function drawPM25() {
  pm25HighSite.innerText = "更新中";
  pm25HighValue.innerText = "N/A";
  pm25LowSite.innerText = "更新中";
  pm25LowValue.innerText = "N/A";

  chart1.showLoading();
  $.ajax({
    url: "/pm25-json",
    type: "POST",
    dataType: "json",
    success: (data) => {
      chart1.hideLoading();
      console.log(data);
      $("#date").text(data["date"]);
      drawChart1(data);
      renderMaxPM25(data);
      drawSixPM25();
    },
    error: () => {
      chart1.hideLoading();
      alert("error!");
    },
  });
}

function drawSixPM25() {
  chart2.showLoading();
  $.ajax({
    url: "/six-pm25-json",
    type: "POST",
    dataType: "json",
    success: (data) => {
      chart2.hideLoading();
      console.log(data);
      drawChart2(data);
    },
    error: () => {
      chart2.hideLoading();
      alert("讀取六都數據錯誤!");
    },
  });
}

// 繪製一般柱狀圖
function drawChart1(data) {
  let option = {
    title: {
      text: "PM2.5數據圖",
    },
    toolbox: {
      show: true,
      orient: "vertical",
      left: "left",
      top: "center",
      feature: {
        magicType: { show: true, type: ["line", "bar", "tiled"] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["PM2.5"],
    },
    xAxis: {
      data: data["stationName"],
    },
    yAxis: {},
    series: [
      {
        name: "PM2.5",
        type: "bar",
        data: data["result"],
      },
    ],
  };

  chart1.setOption(option);
}

function drawChart2(data) {
  let option = {
    legend: {
      data: ["PM2.5"],
    },
    xAxis: {
      data: data["citys"],
    },
    yAxis: {},
    series: [
      {
        itemStyle: {
          color: "#800080",
        },
        name: "PM2.5",
        type: "bar",
        data: data["result"],
      },
    ],
  };

  chart2.setOption(option);
}
