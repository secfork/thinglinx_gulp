export default ($scope, $state, $stateParams, $source, systemResp) => {
    "ngInject";


    // 获取 system
    $scope.system = systemResp.ret;

    // 获得 region 信息; 

    if ($scope.system.region_id) {
        $source.$region.get({
            pk: $scope.system.region_id
        }, function(resp) {
            $scope.region = resp.ret;
            $scope.system.region_name = resp.ret.name;
        })
    }

    // 获取 systemModel ; 
    $scope.loadSystemModel = $source.$sysModel.getByPk({
        pk: $scope.system.model
    }, (resp) => {
        $scope.systemModel = resp.ret;
    }).$promise;


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










}
