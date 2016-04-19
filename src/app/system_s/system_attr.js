

export default ( $scope  , systemResp  , $source  , $show  , $interval , $sys )=>{
	"ngInject";



	$scope.panel = {
		subject: "",
		tabs:[
			{ title:"system.info" , state:"app.s_system_attr.info" ,  icon:"icon icon-info"},
			{ title:"system.current" , state:"app.s_system_attr.current" ,  icon:"icon icon-graph"},
			{ title:"system.history" , state:"app.s_system_attr.history" ,  icon:"fa fa-history"},
			{ title:"nav.alarm" , state:"app.s_system_attr.alarm" ,  icon:"icon icon-fire"},
			{ title:"text.map" , state:"app.s_system_attr.map" ,  icon:"icon icon-pointer"}
		]
	}

	// system ; 
	$scope.system = systemResp.ret ;
	
    $scope.tags = $scope.system.tags;




    // 加载 region 信息; 
    $source.$region.get({
        pk: $scope.system.region_id
    }, function(resp) {
        $scope.system.region_name = resp.ret.name;
    })


    // 加载  活活报警数; 
    $show.alarm.get({
        uuid: $scope.system.uuid,
        op: "total",
        active: 1
    }, function(resp) {
        $scope.totalAlarm_act = resp.ret;
    })

    // 加载 最后报警; 
    $show.alarm.get({
        uuid: $scope.system.uuid,
        op: "lastalarm"
    }, function(resp) {
        $scope.lastAlarm = resp.ret[0];
    })



    // 获取在线状态;  
    function getState() {
        $source.$system.status([$scope.system.uuid], function(resp) {
            var state = resp.ret[0];
            $scope.system.online = state && (state.daserver ? state.daserver.logon : state.online);
        })
    }
    getState();

    // 每分钟更新次 在线状态; 
    var state_interval;
    state_interval = $interval(getState, $sys.state_inter_time);

    $scope.$on("$destroy", function() {
        $interval.cancel(state_interval);
    })
 


    var sysModel = $scope.system.model,
        //td = $filter("date")(new Date(), "yyyy-MM-dd"),
        arr, d;

    // 加载模型来干什么?
    //  0: 展示不需要列出系统引用那个模型;
    //  1: 获得模式来判断是否能下置点数据;
    $source.$sysModel.getByPk({
        pk: sysModel
    }, function(resp) {
        $scope.systemModel = resp.ret;
        //$scope.system.network = angular.fromJson( $scope.system.network);
    })


    $scope.op = {
        start: "",
        num: 400, // 查询点历史 返回条数;
        end: new Date(),
        start: new Date(new Date() - 86400000),
        ala: "a", // a: 实时报警; b: 历史报警;
        pointSize: 60, // 曲线上的点数;
        c_int: 10000, // 实时数据 interval 时间;
        a_int: 10000, // 实时报警; interva 时间;
        progValue: 0
    };

    // $scope.openCalendar = function(e, exp) {




    $scope.openCalendar = function(e, exp) {
        e.preventDefault();
        e.stopPropagation();

        this.$eval(exp);
    };


    $scope.goHis = function(t) {
        $scope.op.his_tag = t;
        $state.go('app.s_system_prop.history');
    }

    //  var map = new BMap.Map("l-map");
    // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
    // // 创建地理编码实例
    if ($scope.system.latitude) {
        var myGeo = new BMap.Geocoder();
        // // 根据坐标得到地址描述
        myGeo.getLocation(new BMap.Point($scope.system.longitude, $scope.system.latitude), function(result) {
            if (result) {
                console.log(result);
                $scope.$apply(function() {
                    $scope.system.map_address = result.address;
                })
            }
        });

    }




}