




export default ($scope, $sys, $source, $translate, $utils) => {
    "ngInject";

    var thatScope = $scope;

    $scope.od = {};
    $scope.page = { f_name: undefined };

    $scope.panel = {
        subject: "nav.manageUser",
        title: "user.allUser",
        pagger: true,

        panelTopButs: [
            // {text:"ss"}
        ],

        panelBotButs: [

            { text: "user.addUser", classFor: " btn-primary", handler: addUser }

        ]
    };


    $scope.tableHeaders = [
        { text: "text.name", w: "20%" },
        { text: "user.nickName", w: "20%" },
        { text: "text.verify", w: "20%" },
        { text: "user.lastLoginTime", w: "20%" },
        { text: "user.lastLoginIp", w: "20%" },
        { text: "text.desc", w: "30%" },
        { text: "text.del", w: "15%" }
    ]

    $scope.loadPageData = function(pageNo) {
        $scope.showMask = true;

        var d = {
            itemsPerPage: $sys.itemsPerPage,
            currentPage: pageNo,
            name: $scope.od.f_projname
        };

        $source.$region.query(d, function(resp) {
            $scope.showMask = false;
            $scope.page = resp;
            $scope.page.currentPage = pageNo;

        }, function() {
            $scope.showMask = false;
        });
    };

    $scope.loadPageData = function(pageNo) {



        var d = {
            currentPage: pageNo || 1,
            itemsPerPage: $sys.itemsPerPage,
            username: $scope.od.f_name
        };

        d.username && (d.username += /.\*$/.test(d.username) ? "" : "*");
 
        $scope.showMask = true;

        $source.$user.query(d, function(resp) {
                $scope.page = resp;
                $scope.page.currentPage = pageNo;
                $scope.showMask = false;
            },
            function() {
                $scope.showMask = false;
            }
        );
    };
    $scope.loadPageData(1);


 
    $scope.updateUser = function(idObj) { 
        return $source.$user.put({}, idObj).$promise;
    }
 

    function addUser() {
        angular.open({
                templateUrl: "app/user/user_add.html",
                title: "user.addUser"
            },
            function($scope, $modalInstance) {
                $scope.user = {};
                $scope.isAdd = true;
                $scope.done = function() {

                    $scope.validForm();
                    $source.$user.save($scope.user, function(resp) {
                        $scope.user.id = resp.ret;
                        thatScope.page.data.unshift($scope.user)
                        $scope.cancel();
                    }, function(resp) {
                        // 用户已存在, 或其他错误; 
                        // 用户存在 , 且有区域管理权限; 
                        // $scope.cancel();
                        if (resp.err == "ER_USER_EXIST") {
                            depuName2addUser($scope);

                        }else{
                            $utils.handlerRespErr( resp )
                        }
                    });
                }

            }
        )
    }

    // 名字被占用时  , 且 区域用户管理 时, 添加user ; 
    function depuName2addUser(scope) {

        var user = scope.user,
            title = $translate.instant('err.ER_USER_EXIST'),
            username = user.username,
            loadTheUser;

        if (thatScope.user.is_super_user || username == thatScope.user.username) {
            angular.alert(title);
            return;
        }

        angular.confirm({
                title: title,
                note: ["user.noteAddUser", username] // "是否将用户 " +  username+ '加入您所管理的区域?' 
            },
            function(close) {

                // 返回 exist_user 对象; 
                $source.$user.get({ op: "appendregionrole", name: username }, function(resp) {
                    // angular.alert("附加成功!") ; 
                    thatScope.page.data.unshift(resp.ret);
                    close();
                    scope.cancel();

                }, $utils.handlerRespErr)
            })

    }



    $scope.delUser = function(arr, u, i) {
        angular.confirm({
            // title: "删除用户:" + u.username,
            warn: ['user.warnDelUser', u.username] //"确认要删除该用户吗?"
        }, function(next) {
            $source.$user.delByPk({ pk: u.id },
                function(resp) {
                    arr.splice(i, 1);
                    next();
                },
                $utils.handlerRespErr
            );
        });
    };


    //======================================

}