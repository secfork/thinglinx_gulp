
import objUtils from "../lib/utils/objUtils";


export default ($scope , $source , $modal , $q , $utils , $sys ,$state , $timeout ) => {
    "ngInject";


    $scope.isModelState = true ;

    var sysmodel = $scope.sysModel,  
        t = $scope;
        // 托管 ,非 托管 模式; 
    	t.isManageMode = sysmodel.mode == 1;

    // 拆分 connect 字段;
    // connect 回显 ;  device id ( 整合成 kv形式)--> 得到 demodel( ) --> 再去加载point数据;
    var cc;
    $scope.splictC = function(tag, $last) {
        cc = tag.connect.split('.');
        tag.dev_id = cc[0],
            tag.point_id = cc[0];
    };
  
    var dev_id, dev_ref;

    $scope.getDevName = function(tag, scope) {
        if (!tag.connect) return;

        dev_id = tag.connect.replace(/(\d+).(\d+)/, "$1");

        dev_ref = $scope.sysDevice_KV[dev_id],

            // 是否真的连接了设备, dev_name 来判断;
        scope.dev_name = dev_ref && dev_ref.name; 

        return  scope.dev_name ; 

        //@if  append
        console.log(" 查找 dev name =", scope.dev_name);

        //@endif

    }
 

    // 加载 sysDevice 组织 sysDevice 的kv 形式;
    $scope.loadSysDevice();


    // profile ng-chage ;   tag 比较特殊 没profile 也可以创建; 

    // $scope.showMask = true;
    $scope.loadSysTag = function(prof_uuid) {
        // { profile_id: $scope.profile }
        if (prof_uuid) {
            // 有profile时 ; 去检索是否连接了设备;
            var promise_tag = $source.$sysLogTag.get({
                profile: prof_uuid
            }).$promise;
            $q.all([promise_tag, $scope.loadSysDevice()]).then(function(resp) {
                    $scope.systags = resp[0].ret;

                    $scope.showMask = false;
                }
                //If any of the promises is resolved with a rejection,
                // this resulting promise will be rejected with the same rejection value.
                ,
                function() {
                    $scope.showMask = false;
                }
            )
        } else {
            // query ; 无profile时 ;  跟定不连接  设备;
            $source.$sysTag.get({
                system_model: sysmodel.uuid
            }, function(argument) {
                $scope.systags = argument.ret;

                $scope.showMask = false;
            }, function() {
                $scope.showMask = false;
            })
        }
    }

    // 加载 点;
    $scope.loadProfile().then(function() {
        $scope.loadSysTag($scope.op.profile_id);
    });

    //  manage 模式时 ,  tag 的编辑, 新建; 增加 dev , devModelPoint 联动;
    function ApplyDevPoint(scope) {
        var oldDevModel;

        scope.op = {};

        //zai 父scope中添加 sysdevices ;
        var promise = $scope.loadSysDevice();


        // bool 是否去初始化point ;
        scope.loadPoint = function(dev) {
            if (!dev) return;
            if (dev.device_model == oldDevModel) return;

            scope.showMask = true;
            oldDevModel = dev.device_model;
            var promise;
            promise = $source.$dmPoint.get({
                device_model: oldDevModel
            }).$promise;

            promise.then(function(resp) {
                scope.points = resp.ret;
                //if ( scope.isAdd ) {
                var p = resp.ret[0];
                scope.op.point = p && (p.id + "&" + p.name);
                scope.isAdd && (scope.T.name = p && p.name);
                // }
                scope.showMask = false;
            }, function() {
                scope.showMask = false;
            })
            return promise;
        };

        // 拼接  connnet  字段;
        scope.addConnect = function(tag) {
            // tag.connect = scope.op.dev.id + "." + scope.op.point.id;
            tag.connect = scope.op.dev.id + "." + scope.op.point.replace(/(.+)&(.+)/, '$1');

        };

        return promise;
    }

 

    // 创建 点 , 带 log 部分;
    $scope.addTag = function() {

        if (!$scope.profiles.length) {
            // angular.alert("请先创建系统配置!");
            angular.alert("profile.frist");
            // $state.go('app.model.sysprofile');
            return;
        }

        $modal.open({
            templateUrl: "app/model_system/sysmodel_attr_tag_add.html",
            controller: function($scope, $modalInstance) {

                if (t.isManageMode) { // 托管模式;
                    ApplyDevPoint($scope);
                }

                $scope.cancel = $modalInstance.dismiss ,
                $scope.__proto__ = t ,
                $scope.isAdd = true ,

                $scope.T = {
                    type: undefined
                } ,
                $scope.L = {
                    deviation: 0,
                    scale: 1
                } ;

                $scope.$watch("L.log_type", function(n, o) {
                    if (n == "RAW") {
                        $scope.L.log_cycle = 300
                    }
                })

                $scope.copyName = function() {
                    $scope.T.name = $scope.op.point.replace(/(.+)&(.+)/, "$2");
                    // isAdd && ( T.name = op.point.name )
                }

                $scope.done = function() {
                    // 验证表格;
                    $scope.validForm("form_tag");

                    $scope.T.system_model = sysmodel.uuid;

                    $scope.addConnect && $scope.addConnect($scope.T);

                    // 组装 connect 字段 的值;
                    // 先保存点, 在保存log数据;
                    $source.$sysTag.save($scope.T, function(resp) {


                        function call() {
                            var d;
                            if ( $scope.profiles.length ) {
                                d = angular.extend($scope.T, $scope.L);
                            } else {
                                d = angular.extend($scope.T, {
                                    id: resp.ret
                                })
                            }
                            $scope.systags.push(d);
                            $scope.cancel();
                        }
 
                        if (  $scope.profiles.length ) { // 日志参数;
                            $scope.L.id = resp.ret,
                                $scope.L.profile = t.op.profile_id ,
                                // $scope.L.save_log = $scope.L.log_cycle ? 1 : 0;
                                $source.$sysLogTag.save( $scope.L, call , $utils.handlerRespErr );
                        } else {
                            call()
                        }
                    });
                };
            }
        });
    }

    // 编辑点; 不带 log ;
    $scope.updateTag = function(index, tag, scope) {
        $modal.open({
            templateUrl: "app/model_system/sysmodel_attr_tag_add.html",
            controller: function($scope, $modalInstance) {
                var a, b, c, d, dd, dt;

                $scope.cancel = $modalInstance.dismiss ;
                $scope.__proto__ = t,
                $scope.T = a = angular.copy(tag);

                 // 是否 连接上了 设备;
                $scope.true_conn = scope.true_conn;

                // dev , point 回显 待定;  conncet 是 id 还是那么;

                if (t.isManageMode) { // 托管模式;

                    // 非托管的无 connect 字段;
                    d = a.connect.split("."),
                        dd = d[0],
                        dt = d[1]; 

                    // ApplyDevPoint 会初始化第一个point名字;
                    ApplyDevPoint($scope).then(function() {

                        $.each($scope.sysDevices, function(i, v) {
                            if (v.id == dd) {
                                $scope.op.dev = v;
                                return false;
                            }
                            return true;
                        });

                        $scope.op.dev && $scope.loadPoint($scope.op.dev).then(function() {

                            $.each($scope.points, function(i, v) {
                                if (dt == v.id) {
                                    $scope.op.point = v.id + "&" + v.name;
                                    return false;
                                }
                                return true;

                            })
                        });

                    })
                } ;



                $scope.done = function() {
                    // 验证表格;
                    $scope.validForm("form_tag");

                    var d = objUtils.copyProp(a, 'system_model', 'id', 'name', 'type', 'desc');

                    $scope.addConnect && $scope.addConnect(d);

                    $source.$sysTag.put(d, function(resp) {
                        if (t.isManageMode) {
                            // 连接上了 设备;
                            scope.$parent.true_conn = true;
                            scope.$parent.dev_name = $scope.sysDevice_KV[$scope.op.dev.id].name;
                        }

                        angular.extend(tag, d);
                        $scope.cancel();
                    })
                }
            }
        })
    }

    $scope.deleteTag = function(index, tag) {
        //@if  append

        console.log("deleteTag");
        //@endif
        angular.confirm({ 
            warn: [ 'tag.warnDelTag' , tag.name ] // "删除变量将会丢失此变量的全部历史数据!"
        }, function(next) {
            $source.$sysTag.delete({
                system_model: sysmodel.uuid,
                id: tag.id
            }, function(resp) {
                $scope.systags.splice(index, 1);
                next();
            }, next)
        })
    }

    //==================================================================

    //  编辑 log 部分 ;
    $scope.editLogPart = function(index, tag) {

        if (! $scope.profiles.length ) {
            // angular.alert(frist"请先创建 系统配置!");
            
            angular.alert("profile.frist");
            // $state.go('app.model.sysprofile');
            return;
        } 

        $modal.open({
            templateUrl: "app/model_system/sysmodel_attr_tag_log_edit.html" ,
             
            controller: function($scope, $modalInstance) {

                var a, b, c, d;

                console.log(tag);

                $scope.hasLog = b = tag.profile;

                $scope.cancel = $modalInstance.dismiss ,
                    $scope.__proto__ = t,
                    $scope.L = a = angular.copy(tag),
                    $scope.T = angular.copy(tag);

                // ng-init=" L.log_cycle = '300' " 
                if (b) {
                    $scope.L.log_cycle = $scope.L.log_cycle  || 300;
                } else {
                    $scope.L.log_cycle = 300;

                }

                $scope.done = function() {
                    $scope.validForm("form_log"),
                        // $scope.L.save_log = $scope.L.log_cycle ? 1 : 0;
                        $scope.L.id = tag.id;

                    d = {
                        id: a.id,
                        tp_desc: a.tp_desc,
                        //profile: t.odp.puuid, //profile  read-only
                        unit: a.unit,
                        scale: a.scale,
                        deviation: a.deviation,
                        save_log: a.save_log,
                        log_cycle: a.log_cycle,
                        log_type: a.log_type
                    };

                    // 更新;
                    if (b) {
                        d.profile = a.profile;
                        $source.$sysLogTag.put(d, function() {
                            angular.extend(tag, d);

                        })
                    } else { // 新建 log ;
                        d.profile = t.odp.puuid;
                        $source.$sysLogTag.save(d, function() {
                            angular.extend(tag, d);
                        })
                    }
                    $scope.cancel();
                }


            }
        });
    }



}
