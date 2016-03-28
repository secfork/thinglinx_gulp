export default ($scope, $source) => {
    "ngInject";



    $scope.op = {} ;
  
    // 获得 sysmodel 配置项; 
    $scope.$parent.loadProfile = $scope.$parent.loadProfile ||  $source.$sysProfile.get({
        system_model: $scope.system.model
    }).$promise ;  

    $scope.loadProfile.then(function(resp) {
        $scope.profiles = resp.ret;

        var p_uuid = $scope.system.profile;
        $.each($scope.profiles, function(i, v, t) {
            if (v.uuid == p_uuid) {
                $scope.profile = v;
                return false ; 
            }
        })
    });



    //   就 托管 类型 的 DaServer 不用   ticket
    //  不需要 ticket 时 , 需要  配置Dtu ; 
    // ticket  DTU 互斥; 
    $scope.loadSystemModel.then( (resp)=>{
        var model =  $scope.systemModel  ; 
        $scope.needTicket = !(model.mode == 1 && model.comm_type == 1);
         console.log( $scope.needTicket )
    })
    



}
