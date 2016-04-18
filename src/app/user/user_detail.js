export default function($scope, $source, $state, $stateParams,
    $modal, $sys, $translate, $interval, $localStorage, $sessionStorage, $q, $utils) {

    'ngInject';

    // $scope.from = $utils.backState('account_userdetail'); 
    var thatScope = $scope;

    var user_id = $stateParams.id || $scope.user.id;

    // 是 展示 自己属性 , 还是 管理员在编辑 其他用户 ; 
    $scope.userself = !$stateParams.id;

    $scope.user = undefined;
    $scope.panel = {} ;
    $scope.op = {  privilege:[] } ;

    // 得 id 用户; 
    var loadUserPromise = $source.$user.get({
        pk: user_id
    }, function(resp) {
        $scope.user = resp.ret;  
        $scope.user.sms_notice = !!$scope.user.sms_notice;
        $scope.user.mail_notice = !!$scope.user.mail_notice;
    }).$promise;

    // 得到 所有 角色;  
    var role_KV = {};
    $scope.role_KV = role_KV ;

    var loadRolesPromise = $source.$role.get(function(resp) {

        $scope.roles = resp.ret || [];
        // $scope.roles.unshift( {  name:"-无-" , id:null ,  role_category: 0 } ) 
        angular.forEach($scope.roles, function(v, i) {
            role_KV[v.id] = v;
        })


    }).$promise;

    // 报警总开关; 
    // 接收 报警;  // type = "sms_notice" || "mail_notice"
        $scope.acceptAlarm = function acceptAlarm(type) { 
            var d = {};
            d[type] = $scope.user[type] ? 1 : 0;
            $source.$user.save({
                    op: "notice"
                }, d,
                function() {  },
                function( resp ) {
                    $scope.user[type] = !$scope.user[type] ;
                    $utils.handlerRespErr( resp )
                }
            ) 
        }
 
    // 报警区域开关; 
    // 编辑是否接收 某个 region 报警; 
        $scope.acceptRegionAlarm = function(rr) { 
            var sub = {
                filter: {
                    region_id: rr.region_id || rr.id,
                    type: "alarm"
                },
                sendee: {
                    user_id: user_id
                }
            };

            if (rr.acceptAlarm || rr.acceptAlarm == undefined) {
                // 创建 , 
                $source.$sub.save({}, sub, function(resp) {
                    rr.sub_id = resp.ret;
                    subScribKV[rr.id || rr.region_id] = true;

                }, function(resp) {
                    rr.acceptAlarm = !rr.acceptAlarm;
                    $utils.handlerRespErr( resp )
                })

            } else {
                // 删除;  

                $source.$sub.delete({
                    pk: rr.sub_id
                }, function() {
                    subScribKV[rr.id || rr.region_id] = false;
                }, function( resp ) {
                    rr.acceptAlarm = !rr.acceptAlarm;
                    $utils.handlerRespErr( resp )
                }) 
            } 
        }


    // 得到用户的 账户权限; 
        $source.$user.get({
                pk: "getaccountrole",
                op: user_id
            }, function(resp) { 
                $q.all([ loadUserPromise , loadRolesPromise]) .then(function() {   
                    $scope.user.accountRolId = resp.ret && resp.ret.role_id ;
                    $scope.op.accountRolId = $scope.user.accountRolId ;

                    var  r = role_KV[ $scope.user.accountRolId ] ;
                    //privilege : ["REGION_MANAGE"]  ;
                    $scope.op.privilege  =  r && r.privilege ; 
                })
            })
     
    $scope.addAccountRole = function() {

        var n = $scope.op.accountRolId,
            note = n ?
                        [ "user.chRole" , $scope.user.username , role_KV[n].name ]
                     // "将用户" + $scope.user.username + " 的账户角色修改为 " + role_KV[n].name + "?" 
                    :
                        'user.delRole'
                     // "删除账户角色!"
                     ;
        
        angular.confirm(   { 
             // title: "更改账户角色",
             note: note },
            function(next) { 
                if (n) {
                    $source.$user.put({
                        pk: "addrole",
                        op: user_id,
                        isaccount: true
                    }, {
                        role_id:  n 
                    }, function(resp) { 
                        $scope.user.accountRolId = n ;  
                        $scope.op.privilege = role_KV[ n ].privilege ; 
                        next();
                    }, function( resp ) {
                        $scope.op.accountRolId = $scope.user.accountRolId ; 
                        next();
                        $utils.handlerRespErr( resp );
                    })
                } else {
                    $source.$user.delete({
                        pk: "delrole",
                        op: user_id,
                        isaccount: true
                    }, null, function() { 
                        $scope.op.privilege = [] ; 
                        next()
                    }, function( resp) {
                        $scope.user.accountRol.id = $scope.user._$oldAccountRole_id; 
                        next();
                        $utils.handlerRespErr( resp );
                    })
                }
            },
            function( next) {  
                $scope.op.accountRolId = $scope.user.accountRolId;  
                next();
            }
        )
    }
    
     

    // 得到 所有 区域 权限;   /getpermissions/:user_id
    //  admin 用户 得到所有区域, 普通用户得:getPermisseion ; 

    var loadRegionPromise,
        loadPermissionPromise,
        loadAllRegion,
        subItems,
        Allregions,
        subScribKV, //  删除 添加 报警 要维护 该对象; 
        //  添加 删除 区域权限时 需要维护 该对象 ;  obj = region  || promisesion  ;  
        obj_ref = {}; 

    loadUserPromise.then(function() {
        // regionIdkey = !!$scope.user.is_super_user?"id":"region_id" ;

        $scope.page = {};
        // 超级管理员时,  不用加载区域角色 , 有所有权限 ; 
        if ($scope.user.is_super_user) {

            $scope.loadPageData = function(pageNo) {
                // 得到  分页 区域; 
                loadRegionPromise = $source.$region.query({
                    currentPage: pageNo,
                    itemsPerPage: 7
                }).$promise;

                loadRegionPromise.then(function(resp) {
                    $scope.page.total = resp.total;
                    $scope.page.data = resp.data;
                    $scope.page.currentPage = pageNo;

                    // $scope.userself &&  getIsSubAlarm($scope.page.data);
                    getIsSubAlarm($scope.page.data);

                })
            }

            $scope.loadPageData(1);
        } else {
            // 加载所有 区域;  

            // 得到  user_id 的  所有  promissions ;    promission 分页 就无法添加过滤; 
            // 还要 加载   subscript ; 
            $source.$user.get({
                pk: "getpermissions",
                op: user_id,
                // currentPage: pageNo ,
                // itemsPerPage: 5 
            }, function(resp) {
                // $scope.page.total = resp.total;
                $scope.page.data = resp.ret;
                // $scope.page.currentPage = pageNo;

                // 加载 所有的 订阅  subscritt ; 
                $scope.userself && getIsSubAlarm($scope.page.data)

                if ($scope.userself) {
                    getIsSubAlarm($scope.page.data)
                } else {
                    // obj_ref 用来 添加 region author 时过滤   region.id , promission.region_id ;
                    $scope.page.data.forEach(function(v, i) {
                        obj_ref[v.id || v.region_id] = v;
                    });
                } 
            });
        }



        //  admin 用户时 , 根据 page.data   的  region_id 去查询 订阅 ; 回显 ;   
        // regionArray 中 带有region_id ; 

        // 第一次就 查询除了 所有订阅?   
        function getIsSubAlarm(objArray) {

            if (!objArray) {
                return;
            }; 
            // 单例查询; 所有订阅 ; 
            if (!subScribKV) { 
                loadPermissionPromise = $source.$sub.get({
                    op: "select",
                    user: user_id,
                }, function(resp) {
                    subScribKV = {};
                    resp.ret.forEach(function(v, i) {
                        subScribKV[v.region_id] = v;
                    })
                }).$promise;

            };

            loadPermissionPromise.then(function() {
                // acceptAlarm 
                var x;
                objArray.forEach(function(v, i) {
                    x = subScribKV[v.id || v.region_id];
                    v.sub_id = x && x.id;
                    v.acceptAlarm = !!x;
                })

            })

        }

    // 添加区域权限 ; 
        $scope.addRegionAuthor = function() {
            // $scope.showMask = true;

            angular.open({
                title:"user.addRegionAuth" ,
                size: "sm",
                templateUrl: "app/user/user_detail_addregion.html",
                resolve: {
                    regions: function() {
                        loadAllRegion = loadAllRegion || $source.$region.query({ currentPage: 1 }).$promise;
                        return  $q( function( resolve , reject ){
                            loadAllRegion.then( ( resp)=>{
                                resolve(
                                    resp.data.filter(function(v, i) {
                                        console.log(obj_ref)
                                        return !obj_ref[v.id]
                                    })
                                ); 
                            }) 
                        })
                    }
                }
            }, ($scope , regions ) => {

                $scope.filter_regions = regions;
                $scope.roles = thatScope.roles ;
                $scope.role_category = 1 ;

               $scope.od = {
                    region: undefined,
                    role: undefined
                };

                $scope.done = function() {

                    $scope.validForm(); 
                    // 添加  region role 信息; 
                    // dev_id = tag.connect.replace(/(\d+).(\d+)/, "$1");
                    var region_id_name = $scope.od.region.split("&"),
                        region_id = region_id_name[0],
                        region_name = region_id_name[1];

                    $source.$user.put({
                            pk: "addrole",
                            op: user_id, 
                            region_id: region_id
                        }, {
                            role_id: $scope.od.role.id
                        },
                        function(resp) {

                            // page.data  ,  obj_ref 内 添加数据 ; 
                            var d = {
                                role_id: $scope.od.role.id,
                                role_name: $scope.od.role.name, 
                                privilege: $scope.od.role.privilege, 
                                region_name: region_name,
                                region_id: region_id
                            }

                            thatScope.page.data.push(d);
                            obj_ref[region_id] = d; // obj = promission ;

                            $scope.cancel();

                        })
                }

            }) 
        }

    });
 
    // del region author ()
        $scope.delRegionAuthor = function(rr, $index) {

            angular.confirm({
                title: "移除用户",
                note: "您确定将用户" + $scope.user.username + "从区域" + rr.region_name + "中移除?"
            }, function(next) {
                $source.$user.delete({
                    pk: "delpermissions",
                    op: user_id,
                    region_id: rr.region_id
                }, function() {
                    thatScope.page.data.splice($index, 1); 
                    delete obj_ref[rr.region_id];
                    next();
                })

            })

        }

    // 记录 区域 角色 的 原始值; 
    $scope.watchRoleId = function(rr, scope) {  
        scope.role_category = 1 ;
        // 超级管理员时;  rr 不是 role , 而是 区域 region ;  
        if (!$scope.user.is_super_user) {
            scope && scope.$watch('rr.role_id', function(n, o) {
                rr._$old_role_id = o  ;
            }) 
        } 
    }

    // 更改  user region 的 Role
    $scope.ccRegionRole = function(rr, scope) {
        // 在创建一次; 覆盖原先的; 
        console.log(scope);

        var note = "将用户" + $scope.user.username + " 在区域 " + (rr.region_name || rr.name) + " 的角色修改为" + role_KV[rr.role_id].name + "?";

        angular.confirm({ title: "更改区域角色", note: note },
            function(next) {
                $source.$user.put({
                        pk: "addrole",
                        op: user_id,
                        region_id: rr.region_id
                    }, {
                        role_id: rr.role_id
                    },
                    function() {
                        rr.privilege = angular.copy(role_KV[rr.role_id].privilege);
                        
                        next();
                    }
                );
            },
            function( next ) { 
                rr.role_id = rr._$old_role_id;
                next();
            }
        )

    }


    // editUser()  // 编辑用户 ;
    $scope.editUser = function(u) {
 
        angular.open({
        	title: "user.edit",
            templateUrl: "app/user/user_add.html"
        	} ,
            function($scope, $modalInstance) {
                
                $scope.od = {} ;
                $scope.ccField = function(k, v) {
                    $scope.od[k] = v;
                }
                $scope.done = function() {
                    $scope.od.id = u.id; 
                    thatScope.updateUser($scope.od).then(function() {
                        angular.extend(u, $scope.user);
                        $scope.cancel();
                    }) 
                }
 
                $scope.user = angular.copy(u);
                $scope.op = {};
                $scope.od = {}; // 接受 changeuser 字段; 
            }
        )

    }

    $scope.updateUser = function(idObj) {
        return $source.$user.put(null, idObj).$promise;
    }


    // resetPassword ()
    $scope.reSetPW = function() {
        $modal.open({
            templateUrl: "athena/cc_password.html",
            // size:"sm",
            controller: function($scope, $modalInstance, $source) {
                $scope.op = {},
                    $scope.od = {},
                    $scope.__proto__ = thatScope,
                    $scope.$modalInstance = $modalInstance;

                $scope.done = function() {
                    $scope.validForm();

                    $source.$user.save({
                        op: "pwdreset"
                    }, $scope.op, function(resp) {
                        if (resp.msg) {
                            $scope.od.msg = resp.msg;
                            return;
                        }

                        angular.alert("修改成功!");
                        //@if  append

                        console.log("修改成功!");
                        //@endif
                        $scope.cancel();
                    })
                }
            }
        })

    }

    // sms , emial  xx秒后 重发;     
    $scope.ot = {};

    var t_ = 120;

    var text = "重新发送(%)",
        textCond = {
            smsInterval: "发送验证码",
            emailInterval: "发送验证邮件"
        };
    // 
    window.interval = window.interval || {
        smsInterval: undefined,
        emailInterval: undefined
    }
    $scope.interval = window.interval;

    window.intervalTimes = {
        smsInterval: $sessionStorage.smsInterval > 0 ? $sessionStorage.smsInterval : t_,
        emailInterval: $sessionStorage.emailInterval > 0 ? $sessionStorage.emailInterval : t_
    };

    //  type = smsInterval || emailInterval
    function startInterval(type) {

        window.interval[type] = window.interval[type] || $interval(function() {
            //@if append 
            console.log(type, window.intervalTimes[type], window.interval[type]);
            //@endif

            $("#" + type).text(text.replace("%", window.intervalTimes[type]));
            $sessionStorage[type] = --window.intervalTimes[type]

            if (window.intervalTimes[type] < 0) {
                window.intervalTimes[type] = t_;
                $interval.cancel(window.interval[type]);
                window.interval[type] = undefined;
                $("#" + type).text(textCond[type])
            }
        }, 1000);
    }

    $sessionStorage.smsInterval > 0 && startInterval("smsInterval");
    $sessionStorage.emailInterval > 0 && startInterval("emailInterval");



    $scope.validPhone = function() {
        $modal.open({
            templateUrl: "athena/account/users_verify_phone.html",
            controller: function($scope, $modalInstance) {
                $scope.$modalInstance = $modalInstance;
                $scope.__proto__ = thatScope;

                $scope.u = {
                    mobile_phone: $scope.user.mobile_phone || $sessionStorage["user_phone_" + user_id]
                };

                $scope.$watch('u.mobile_phone', function(u) {
                    $sessionStorage["user_phone_" + user_id] = u;
                })

                $scope.sendNote = function(e) {
                    if (!$scope.u.mobile_phone) {
                        angular.alert("请输入手机号");
                        return;
                    }
                    startInterval("smsInterval");
                    $source.$note.get({
                            op: "user",
                            mobile_phone: $scope.u.mobile_phone
                        },
                        function() {

                        });
                }

                // 去 验证  用户 手机;  userself ; 
                $scope.verifyPhone = function() {

                    $source.$user.save({
                        op: "verifyphone"
                    }, $scope.u, function() {

                        $scope.cancel();

                        angular.alert("验证成功!");
                        $scope.user.mobile_phone = $scope.u.mobile_phone;
                        $scope.user.mobile_phone_verified = 1;
                    })
                }
            }
        })
    }

    $scope.validEmail = function() {
        $modal.open({
            templateUrl: "athena/account/users_verify_email.html",
            controller: function($scope, $modalInstance) {
                $scope.$modalInstance = $modalInstance;
                $scope.__proto__ = thatScope;

                $scope.u = {
                    email: $scope.user.email || $sessionStorage["user_email_" + user_id],
                    num: undefined
                };

                $scope.$watch('u.email', function(e) {
                    $sessionStorage["user_email_" + user_id] = e;
                })

                var trueEmail;

                $scope.sendEmail = function(e) {

                    if (!$scope.u.email) {
                        angular.alert("请正确输入邮箱");
                        return;
                    }
                    startInterval("emailInterval");


                    $source.$user.save({
                            op: "sendverifyemail"
                        }, {
                            email: $scope.u.email
                        },
                        function() {
                            trueEmail = angular.copy($scope.u.email);

                        }
                    );
                }

                $scope.verifyEmail = function() {

                    $source.$user.save({ op: 'verifyuseremail' }, { num: $scope.u.num }, function(resp) {

                        $scope.cancel();

                        angular.alert("验证成功!");
                        $scope.user.email = trueEmail;
                        $scope.user.email_verified = 1;

                    })

                }

            }
        })
    }


    // 验证联系方式;
    //        jjw 添加参数temp，标记是phone还是email
    $scope.verifyUser = function(temp) {
        $modal.open({
            templateUrl: temp == 'phone' ? "athena/account/users_verify_phone.html" : "athena/account/users_verify_email.html",
            controller: function($scope, $modalInstance, $interval) {
                $scope.$modalInstance = $modalInstance;

                $scope.__proto__ = thatScope;

                $scope.u = angular.copy($scope.user);
                $scope.ver = {};

                var smsInterval, emailInterval;

                var text = "重新发送(%)";


                var cofText = {
                    "email": "发送验证邮件",
                    "phone": '发送验证码'
                };

                function setInter(btnDom, type) {
                    btnDom.disabled = true;
                    var times = 120;
                    smsInterval = $interval(function() {
                        $(btnDom).text(text.replace("%", times));
                        times--;
                        if (times < 0) {
                            btnDom.disabled = false;

                            $(btnDom).text(cofText[type || "phone"]);

                            $interval.cancel(smsInterval);
                        }
                    }, 1000)
                }



                $scope.sendEmail = function(e) {

                    if (!$scope.u.email) {
                        angular.alert("请输入邮箱!");
                        return;
                    }
                    setInter(e.currentTarget, "email");

                    var d = {
                        id: u.id,
                        email: $scope.u.email
                    };

                    $source.$user.save({
                        pk: "sendverifyemail"
                    }, d);

                }

                $scope.verifyPhone = function() {
                    if (!$scope.u.mobile_phone) {
                        angular.alert("请输入手机号");
                        return;
                    }
                    if (!$scope.ver.phone) {
                        angular.alert("请输入验证码");
                        return;
                    }

                    var d = {
                        id: u.id,
                        mobile_phone: $scope.u.mobile_phone,
                        verifi: $scope.ver.phone
                    };

                    $source.$user.save({
                        pk: "verifyphone"
                    }, d, function(resp) {
                        u.mobile_phone_verified = true;
                        $scope.cancel();

                        u.mobile_phone = $scope.u.mobile_phone;

                        $scope.user.mobile_phone_verified = true;
                    });


                }


            }
        })
    }



}
