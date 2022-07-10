const mainEl = document.querySelector("#main");

$(document).ready(() => {
  drawPM25();
});

function drawPM25() {
  $.ajax({
    url: "/pm25-json",
    type: "POST",
    dataType: "json",
    success: (data) => {
      console.log(data);
      drawChart_1(data);
      // drawChart_2(data);
    },
    error: () => {
      alert("error!");
    },
  });
}

function drawChart_2(data2) {
  var chartDom = document.getElementById("main");
  var myChart = echarts.init(chartDom);
  var option;

  // prettier-ignore
  let dataAxis = data2['stationName'];
  // prettier-ignore
  let data = data2['result'];
  let yMax = 500;
  let dataShadow = [];
  for (let i = 0; i < data.length; i++) {
    dataShadow.push(yMax);
  }
  option = {
    title: {
      text: "特性示例：渐变色 阴影 点击缩放",
      subtext: "Feature Sample: Gradient Color, Shadow, Click Zoom",
    },

    xAxis: {
      data: dataAxis,
      axisLabel: {
        inside: true,
        color: "#000",
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      z: 10,
    },
    yAxis: {
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#999",
      },
    },
    dataZoom: [
      {
        type: "inside",
      },
    ],
    series: [
      {
        type: "bar",
        showBackground: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#83bff6" },
            { offset: 0.5, color: "#188df0" },
            { offset: 1, color: "#188df0" },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#2378f7" },
              { offset: 0.7, color: "#2378f7" },
              { offset: 1, color: "#83bff6" },
            ]),
          },
        },
        data: data,
      },
    ],
  };
  // Enable data zoom when user click bar.
  const zoomSize = 6;
  myChart.on("click", function (params) {
    console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
    myChart.dispatchAction({
      type: "dataZoom",
      startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
      endValue:
        dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)],
    });
  });

  option && myChart.setOption(option);
}

// 繪製一般柱狀圖
function drawChart_1(data) {
  let myChart = echarts.init(mainEl);
  // 指定图表的配置项和数据
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
      data: ["站點"],
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
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}
