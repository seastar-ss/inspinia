$(document).ready(function () {

    // var d1 = [
    //     [1262304000000, 6], [1264982400000, 3057], [1267401600000, 20434], [1270080000000, 31982], [1272672000000, 26602], [1275350400000, 27826], [1277942400000, 24302], [1280620800000, 24237], [1283299200000, 21004], [1285891200000, 12144], [1288569600000, 10577], [1291161600000, 10295]
    // ];
    // var d2 = [
    //     [1262304000000, 5], [1264982400000, 200], [1267401600000, 1605], [1270080000000, 6129], [1272672000000, 11643], [1275350400000, 19055], [1277942400000, 30062], [1280620800000, 39197], [1283299200000, 37000], [1285891200000, 27000], [1288569600000, 21000], [1291161600000, 17000]
    // ];
    //
    // var data1 = [
    //     {label: "Data 1", data: d1, color: '#17a084'},
    //     {label: "Data 2", data: d2, color: '#127e68'}
    // ];

    // Chart.pluginService.register({
    //     beforeDraw: function (chart) {
    //         if (chart.options.hintText) {
    //             var width = chart.chart.width,
    //                 height = chart.chart.height,
    //                 ctx = chart.chart.ctx;
    //
    //             ctx.restore();
    //             var fontSize = (height / 200).toFixed(2); // was: 114
    //             ctx.font = fontSize + "em sans-serif";
    //             ctx.textBaseline = "middle";
    //             var m=ctx.measureText(text);
    //             var text = chart.options.hintText, // "75%",
    //                 textX = Math.round((width - m.width)),
    //                 textY = height-15 ;
    //
    //             ctx.fillText(text, textX, textY);
    //             ctx.save();
    //         }
    //     }
    // });
    // $.plot($("#flot-chart1"), data1, {
    //     xaxis: {
    //         tickDecimals: 0
    //     },
    //     series: {
    //         lines: {
    //             show: true,
    //             fill: true,
    //             fillColor: {
    //                 colors: [{
    //                     opacity: 1
    //                 }, {
    //                     opacity: 1
    //                 }]
    //             },
    //         },
    //         points: {
    //             width: 0.1,
    //             show: false
    //         },
    //     },
    //     grid: {
    //         show: false,
    //         borderWidth: 0
    //     },
    //     legend: {
    //         show: false,
    //     }
    // });

    var lineOptions = {
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        bezierCurve: true,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true,
        responsive: true,
        legend: {
            position: 'top'
        },
    };
    var lineData = {
        labels: ["5-15", "5-16", "5-17", "5-18", "5-19", "5-20", "5-21"],
        datasets: [
            {
                label: "出库数据",
                backgroundColor: "rgba(220,220,220,0.5)",
                borderColor: "rgba(220,220,220,1)",
                pointBackgroundColor: "rgba(220,220,220,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                data: [65, 59, 40, 51, 36, 25, 40]
            },
            {
                label: "入库数据",
                backgroundColor: "rgba(26,179,148,0.5)",
                borderColor: "rgba(26,179,148,0.7)",
                pointBackgroundColor: "rgba(26,179,148,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(26,179,148,1)",
                data: [48, 48, 60, 39, 56, 37, 30]
            }
        ]
    };


    $("#sparkline7").sparkline([2, 2], {
        type: 'pie',
        height: '140',
        sliceColors: ['#ed5565', '#F5F5F5']
    });

    var ctx = document.getElementById("lineChart").getContext("2d");
    var myNewChart = new Chart(ctx, {
        type: "line",
        data: lineData,
        options: lineOptions

    });

    var config = {
        type: 'doughnut',
        data: {
            datasets: [
                /* Outer doughnut data starts*/
                {
                    data: [
                        452,
                        250,
                        11
                    ],
                    backgroundColor: [
                        "rgba(26,179,148,0.5)", // red
                        "rgba(26,179,148,1)", // green
                        "#f8ac59", //blue
                    ],
                    label: '出库'
                },
                /* Outer doughnut data ends*/
                /* Inner doughnut data starts*/
                {
                    data: [
                        100,
                        200,
                        25
                    ],
                    backgroundColor: [
                        "rgba(26,179,148,0.5)", // red
                        "rgba(26,179,148,1)", // green
                        "#f8ac59", //blue
                    ],
                    label: '入库'
                }
                /* Inner doughnut data ends*/
            ],
            labels: [
                "未完成",
                "已完成",
                "异常"
            ]
        },
        options: {
            responsive: true,
            // maintainAspectRatio:false,
            aspectRatio:3,
            legend: {
                position: 'right',
            },
            title: {
                display: false,
                text: '出库入库情况'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            },
            tooltips: {
                callbacks: {
                    label: function(item, data) {
                        // console.log(data.labels, item);
                        return data.datasets[item.datasetIndex].label+ ": "+ data.labels[item.index]+ ": "+ data.datasets[item.datasetIndex].data[item.index];
                    }
                }
            },
            // hintText:"出库外侧，入库内测"
        }
    };

    var ctxEl = document.getElementById("radarChart");
    ctxEl.height=120;
    var ctx5=ctxEl.getContext("2d");
    new Chart(ctx5, config);

    __.dataTable("#tr-task-operation",{
        pageLength: 25,
        responsive: true,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
            { extend: 'copy'},
            {extend: 'csv'},
            {extend: 'excel', title: '数据导出'},
            {extend: 'pdf', title: '数据导出'},
            {extend: 'print',
                customize: function (win){
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }
        ]
    })
});