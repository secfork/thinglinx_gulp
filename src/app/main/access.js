'use strict';

/**
注册, 登录, 密码 页面 控制; 
*/




function registCtrl($scope, $source) {
    "ngInject";


}


function loginCtrl(
	$scope, $state, $timeout, $localStorage, $sys,  $compile, 
	$source, $modalStack, $rootScope ) {

    "ngInject";

    $modalStack.dismissAll();

    $scope.op = {
        t: 1, // 图片验证码;
        b: false, // 登录按钮是否可用; 
    };


    $source.$common.get({
        op: "islogined"
    }, function(resp) {

        if (resp.ret) {

            // resp.ret.sms_notice = !!resp.ret.sms_notice;
            // resp.ret.mail_notice = !!resp.ret.mail_notice;
            // $("body").scope().user = resp.ret ;  
            $state.go("app");
        } else {
            // 获取登录次数;
            $source.$common.get({
                op: 'logintimes'
            }, function(resp) {
                $scope.op.need_idenfity = !!resp.ret;
            });
        }

    }, function() {
        console.log("log 404")
    });

 
    $scope.user = {};

    //@if  append
    $scope.user = {
        username: "123123",
        password: "123123"
    };
    //@endif


    $scope.user.account = $localStorage.account;
 
    // $scope.st.login_errtimes ++ ;

    $scope.login = function() {

        //@if  append
        console.log($scope.user);
        //@endif

        var u = $scope.user;
        if (!u.account) {
            angular.alert("请输入公司名称");
            throw ("");
        }
        if (!u.username) {
            angular.alert("请输用户名");
            throw ("");
        }
        if (!u.password) {
            angular.alert("请输入密码");
            throw ("");
        }


       // $scope.validForm();

        $scope.op.b = true;

        $localStorage.account = $scope.user.account;

        $source.$user.login($scope.user,
            function(resp) {
                //@if  append
                console.log(resp.ret);
                //@endif

                // resp.ret.sms_notice = !!resp.ret.sms_notice;
                // resp.ret.mail_notice = !!resp.ret.mail_notice;
                // $("body").scope().user  = resp.ret ;

                if (resp.ret) {

                    //@if  append
                    console.log("log in ok ");

                    //@endif
                    //$state.go( $sys.rootState );
                    $state.go("app.m_region");
                    //$state.go("app.template");
                } else {
                    $scope.op.b = false;
                    $scope.resp = resp;
                }
            },

            function(resp) { // {err:.. , ret: ... }
                if (resp.err == "login_yet") {
                    $timeout(function() {
                        $state.go("app.m_region");
                        $modalStack.dismissAll();

                    }, 2000)

                    return;
                } 
                
                if (resp.img) {
                    $scope.op.need_idenfity = true;
                    $("#login_identify").attr("src", "data:image/jpg;base64," + resp.img)
                }

                $scope.op.t++;

                $scope.op.b = false;



            }

        );
    };



}


function ccPassCtrl() {

}


export default {

    "access": {
        url: '/access',
        template: '<div ui-view class="   h-full smooth"></div>',
    },
    "access.signin": {
        url: '/login',
        controller: loginCtrl,
        templateUrl: 'app/main/page_login.html'
    },

    'access.signup': {
        url: '/signup',
        controller: registCtrl,
        templateUrl: 'app/main/page_regist.html'
    },

    'access.forgotpwd': {
        url: '/forgotpwd',
        controller: ccPassCtrl,
        templateUrl: 'app/main/page_forgotpwd.html'
    }
}
