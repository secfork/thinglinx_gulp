export default ($scope , $source , $utils ) => {
    "ngInject";

    var thatScope = $scope ; 

    $scope.loadProfile.then(() => {

    	var  profiles = $scope.$parent.profiles ;


        $scope.addSysProfile = function() {  
            angular.open({
            		title:"sysModel.addProfile",
	                templateUrl: "app/model_system/sysmodel_attr_profile_add.html"
	            },
 				function($scope, $modalInstance) { 
                    "ngInject";
                    $scope.P = {}; 
                    $scope.done = function() {
                        // 验证表格;
                        $scope.validForm();
                        $scope.P.system_model = thatScope.sysModel.uuid;

                        $source.$sysProfile.save($scope.P, function(resp) {
                            $scope.P.uuid = resp.ret;
                            $scope.P.create_time = new Date();
                            //$scope.p.create_time = $filter("date")( new Date() , '2015-07-07T00:33:54.000Z' )  ;
                            // $scope.p.create_time =  $filter("date")( new Date() , 'yyyy-MM-07T00:33:54.000Z' )  ;
                            profiles.push(  $scope.P ); 
                            $scope.cancel();
                        })
                    }
                }
            )
        }


        $scope.updateSysProfile = function(idobj) {
            return $source.$sysProfile.put(idobj).$promise;
        };

        $scope.deleteSysProfile = function(s, i, p) {
            angular.confirm({
                title: "删除配置项: " + p.name,
                warn: "确认要删除该配置项吗?"
            }, function(n) {
                $source.$sysProfile.delete({
                    uuid: p.uuid
                }, function() {
                    profiles.splice(i, 1);

                    // if ($scope.odp.puuid == p.uuid) {
                    //     $scope.odp.puuid = $scope.profiles[0] && $scope.profiles[0].uuid;
                    // }
 
                    n();

                },  $utils.handlerErr )
            })
        }



    })
 
}
