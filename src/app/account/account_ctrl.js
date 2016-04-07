export default ($scope, $state, $source, $show, $q) => {
    "ngInject";



    $scope.od = {};

    // 账户信息;  
    $source.$user.get({
        pk: "getaccount",
        op: $scope.user.account_id
    }, function(resp) {
        $scope.account = resp.ret;
    })

    // 得到 区域 数目;
    $source.$region.get({
            op: "total"
        }, function(resp) {
            $scope.regionNum = resp.ret;
        })
        // 得到 用户数目;
    $source.$user.get({
        op: "total"
    }, function(resp) {
        $scope.userNum = resp.ret;
    })

    // 得到系统 激活 , 非激活 数据; 
    $q.all([
        $source.$system.get({
            pk: "total"
        }).$promise,
        $source.$system.get({
            pk: "total",
            state: 1
        }).$promise
    ]).then(function(resp) {
        $scope.totalSys = resp[0].ret || 0;
        $scope.totalSys_act = resp[1].ret || 0;
        $scope.initChart_sys = true;
    })


    // 得到  本周 报警  数目( 总数, 未处理数目 )
    var date = new Date();
    var d = {
        end: date.getTime(),
        start: date.RtnMonByWeekNum(date.getWeekNumber()) - 604800000
    };

    $q.all([
        $show.alarm.get(angular.extend({
            op: "total"
        }, d)).$promise,
        $show.alarm.get(angular.extend({
            op: "total",
            active: 1
        }, d)).$promise
    ]).then(function(resp) {
        $scope.totalAlarm = resp[0].ret || 0;
        $scope.totalAlarm_act = resp[1].ret || 0;
        $scope.initChart_alarm = true;
    })




    // 得到日 用量; 
    // $scope.daliyStat = { daily_alarms: 0, daily_emails: 0, daily_sms: 0, daily_wechats: 0 };
    // $source.$account.daliyStatistic(function(resp) {
    //     var ret = resp.ret;
    //     $scope.daliyStat = ret;


    // });




}
