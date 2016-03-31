



export default ( $scope  ,$source  , $utils ) => {
	"ngInject";
    var thatScope = $scope ;
	$scope.op = {}

	$scope.panel = {

		subject: "nav.systemModel",
		title:"nav.systemModel",

        panelBotButs: [
            {  text: "sysModel.create",
               classFor: " btn-primary",
               handler: createSysModel
          }
        ]
	};

    $scope.tableHeaders = [
        { text: "text.name", w: "20%"},
        { text: "sysModel.mode",  w: "20%"  },
        {  text: "sysModel.commType",  w: "20%" },
        {  text: "text.createTime",  w: "20%" },
        {  text: "text.lastUpdateTime",  w: "20%" },
        {  text: "sysModel.devNum",  w: "20%" },
        {  text: "sysModel.profileNum",  w: "20%" },
        {  text: "text.desc",   w: "20%"  },
        {  text: "text.del",  w: "15%"  }
    ]


    // 创建系统模型;
	function createSysModel() {
        angular.open(
            { title: "sysModel.create" , templateUrl:"app/model_system/sysmodel.add.html" } ,
             function(  $scope ){
                "ngInject";
                $scope.sm = { mode:1 , comm_type : 1 };


                $scope.done = function(){
                    $scope.validForm();
                     $source.$sysModel.save($scope.sm, function(resp) {
                            var d = {
                                uuid: resp.ret,
                                create_time: new Date(),
                                device_count: 0,
                                profile_count: 1
                            };

                            thatScope.page.data.push(angular.extend(d, $scope.sm));
                            $scope.cancel();
                    } , $utils.handlerRespErr );


                }

        })



	}

    $scope.updateSysModel = function( idobj ){
        return $source.$sysModel.put(null, idobj).$promise;
    }

    $scope.delSysModel = function(sm , index ){
            angular.confirm({
               // title: "删除系统模型: " + sm.name,
                warn:  [ 'sysModel.noteDel' , sm.name ] // "确认要删除该系统模型吗?"
            }, function(next) {
                $source.$sysModel.delete({
                    uuid: sm.uuid
                }, function(resp) {
                    $scope.page.data.splice(index, 1);
                    next();
                }, $utils.handlerErr )
            })


    }


	// 加载系统模型;

	$scope.showMask = true ;

	$source.$sysModel.get(  function(resp) {
   		$scope.showMask = false ;
        $scope.page =  {
                data: resp.ret
            }
        $scope.showMask = false;
    }, $utils.handlerErr );





}
