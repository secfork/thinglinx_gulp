
export default ( $scope, $source, $modal, $state, $q, $sys, $utils  )=>{
	"ngInject";


  	var sysModel = $scope.sysModel,
        S = $scope;
    // tags_nv,
    // tags_arr;

    $scope.byte = 32; // 32 位 报警;


    console.log(2222222222222 , sysModel )


    $scope.isModelState  = $state.current.isModelState ;


    // 加载 Tag 数据; 
    // 1: 创建 sysModel trigger 使用,
    // 2: 展示 system 的triger 时 判断 tag 是否还还在,tag 点是否有被误删掉; 
    var loadTagPromise = $source.$sysTag.get({
                                system_model: sysModel.uuid
                            }, (resp) => {
                                $scope.tags_arr = resp.ret;
                                $scope.tags_nv = {};
                                $scope.tags_arr.forEach(function(v, i, ar) {
                                    $scope.tags_nv[v.name] = v;
                                });
                            }).$promise;



    // loadTagPromise.then(function(resp) {
    //     $scope.tags_arr = resp.ret;
    //     $scope.tags_nv = {};
    //     $scope.tags_arr.forEach(function(v, i, ar) {
    //         $scope.tags_nv[v.name] = v;
    //     });
    // })

    function condition_parmas_tojson(x) {
        x.conditions = angular.fromJson(x.conditions);
        x.params = angular.fromJson(x.params);
    }


    $scope.page = {};
    // 加载triger ;
    // var lose_tag = { 'background-color':'grey' };
    $scope.loadPageData = function(pageNo) {
        var prof_id = $scope.system ? $scope.system.profile : $scope.op.profile_id ;  //odp.puuid;
        if (!prof_id) return;
        var d = {
            profile: prof_id
        };
        d.currentPage = pageNo,
            d.itemsPerPage = $sys.itemsPerPage;

        $scope.showMask = true;

        $q.all([
            $source.$sysProfTrigger.get(d).$promise,
            loadTagPromise
        ]).then(function(resp) {
            var p = resp[0];
            p.data.forEach(function(t) {


                condition_parmas_tojson(t);

                // 检查tag是否存在;

                angular.isArray(t.conditions) && t.conditions.forEach(function(v) {
                    var left = v.exp.left,
                        right = v.exp.right;
                    if (left.fn == "PV" && !$scope.tags_nv[left.args]) {
                        left.args = null;
                        // t.lose_tag = lose_tag ;

                    }
                    if (right.fn == "PV" && !$scope.tags_nv[right.args]) {
                        right.args = null;
                        // t.lose_tag = true ;
                    }

                })
            })

            $scope.page.data = p.data,
                $scope.page.currentPage = pageNo,
                $scope.page.total = p.total;

            $scope.showMask = false;
        }, function() {
            $scope.showMask = false;
        })
    }


    $scope.loadProfile().then(function() {
        $scope.loadPageData(1);
    });



    $scope.deleteTrigger = function( t , i ) {
        angular.confirm({
           // title: "删除触发器: " + t.name,
            //warn: "您确认要删除该触发器: %s ?"
            warn: [ 'trigger.warnDel' , t.name ]
        }, function(n) {
            $source.$sysProfTrigger.delete({
                profile: t.profile,
                id: t.id
            }, function(resp) {
                $scope.page.data.splice(i, 1);
                n();
            }, $utils.handlerRespErr )
        })
    }

    // 创建 , 编辑 触发器;
    $scope.c_u_Trigger = function( trigger , index) {
        if (!$scope.profiles.length) {
            // angular.alert("请先创建 系统配置!");
            angular.alert( "profile.frist");
            
            $state.go('app.model.sysprofile');
            return;
        }

        $modal.open({
            templateUrl: "app/model_system/sysmodel_attr_trigger_add.html", 
            size: "lg",
            controller: function($scope, $modalInstance, $source, $sys ) {
                var a, b, c, i;
                $scope.isAdd = i = !trigger ,

                    $scope.__proto__ = S,
                    $scope.cancel = $modalInstance.dismiss ;

                if (i) { // 创建;
                    $scope.T = a =  angular.extend( 
                            { profile: S.op.profile_id } , 
                            $sys.triggerEntity ,
                            { conditions: [ $sys.triggerConditonEntigy ] } 
                        )

 
                } else {
                    $scope.T = a = angular.copy(trigger);
                }


                // 初始化 trigger的 params 参数; 
                $scope.initActionParams  = ( params )=>{ 
                    $scope.T.params = $scope.T.params || angular.copy( params); 

                };

                $scope.done = function() {
                    var x = angular.copy($scope.T),
                        l,
                        r,
                        tags = {};

                    // 收集 tags ;
                    angular.forEach(x.conditions, function(v, k) {
                        l = v.exp.left,
                            r = v.exp.right;

                        if (l.fn == "PV") {
                            tags[l.args] = true;
                        }
                        if (r.fn == "PV") {
                            tags[r.args] = true;
                        }

                    });

                    x.conditions = angular.toJson(x.conditions),
                        x.params.tags = Object.keys(tags),
                        x.params = angular.toJson(x.params);



                    if (i) { // 新建;
                        $source.$sysProfTrigger.save(x, function(resp) {
                            condition_parmas_tojson(x);

                            x.id = resp.ret;
                            $scope.page.data.unshift(x);
                            $scope.cancel();
                        })
                    } else { // 更新;
                        $source.$sysProfTrigger.put(x, function(resp) {
                            condition_parmas_tojson(x);

                            $scope.page.data[index] = x;
                            $scope.cancel();
                        })
                    }
                }

                $scope.appendVerb = function() {
                    var verb = a.conditions.length ? 'or' : null;

                    a.conditions.push(angular.extend({  verb: verb } , $sys.trigger.conditon_entigy)  );
                }

                $scope.delVerb = function(index) {
                    a.conditions.splice(index, 1);
                    if (0 == index)
                        a.conditions[0].verb = null;
                }

            }
        })
    }

    // 显示 触发器的 , 将 trigger 的 condition 拼接成  string  ;
    $scope.conditions = $utils.triggerConditions;


    // prof alarm  params  为报警时! 验证十六进制 数;
    var regex = /^[0-9a-fA-F]$/;
    $scope.cc = function($scope) {
        //位 报警时 才验证;
        if (!$scope.T.params) return;
        var byte = $scope.byte, // 位数;
            s = $scope.T.params,
            l = s.length,
            n = byte / 4;
        if (l > n) {
            $scope.T.params = s.substring(0, n).toUpperCase();
            return;
        }
        //验证字符合法;
        var char = s.charAt(l - 1);
        if (!regex.test(char)) {
            $scope.T.params = s.substring(0, l - 1).toUpperCase();
        } else {
            $scope.T.params = s.toUpperCase();
        }
    }



	
}