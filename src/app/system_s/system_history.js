
export default ( $scope, $show, $sys, $state  )=>{
	$scope.$on("$destroy", function() {
        $scope.op.his_tag = null;
    })


    var polt,
        plot_config = angular.copy($sys.plotChartConfig);

    $scope.initFlotChart = function(_plot_data) {

        //@if  append
        console.log(_plot_data);
        //@endif

        if ($scope.op.his_tag) {
            $scope.op.start = new Date(new Date() - 21600000);
            $scope.op.end = new Date();
            //$scope.queryData(1);
        } else {
            refreshChart('模拟点', true);
        }
        refreshChart('模拟点', true);
    }

    var btnType = 1; //标识点击了哪个按钮
    //左移时间
    $scope.leftTime = function() {

            if (btnType == 1 || btnType == 2) {
                $scope.op.end = new Date($scope.op.end.getTime() - 24 * 3600 * 1000);
            } else if (btnType == 3 || btnType == 4 || btnType == 5) {
                if ($scope.op.end.getMonth() == 0) {
                    $scope.op.end = new Date(($scope.op.end.getFullYear() - 1) + "/12/" + $scope.op.end.getDate());
                } else {
                    $scope.op.end = new Date($scope.op.end.getFullYear() + "/" + $scope.op.end.getMonth() + "/" + $scope.op.end.getDate());
                }
            } else if (btnType == 6) {
                $scope.op.end = new Date(($scope.op.end.getFullYear() - 1) + "/" + ($scope.op.end.getMonth() + 1) + "/" + $scope.op.end.getDate());
            }
            $scope.queryData(btnType);

        }
        //右移时间
    $scope.rightTime = function() {
        if (btnType == 1 || btnType == 2) {
            $scope.op.end = new Date($scope.op.end.getTime() + 24 * 3600 * 1000);
        } else if (btnType == 3 || btnType == 4 || btnType == 5) {
            if ($scope.op.end.getMonth() == 11) {
                $scope.op.end = new Date(($scope.op.end.getFullYear() + 1) + "/1/" + $scope.op.end.getDate());
            } else {
                $scope.op.end = new Date($scope.op.end.getFullYear() + "/" + ($scope.op.end.getMonth() + 2) + "/" + $scope.op.end.getDate());
            }
        } else if (btnType == 6) {
            $scope.op.end = new Date(($scope.op.end.getFullYear() + 1) + "/" + ($scope.op.end.getMonth() + 1) + "/" + $scope.op.end.getDate());
        }
        $scope.queryData(btnType);
    }


    $scope.dateStr = new Date().getFullYear() + "." + (new Date().getMonth() + 1) + "." + new Date().getDate();

    $scope.$watch('op.end', function(n, o) {
        if ($scope.changeTemp) {
            $scope.queryData(btnType);
        }
    }, true);

    $scope.$watch('op.his_tag', function(n, o) {
        $scope.queryData(btnType);
    }, true);

    //标示op.end是否是页面模型改变的
    $scope.changeTemp;

    $scope.queryData = function(num) {

        $scope.changeTemp = false;
        if (arguments.length == 2) {
            $scope.op.end = new Date();
        }

        if (!$scope.op.his_tag) {
            return;
        }
        //按钮变色处理
        $("button[data-name='" + num + "']").css({
            'background-color': '#edf1f2',
            'border-color': '#c7d3d6',
            'box-shadow': 'inset 0 3px 5px rgba(0, 0, 0, .125)'
        }).prop('disabled', true).siblings().css({
            'background-color': '#fff',
            'border-color': '#dee5e7',
            'box-shadow': '0 1px 1px rgba(90,90,90,0.1)'
        }).prop('disabled', false);

        if ($scope.op.end.getTime() > (new Date().getTime())) {
            angular.alert("结束时间不能晚于当前时间");
            $scope.op.end = new Date();
        }



        var curdate = new Date();
        var now = {
            year: curdate.getFullYear(),
            month: curdate.getMonth() + 1,
            day: curdate.getDate(),
            time: curdate.getTime()
        }

        var op = $scope.op;
        var start;
        var end = op.end.getTime();
        var count;


        if (num == 1) { //1天
            if (now.time - op.end.getTime() < 24 * 3600 * 1000) { //当天
                start = new Date(now.year + "/" + now.month + "/" + now.day).getTime();
                end = now.time;
                $scope.dateStr = new Date(end).getFullYear() + "." + (new Date(end).getMonth() + 1) + "." + new Date(end).getDate();
            } else {
                start = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 1) + "/" + op.end.getDate()).getTime();
                end = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 1) + "/" + op.end.getDate()).getTime() + 24 * 3600 * 1000;
                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "." + new Date(start).getDate();
            }
            count = 1500;
            btnType = 1;



        } else if (num == 2) { //7天
            if (now.time - op.end.getTime() < (24 * 3600 * 1000)) { //当天
                start = new Date(now.year + "/" + now.month + "/" + now.day).getTime() - 6 * 24 * 3600 * 1000;
                end = now.time;
                end = end - ((end - start) % (30 * 60 * 1000));
                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "." + new Date(start).getDate() + "-" +
                    new Date(end).getFullYear() + "." + (new Date(end).getMonth() + 1) + "." + new Date(end).getDate();
            } else {
                end = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 1) + "/" + op.end.getDate()).getTime() + 24 * 3600 * 1000;
                start = end - 7 * 24 * 3600 * 1000;
                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "." + new Date(start).getDate() + "-" +
                    new Date(end - 24 * 3600 * 1000).getFullYear() + "." + (new Date(end - 24 * 3600 * 1000).getMonth() + 1) + "." + new Date(end - 24 * 3600 * 1000).getDate();
            }
            count = parseInt((end - start) / (30 * 60 * 1000));
            btnType = 2;

        } else if (num == 3) { //1月
            if ((op.end.getFullYear() == now.year) && (op.end.getMonth() + 1 == now.month)) { //当月
                start = new Date(now.year + "/" + now.month).getTime();
                end = now.time;
                end = end - ((end - start) % (2 * 3600 * 1000));
                $scope.dateStr = new Date(end).getFullYear() + "." + (new Date(end).getMonth() + 1);
            } else {
                start = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 1)).getTime();
                //处理12月
                if (op.end.getMonth() == 11) {
                    end = new Date((op.end.getFullYear() + 1) + "").getTime();
                } else {
                    end = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 2)).getTime();
                }
                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1);

            }
            count = parseInt((end - start) / (2 * 3600 * 1000));
            btnType = 3;


        } else if (num == 4) { //3月
            if ((op.end.getFullYear() == now.year) && (op.end.getMonth() + 1 == now.month)) { //当月
                //处理1，2月份
                if (now.month <= 2) {
                    start = new Date((now.year - 1) + "/" + (10 + now.month)).getTime();
                } else {
                    start = new Date(now.year + "/" + (now.month - 2)).getTime();
                }
                end = now.time;
                end = end - ((end - start) % (6 * 3600 * 1000));

                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "-" +
                    new Date(end).getFullYear() + "." + (new Date(end).getMonth() + 1);
            } else {
                //处理1，2月份
                if (op.end.getMonth() < 2) {
                    start = new Date((op.end.getFullYear() - 1) + "/" + (11 + op.end.getMonth())).getTime();
                } else {
                    start = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() - 1)).getTime();
                }
                //处理12月
                if (op.end.getMonth() == 11) {
                    end = new Date((op.end.getFullYear() + 1) + "").getTime();
                } else {
                    end = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 2)).getTime();
                }

                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "-" +
                    op.end.getFullYear() + "." + (op.end.getMonth() + 1);
            }
            count = parseInt((end - start) / (6 * 3600 * 1000));
            btnType = 4;

        } else if (num == 5) { //6月
            if ((op.end.getFullYear() == now.year) && (op.end.getMonth() + 1 == now.month)) { //当月
                //处理1，2,3,4,5月份
                if (now.month <= 5) {
                    start = new Date((now.year - 1) + "/" + (7 + now.month)).getTime();
                } else {
                    start = new Date(now.year + "/" + (now.month - 5)).getTime();
                }
                end = now.time;
                end = end - ((end - start) % (12 * 3600 * 1000));
                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "-" +
                    new Date(end).getFullYear() + "." + (new Date(end).getMonth() + 1);
            } else {
                //处理1，2,3,4,5月份
                if (op.end.getMonth() < 5) {
                    start = new Date((op.end.getFullYear() - 1) + "/" + (8 + op.end.getMonth())).getTime();
                } else {
                    start = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() - 4)).getTime();
                }
                //处理12月
                if (op.end.getMonth() == 11) {
                    end = new Date((op.end.getFullYear() + 1) + "").getTime();
                } else {
                    end = new Date(op.end.getFullYear() + "/" + (op.end.getMonth() + 2)).getTime();
                }
                $scope.dateStr = new Date(start).getFullYear() + "." + (new Date(start).getMonth() + 1) + "-" +
                    op.end.getFullYear() + "." + (op.end.getMonth() + 1);
            }
            count = parseInt((end - start) / (12 * 3600 * 1000));
            btnType = 5;


        } else if (num == 6) { //1年
            if (op.end.getFullYear() == now.year) { //当年
                start = new Date(now.year + "").getTime();
                end = now.time;
                end = end - ((end - start) % (24 * 3600 * 1000));
                $scope.dateStr = new Date(start).getFullYear();
            } else {
                start = new Date(op.end.getFullYear() + "").getTime();
                end = new Date(op.end.getFullYear() + 1 + "").getTime();
                $scope.dateStr = new Date(start).getFullYear();
            }
            count = parseInt((end - start) / (24 * 3600 * 1000));
            btnType = 6;
        }
        var json = {
            start: start,
            end: end,
            count: count
        }
        $scope.queryHistory(json);

    }



    $scope.queryHistory = function(json) { //arr：时间戳列表

        $scope.validForm();

        //页面的模型
        var op = $scope.op;
        //请求参数
        var d = {};
        d.uuid = $scope.system.uuid;
        d.tag = op.his_tag.name;
        d.mode = op.his_tag.type == 'Analog' ? 'linear' : 'last_value';
        d.start = json.start;
        d.end = json.end;
        d.count = json.count;
        // 历史数据;
        //  intervali =  ts ,  readRow  = rcv ;

        $scope.showMask = true;

        $show.his.get(d, function(resp) {

            //highchart需要的数据
            var arr = [];
            if (resp.ret[0].length > 0) {
                //遍历ret组成arr
                for (var x = 0; x < resp.ret[0].length; x++) {
                    var cArr = [];
                    if (d.end - d.start < 2 * 24 * 3600 * 1000) { //如果是一天，采用的rcv时间戳
                        cArr[0] = resp.ret[0][x].rcv;
                    } else {
                        cArr[0] = resp.ret[0][x].ts;
                    }
                    cArr[1] = resp.ret[0][x].pv;
                    arr[x] = cArr;
                }
                //type标示是否是阶越曲线
                var type = d.mode == 'linear' ? false : true;

                refreshChart(d.tag, type, arr);

            } else {
                $scope.showMask = false;
                clearChart();
                angular.alert('当前时间段，无历史数据，请选择其他时间')
            }

        }, function() {
            $scope.showMask = false;
        });
    }



    //    如果变量数据类型为analog，绘制成趋势曲线
    //    如果变量数据类型为digital，绘制成阶越曲线 (  0 ,1 整型; )
    var chart;

    function refreshChart(tag, type, arr) {
        Highcharts.setOptions({
            global: {
                useUTC: false
            },
            lang: {
                //reset zoom按钮title
                resetZoom: '重置'
            }
        });
        $('#show_live_data').highcharts({
            chart: {
                zoomType: 'x',
                events: {
                    load: function() {
                        $scope.showMask = false;
                    }
                }
            },
            title: {
                text: false
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        '<b>' + this.series.name + '</b>：' + this.y;
                }
            },
            credits: {
                enabled: false
            },
            //导出
            exporting: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                name: tag,
                step: type,
                data: arr
            }]
        });
        chart = $('#show_live_data').highcharts();
    }

    function clearChart() {
        if (!chart) {
            chart = $('#show_live_data').highcharts();
        }
        if (chart.series.length != 0) {
            for (var i = 0; i < chart.series.length; i++) {
                chart.series[i].remove();
            }
        }
    }
}