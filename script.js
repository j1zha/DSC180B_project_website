console.log("AI Stock Analysis Assistant Loaded!");
// 存储模型数据
const modelsData = {
    "Time Series Transformer": null,
    "Temporal Convolutional Network (TCN)": null,
    "Temporal Fusion Transformer": null,
    "Long Short-Term Memory (LSTM)": null
};

// 加载 JSON 数据
Promise.all([
    fetch("model1_data.json").then(response => response.json()),
    fetch("model2_data.json").then(response => response.json()),
    fetch("model3_data.json").then(response => response.json()),
    fetch("lstm_data.json").then(response => response.json())
])
.then(([dataTST, dataTCN, dataTFT, dataLSTM]) => {
    modelsData["Time Series Transformer"] = dataTST;
    modelsData["Temporal Convolutional Network (TCN)"] = dataTCN;
    modelsData["Temporal Fusion Transformer"] = dataTFT;
    modelsData["Long Short-Term Memory (LSTM)"] = dataLSTM;
    
    // 初始化图表，默认显示 Time Series Transformer
    initChart(dataTST);
    updateMetricsBelow("Time Series Transformer");
})
.catch(error => console.error("Error loading JSON files:", error));

// 初始化图表
let chart = null;
function initChart(modelData) {
    const ctx = document.getElementById("performanceChart").getContext("2d");
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: modelData.dates,
            datasets: [
                { label: "Actual Price", data: modelData.Y_real, borderColor: "blue", fill: false },
                { label: "Predicted Price", data: modelData.predictions, borderColor: "red", fill: false },
                { label: "Prediction Error", data: modelData.differences, borderColor: "green", fill: false }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { ticks: { autoSkip: true, maxTicksLimit: 10 } },
                y: { beginAtZero: false }
            }
        }
    });
}

// 监听下拉菜单，切换模型数据
document.getElementById("modelSelect").addEventListener("change", function() {
    const selectedModel = this.value;
    const modelData = modelsData[selectedModel];
    
    if (modelData && chart) {
        chart.data.labels = modelData.dates;
        chart.data.datasets[0].data = modelData.Y_real;
        chart.data.datasets[1].data = modelData.predictions;
        chart.data.datasets[2].data = modelData.differences;
        chart.update();
    }

    updateMetricsBelow(selectedModel);
});

// 模型指标数据
const modelMetrics = {
    "Time Series Transformer": { rmse: 5.4467, crps: 2.9472 },
    "Temporal Convolutional Network (TCN)": { rmse: 6.6400, crps: 3.7191 },
    "Temporal Fusion Transformer": { rmse: 7.7356, crps: 4.4172 },
    "Long Short-Term Memory (LSTM)": { rmse: 16.2018, crps: 9.3932 }
};

// 更新 RMSE 和 CRPS 指标
function updateMetricsBelow(modelKey) {
    const metrics = modelMetrics[modelKey];
    const metricsDiv = document.getElementById("metricsBelow");
    if (metrics) {
        metricsDiv.innerHTML = `<p>RMSE: ${metrics.rmse.toFixed(4)}</p><p>CRPS: ${metrics.crps.toFixed(4)}</p>`;
    } else {
        metricsDiv.innerHTML = "<p>RMSE: —</p><p>CRPS: —</p>";
    }
}
