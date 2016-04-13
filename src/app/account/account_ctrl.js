




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
    $scope.daliyStat = { daily_alarms: 0, daily_emails: 0, daily_sms: 0, daily_wechats: 0 };
    $source.$account.daliyStatistic(function(resp) {
        var ret = resp.ret; 
        // 计算   alarm , emeail ..  使用百分比 ,  显示不同颜色;
        // ret.daily_sms_limit = 10 ;
        // ret.daily_sms = 9;

        ret.alarm_color =  caclColor( ret.daily_alarms_limit , ret.daily_alarms  );
        ret.email_color =  caclColor( ret.daily_emails_limit ,  ret.daily_emails );
        ret.sms_color =  caclColor( ret.daily_sms_limit ,  ret.daily_sms );
        ret.wechat_color =  caclColor( ret.daily_wechats_limit ,  ret.daily_emails );

        $scope.daliyStat =  ret ;    

    });

    function caclColor( total , use ){
            var  percent =   use/total ;
        return   percent < 0.5 ? "success": ( percent < 0.8? 'warning':"danger" )    
    }



}
