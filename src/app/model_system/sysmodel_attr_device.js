export default ($scope, $source, $utils, $modal , $sys ) => {
    "ngInject";

    var thatScope = $scope;
    // 加载  sysmodel device ; 
    $scope.$parent.loadSysDevice = $scope.$parent.loadSysDevice ||
        $source.$sysDevice.get({ system_model: $scope.sysModel.uuid }, (resp) => {
            $scope.$parent.sysDevices = resp.ret;
        }).$promise;



    // create or update  sysDevice ;
    var  sysModel = $scope.sysModel;
    $scope.addOrEditDevice = function(devices, index, dev) {
        $modal.open({
                resolve: {
                    devModelResp: function() {
                        $scope.$parent.loadDevModels = $scope.$parent.loadDevModels ||
                            $source.$deviceModel.get((resp) => {
                                    

                            }).$promise;
                        return $scope.loadDevModels;
                    }
                },
                controller:  function($scope, devModelResp , $modalInstance ) {
                    


                    // 是否为 gateway 模式;
                    $scope.isG = sysModel.comm_type == 2;

                    $scope.cancel = $modalInstance.dismiss;
                    $scope.isAdd = true ;

                    $scope.devModels =  devModelResp.ret;

                    if (!$scope.devModels.length ) {
                        angular.alert(  "sysModel.devModelFirst!" );
                        $scope.cancel(); 
                        return ;
                    }
  
                    // gateway 网络参数 过滤;  bool 是否初始化 params 值;
                    $scope.filterChannel = function(type, bool) {

                        $scope._$channel = sysModel.gateway_default[type];

                        if (bool) {
                            var d;
                            if (type == "ETHERNET") {
                                d = "LAN_1";
                            } else {
                                if ($scope._$channel) {
                                    d = Object.keys($scope._$channel)[0];
                                } else {
                                    d = null;
                                }
                            }
                            $scope.D.network.params = {
                                channel: d
                            };
                        }
                    }

                    // 选择的是 哪个  devModel ; 
                    function findDevModel ( devModelId ){
                        
                        if(! devModelId){
                            return $scope.devModels[0];
                        }
                        var  d ; 
                        $.each( $scope.devModels , (i , v )=>{
                            if( v.uuid == devModelId){
                                d = v ;
                                return false ;
                            }
                        })
                        return d ; 
                    } 

                    if ($scope.isAdd) { // 新建;

                        // $scope.devModel = $scope.devModelKV[Object.keys($scope.devModelKV)[0]];
                       
                        // 初始化D;
                        $scope.D = angular.extend({
                                device_model:  undefined  //$scope.devModel.uuid
                            },
                            $sys.sysModelDevice 
                            // $sys[$scope.devModel.driver_id].device.entity
                        ); 

                        // 监控 deviceModel 变化, 控制 sysdevice params 初始化值; 
                        $scope.$watch("D.device_model", function(n, o) {

                                $scope.devModel =  findDevModel(n);
                                $scope.D.params = undefined ; 
                                
                                angular.extend( $scope.D , 
                                    { device_model: $scope.devModel.uuid } ,
                                    $sys[$scope.devModel.driver_id].device.entity
                                ); 

                        })
 
                        // 托管; gateway模式;
                        if ( sysModel.mode == 1 && sysModel.comm_type == 2) {
                            $scope.D.network = {
                                type: "RS232"  // network type 默认 RS232 ;
                            };
                        }

                    } else {
                        dev.network = angular.fromJson(dev.network || {});
                        dev.params = angular.fromJson(dev.params || {});

                        $scope.D = angular.copy(dev);
                        $scope.devModel = $scope.devModelKV[$scope.D.device_model];

                    }
 
                        // 添加 sysmodel device ;
                    $scope.done = function(btn) {
                        // 验证表格;
                        $scope.validForm();

                        // 不是 gateway 删除 gatetway 字段;
                        if (!$scope.isG) {
                            delete $scope.D.network;
                        }

                        var d = angular.copy($scope.D);

                        d.system_model = $scope.sysmodel.uuid,
                            d.params = angular.toJson(d.params),
                            d.network = angular.toJson(d.network);

                        if ($scope.isAdd) {
                            $source.$sysDevice.save(d, function(resp) {

                                d.id = resp.ret;
                                $scope.sysdevices.push(d);
                                $scope.cancel();

                            })

                        } else {
                            $source.$sysDevice.put(d, function(resp) {

                                devices[index] = d;
                                $scope.cancel();

                            })
                        };
                    };
                },
                templateUrl: "app/model_system/sysmodel_attr_device_add.html",
             
            }
        )
    }



    // 删除  sysdevice ; 
    $scope.deleteSysD = function(sysDevices, sysd, index) {
        angular.confirm({
            title: "删除系统设备: " + sysd.name,
            note: "确认要删除该设备吗?"
        }, function(next) {
            $source.$sysDevice.delete({
                system_model: $scope.sysModel.uuid,
                id: sysd.id
            }, function() {
                sysDevices.splice(index, 1);
                next();
            }, $utils.handlerErr)
        })
    }



}
