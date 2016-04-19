
export default ( $scope  , $source , $show )=>{
	"ngInject";


		// region ;
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
	
}