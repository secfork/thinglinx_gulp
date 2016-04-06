export default ($scope, $source, $utils, $modal , $sys ) => {
    "ngInject";

    var thatScope = $scope;
  
    
    $scope.loadSysDevice();
    $scope.loadDevModels();
               
    // create or update  sysDevice ;
    var  sysModel = $scope.sysModel;
    $scope.addOrEditDevice = function(devices, dev , index) {
        $modal.open({ 
                controller:  function($scope,  $modalInstance ) {
                     
                    // 是否为 gateway 模式;
                    $scope.isG = sysModel.comm_type == 2;

                    $scope.cancel = $modalInstance.dismiss;
                    $scope.isAdd =  !dev ; //!true ;

                    $scope.__proto__ = thatScope ;
                    // $scope.devModels =  devModelResp.ret;

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
                        
                        return  devModelId ? $scope.devModels_KV[ devModelId ] : $scope.devModels[0] ;

                    } 

                    if ($scope.isAdd) { // 新建;

                        // $scope.devModel = $scope.devModelKV[Object.keys($scope.devModelKV)[0]];
                       
                        // 初始化D;
                        $scope.D = angular.extend({
                                device_model:  undefined  //$scope.devModel.uuid
                            },
                            $sys.deviceEntity 
                            // $sys[$scope.devModel.driver_id].device.entity
                        ); 

                        // 监控 deviceModel 变化, 控制 sysdevice params 初始化值; 
                        $scope.$watch("D.device_model", function(n, o) {

                                $scope.devModel =  findDevModel(n);
                                $scope.D.params = undefined ; 
                                
                                angular.extend( $scope.D , 
                                    { device_model: $scope.devModel.uuid } ,
                                    $sys[$scope.devModel.driver_id].deviceEntity
                                ); 

                        })
 
                        // 托管; gateway模式;
                        if ( sysModel.mode == 1 && sysModel.comm_type == 2) {
                            $scope.D.network = {
                                type: "RS232"  // network type 默认 RS232 ;
                            };
                        }

                    } else { // 编辑; 
                        dev.network = angular.fromJson(dev.network || {});
                        dev.params = angular.fromJson(dev.params || {});

                        $scope.D = angular.copy(dev);
                        $scope.devModel =   findDevModel( $scope.D.device_model ) ; // $scope.devModelKV[$scope.D.device_model ];

                    }
 
                        // 添加 sysmodel device ;
                    $scope.done = function(btn) {
                        // 验证表格; 写在了 button ngclick 上 因为 step0.1.2 不定 ;
                        // $scope.validForm();

                        // 不是 gateway 删除 gatetway 字段;
                        if (!$scope.isG) {
                            delete $scope.D.network;
                        }

                        var d = angular.copy($scope.D);

                        d.system_model =  sysModel.uuid,
                            d.params = angular.toJson(d.params),
                            d.network = angular.toJson(d.network);

                        if ($scope.isAdd) { // 新建; 
                            $source.$sysDevice.save(d, function(resp) {

                                d.id = resp.ret;
                                devices.push(d); 
                                thatScope.sysDevice_KV[ d.id ] = d ; 

                                $scope.cancel();

                            } , $utils.handlerRespErr )

                        } else {
                            $source.$sysDevice.put(d, function(resp) {

                                devices[index] = d; 
                                thatScope.sysDevice_KV[ d.id ] = d ; 
                                
                                $scope.cancel();

                            } , $utils.handlerRespErr )
                        };
                    };
                },
                templateUrl: "app/model_system/sysmodel_attr_device_add.html",
                resolve:{
                    devModel: $scope.loadDevModels ,
                    devices : $scope.loadSysDevice 
                }
             
            }
        )
    }


    // 值 更新 desc 用;  免去更新  sysdevice_KV ;
    $scope.updateDevice = ( idObj )=>{ 
        return  $source.$sysDevice.put( idObj ).$promise ;
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

                delete $scope.sysDevice_KV[ sysd.id ] ;

                next();
            } , $utils.handlerRespErr)
        })
    }



}
