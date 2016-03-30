
export default ( $scope, $source, $modal, $state, $q, $sys, $utils  )=>{
	"ngInject";


  	var sysmodel = $scope.sysModel,
        S = $scope;
    // tags_nv,
    // tags_arr;

    $scope.byte = 32; // 32 位 报警;


    // 加载 Tag 数据; ;

    var loadTagPromise = $source.$sysTag.get({
        system_model: sysmodel.uuid
    }).$promise;

    loadTagPromise.then(function(resp) {
        $scope.tags_arr = resp.ret;
        $scope.tags_nv = {};
        $scope.tags_arr.forEach(function(v, i, ar) {
            $scope.tags_nv[v.name] = v;
        });
    })

    function condition_parmas_tojson(x) {
        x.conditions = angular.fromJson(x.conditions);
        x.params = angular.fromJson(x.params);
    }


    $scope.page = {};
    // 加载triger ;
    // var lose_tag = { 'background-color':'grey' };
    $scope.loadPageData = function(pageNo) {
        var prof_id = $scope.op.profile_id ;  //odp.puuid;
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



    $scope.deleteTrigger = function(i, t) {
        $scope.confirmInvoke({
            title: "删除触发器: " + t.name,
            warn: "确认要删除该触发器吗?"
        }, function(n) {
            $source.$sysProfTrigger.delete({
                profile: t.profile,
                id: t.id
            }, function(resp) {
                $scope.page.data.splice(i, 1);
                n();
            }, n)
        })
    }

    // 创建 , 编辑 触发器;
    $scope.c_u_Trigger = function(add_OR_i, trigger) {
        if (!$scope.profiles.length) {
            angular.alert("请先创建 系统配置!");
            $state.go('app.model.sysprofile');
            return;
        }

        $modal.open({
            templateUrl: "app/model_system/sysmodel_attr_trigger_add.html",
            //                jjw
            size: "lg",
            controller: function($scope, $modalInstance, $source, $sys ) {
                var a, b, c, i;
                $scope.isAdd = i = add_OR_i == 'create',
                    $scope.__proto__ = S,
                    $scope.$modalInstance = $modalInstance;

                if (i) { // 创建;
                    $scope.T = a = {
                        profile: S.op.profile_id , // puuid,
                        conditions: [angular.copy($sys.trigger_c)],
                        params: {}
                    };
                } else {
                    $scope.T = a = angular.copy(trigger);
                }

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

                            $scope.page.data[add_OR_i] = x;
                            $scope.cancel();
                        })
                    }
                }

                $scope.appendVerb = function() {
                    var verb = a.conditions.length ? $sys.trigger.verb_default : null;
                    a.conditions.push(angular.extend({
                        verb: verb
                    }, angular.copy($sys.trigger_c)));
                }

                $scope.delVerb = function(index) {
                    a.conditions.splice(index, 1);
                    if (0 == index)
                        a.conditions[0].verb = null;
                }

            }
        })
    }

    // 显示 触发器的 condition ;
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