export default ($scope, $state, $stateParams, $source, systemResp , sysModelResp ) => {
    "ngInject";

    $scope.op = { createMap:true }


    // 获取 system
    $scope.system = systemResp.ret;
    $scope.sysModel = sysModelResp.ret ;

    // 获得 region 信息; 

    if ($scope.system.region_id) {
        $source.$region.get({
            pk: $scope.system.region_id
        }, function(resp) {
            $scope.region = resp.ret;
            $scope.system.region_name = resp.ret.name;
        })
    }
 

    // geteway时 还要加载 device ; 以后完善!!; 

    // tag panel 配置;  
    $scope.panel = {
        subject: $scope.system.name,
        tabs: [
            { title: "system.online", state: "app.m_system_attr.basic", icon: " icon icon-info " },
            { title: "system.config", state: "app.m_system_attr.config", icon: " icon icon-wrench " },
            { title: "tag.tag", state: "app.m_system_attr.tag", icon: " icon icon-bar-chart" },
            { title: "trigger.trigger", state: "app.m_system_attr.trigger", icon: " icon icon-rocket " },
            { title: "text.map", state: "app.m_system_attr.map", icon: " icon  icon-pointer " }
        ]
    }

    // 加载  sysmodel device ;
    var   holdSysDevice ;
    $scope.loadSysDevice = ()=>{
        return holdSysDevice = holdSysDevice   || $source.$sysDevice.get({ system_model: $scope.sysModel.uuid },(resp) => {
                $scope.sysDevices =   resp.ret || [];
                $scope.sysDevice_KV = {};
                $scope.sysDevices.forEach( (v)=>{
                    $scope.sysDevice_KV[ v.id ] =  v ;
                })
            }).$promise;
    }

    // 加载  sysmodel 的 profile ;
    var  holdProfile ; 

    $scope.loadProfile = ()=>{
        return  holdProfile = holdProfile ||
         $source.$sysProfile.get( 
            { system_model: $scope.sysModel.uuid } 
            , (resp)=>{
                $scope.profiles =  resp.ret.length ? resp.ret : undefined ;
   
            }
        ).$promise ;

    }





}
