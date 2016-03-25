




export default ( $scope, $state, $source, $show, $sys, $q, $filter , $utils ) =>{

	"ngInject";
 

    var S = $scope;

    $scope.openCalendar = function(e, exp) {
        e.preventDefault();
        e.stopPropagation();
        this.$eval(exp);
    };

    $scope.page = {};

    // 先加载 regions ;
    $source.$region.query({
        currentPage: 1
    }, function(resp) {
        $scope.regions = resp.data;
    })

    // 按需加载  system ;
    $scope.loadSys = function() {
 
        if (!$scope.od.region_id) {
            $scope.systems = [];
            $scope.od.system_id = undefined;
            return;
        };
        $scope.showMask = true;

        $source.$system.query({
            currentPage: 1,
            options: "query",
            isactive: 1,
            region_id: $scope.od.region_id
        }, function(resp) {
            $scope.systems = resp.data;
            $scope.showMask = false;

        }, function() {
            $scope.showMask = false;
        })
    }

    $scope.op = {
        active: "a" // 活跃报警，  b：全部报警； 
    };

    var activeAlarmData = {},
        allAlarmDate = {},
        _switch;


    $scope.$watch("op.active", function(n, o) {
        //$scope.page.data = [];
        //$scope.page.total = 0;
        //$scope.page.currentPage = 0; 
        if (n == 'a') {
            allAlarmDate = $scope.page || {};
            $scope.page = activeAlarmData;

        } else {

            activeAlarmData = $scope.page || {};
            $scope.page = allAlarmDate;

        }


    })



    $scope.od = {
        class_id: null, //0,
        severity: null, //'0',
        end: new Date(),
        start: new Date(new Date() - 86400000),
        region_id: undefined,
        system_id: undefined
    };

    // // 查询全部报警;

    $scope.loadPageData = function(pageNo) {
 
        if (!pageNo) {
            return;
        }

        $scope.validForm();
        var od = angular.copy($scope.od);

        od.desc = !!od.desc ? ("*" + od.desc + "*") : null;


        console.log(od)
        if (!od.start) {
            angular.alert("请输入起始时间");
            return;
        }
        if (!od.end) {
            angular.alert("请输入结束时间");
            return;
        }

        od.start = od.start.getTime(),
            od.end = od.end.getTime();



        if (od.start > od.end) {
            angular.alert("起始时间不可超前与结束时间");
            return;
        }

        od.itemsPerPage = $sys.itemsPerPage;
        od.currentPage = pageNo;

        // 活跃报警;
        od.active = $scope.op.active == "a" ? "1" : undefined;

        od.uuid = "query";

        $scope.showMask = true;

        $show.alarm.query(od, function(resp) {
            $scope.page.data = resp.data;
            $scope.page.total = resp.total;
            $scope.page.currentPage = pageNo;

            if (!resp.data.length) {
                angular.alert( "无报警数据" )
            }

            $scope.showMask = false;
        }, function() {
            $scope.showMask = false;
        })

    }
 
    // alarm 详细信息;

    $scope.alarmMsg = function(a) {
        $modal.open({
            templateUrl: "athena/show/alarm_msg.html",
            controller: function($scope, $modalInstance) {
                $scope.__proto__ = S;
                $scope.$modalInstance = $modalInstance;
                // $scope.done = $scope.cancel;
                $scope.alarm = a;
            }
        })
    };

    $scope.showAlarmMsg = function(alarm, system_id) {

        // 确认信息; 
        $show.alarm.getConformMsg({  ack_id: alarm.ack_id, system_id: alarm.system_id } , 
            function( resp ){
                var   conformMsg = resp.ret ; 
                // 确认人 信息; 
                conformMsg.user_id && $source.$user.get({
                    pk: conformMsg.user_id
                }, function(resp) {
                    conformMsg.username = resp.ret.username;

                    angular.alert( {
                        title:"alarm.info",
                        templateUrl: "app/alarm_s/alarm_info.html" ,
                        alarm: alarm ,
                        conformMsg: conformMsg 
                    })


                } , $utils.handlerRespErr);  
            },
            $utils.handlerRespErr 
        ); 
    }


   $scope.conformAlarm = function(page, alarm, index, system_id, active) {
        angular.open(
            {   title:  "alarm.confirm" , //"alarm.comfirm" ,
                templateUrl: "app/alarm_s/alarm_confirm.html",
            },
            function($scope,   $show) {
                "ngInject";
                // $scope.done = $scope.cancel;
                $scope.alarm = alarm;

                $scope.od = {
                    message: ""
                }

                $scope.done = function() {

                    $scope.validForm();
                    $show.alarm.conform(
                        angular.extend({
                            alarm_id: alarm.id,
                            system_id: alarm.system_id
                        }, $scope.od),
                        null,
                        function(resp) {
                            $scope.cancel();

                            alarm.active = -1;
                            alarm.ack_id = resp.ret;
                            alarm.close_time = new Date();

                            //angular.alert("确认报警成功");
                            page.total--;

                            if ("a" == active) {
                                page.data.splice(index, 1);
                            }


                        },
                        function( resp ) {
                            $scope.cancel();
                            $utils.handlerRespErr( resp );
                        })
                }

            }
        );

    }










}