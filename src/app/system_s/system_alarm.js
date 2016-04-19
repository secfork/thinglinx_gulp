

export default ( $scope, $show, $interval, $modal, $sys, $state )=>{
	"ngInject";

// var interval;
    $scope.page = {};

    // $scope.$on("$destroy", function() {
    //     $interval.cancel(interval);
    // });



    var od = {
        uuid: $scope.system.uuid
    };

    $scope.$watch("op.ala", function(n) {
        //@if  append
        console.log(n);
        //@endif

        if (n == 'a') {
            $scope.loadPageData(1);
        } else {
            $scope.page.data = [];
            $scope.page.total = 0;
            $scope.page.currentPage = 0;
        }

    });

    // 查询活跃 报警;  未确认的;
    $scope.getActiveAlarm = function(pageNo, $dom) { // 一般值 interval是, 切换是调用;
        var pg = {
            currentPage: pageNo,
            itemsPerPage: $sys.itemsPerPage
        };

        $scope.showMask = true;
        $show.alarm.get(angular.extend(od, pg), function(resp) {

            if ($dom) {
                $dom.toggleClass("show");
            }
            $scope.page.data = resp.data;
            $scope.page.total = resp.total;
            $scope.page.currentPage = pageNo;
            if (!resp.data.length) {
                // angular.alert({
                //     title: "无活跃报警数据"
                // })
            };
            $scope.showMask = false;
        }, function() {
            $scope.showMask = false;
        })
    }

    $scope.loadPageData = function(pageNo, $event) {

        if (!pageNo) {
            return;
        }
        var $dom;


        if ($event) {
            $dom = $($event.currentTarget).find("i");
            $dom.toggleClass("show");

        }


        if ($scope.op.ala == "a") { // 活跃报警
            $scope.getActiveAlarm(pageNo, $dom);
        } else { //  全部活跃;
            $scope.queryAlarm(pageNo, $dom);
        }
    }


    // 点击按钮 查询全部报警;
    $scope.queryAlarm = function(pageNo, $dom) {
        var d = {},
            op = $scope.op;
        d.start = op.start.getTime(),
            d.end = op.end.getTime();

        if (d.start > d.end) {
            angular.alert("起始时间不可超前与结束时间!");
            return;
        }

        //@if  append
        console.log(d);
        //@endif
        //var  pg = { currentPage: pageNo ,  itemsPerPage : $sys.itemsPerPage  };
        d.uuid = $scope.system.uuid,
            d.currentPage = pageNo,
            d.itemsPerPage = $sys.itemsPerPage;

        $scope.showMask = true;
        $show.alarm.save(d, null, function(resp) {
            if ($dom) {
                $dom.toggleClass("show");
            }

            $scope.page.data = resp.data;
            $scope.page.total = resp.total;
            $scope.page.currentPage = pageNo;
            if (!resp.data.length) {
                angular.alert({
                    title: "无报警数据"
                })
            }
            $scope.showMask = false;
        }, function() {
            $scope.showMask = false;
        })
    }



}