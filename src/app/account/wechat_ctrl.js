




export default ( $scope, $sessionStorage, $source, $timeout , $localStorage )=>{
	"ngInject";
	  console.log(" account_weichat" , $scope.user );

    $scope.wei = {}; // weiChatNo , serverUrl  // 第一步; 

    $scope.op = { step: undefined };

    $scope.menu = [];
    $scope.data = {}; // 第二部; 

    $scope.showMask = true ;

    // 注销 微信服务号; 
    $scope.unBindServer = function() {
        $source.$weChat.unBindServer(function() {
            angular.alert('注销成功!');
            $scope.wei = {};
            $scope.op.step = 0;
        })
    }


    // 得到  weChatServer  信息; 

    $source.$weChat.getServerInfo(function(resp) {
        console.log(resp.ret);
        $scope.showMask = false ;

        // resp.ret =  angular.fromJson( resp.ret );

        $scope.wei = JSON.parse(resp.ret || '{}');

        $scope.menu = $scope.wei.menu && $scope.wei.menu.split(",") || [];


        // $scope.op.step = 0 ;
        // return ;

        if (!!resp.ret && $scope.wei.status == 4) {

            $scope.op.step = -1;

        } else {
            $scope.op.step = 0;

        }
    } , function(){
        $scope.showMask  = false ;
    })

    // $scope.op.step  = $sessionStorage.weichat_step ; 

    // $scope.$watch('op.step' , function( n ){
    //     $sessionStorage.weichat_step = n ; 
    // });

    $scope.enbaleCopy = function() { // copy_url
        new Clipboard('#copy_url');
    }

    // wechat logo 图片; 
    var pictureFile;
    $scope.setFiles = function(ele) {

        console.log("file change ", ele);
        pictureFile = ele.files[0],

            setPicture(URL.createObjectURL(pictureFile));

    }

    function setPicture(data) {


        img = new Image(),

            url = img.src = data;

        img.height = 66,
            img.width = 296;

        var $img = $(img)
        img.onload = function() {
            URL.revokeObjectURL(url)
            $('#weichat_logo_preview').empty().append($img)
        }

    }



    // 第一步;
    // 输入 
    $scope.createUrl = function() {

        $scope.validForm('form1')

        //$scope.wei.serverUrl = 'gaefaefffffff'
        // 
        $source.$weChat.createUrl({ wechat_id: $scope.wei.wechat_id }, function(resp) {
            $scope.wei.server_url = resp.ret;
        })

    }


    // 验证 serverurl；
    var status = {
        0: "该账号微信服务器地址不存在",
        1: "该账号微信服务器地址已存在",
        2: "该账号微信服务器地址已通过微信验证", // 验证通过 , 
        4: "该账号微信服务器地址已通过微信验证，并且服务器已激活"
    };

    $scope.verifyUrl = function() {

        $source.$weChat.getServerStatus(function(resp) {

            if (resp.ret == 2) { // 4 该账号微信服务器地址已通过微信验证，并且服务器已激活
                $scope.op.verifySuccess = true;
                $timeout(function() {
                    $scope.op.step = 2;
                    // $timeout( function(){ 
                    $scope.wei.logo && setPicture($scope.wei.logo);
                    // } , 1000)     
                }, 1000)
            } else {
                $scope.op.verifyError = true;
                // $scope.op.weChatStatusMsg = status[resp.ret ] || "server 无返回数据" ;
            }

            // dele --!!!!! 
            // $timeout( function(){
            //     $scope.op.step = 2 ;  
            //     $scope.wei.logo  &&  setPicture( $scope.wei.logo ) ;     
            // },1000)


        })

    }


    // 第二步 提交;  // menu=1,2,3&logo=xxx&email=xxx&phoneno=xxx
    // 1: 上传图片,
    // 2: 调用 借口激活 server;
    // 1 
    $scope.setp2Commit = function() {

        if (!($scope.wei.logo || pictureFile)) {
            angular.alert("请设置微信LOGO图片")
            return;
        }


        $scope.validForm("step2");

        if (pictureFile) {

            var fd = new FormData();
            if ($scope.wei.logo) {
                // http://thinglinx-test.oss-cn-beijing.aliyuncs.com/10108/wechat/logo_fnmgh3
                var old_logo = $scope.wei.logo;
                old_logo = old_logo.subString(old_logo.lastIndexOf('/') + 1);
                // 删除老的 logo 图片;  
                fd.append("old_logo", old_logo)
            }
            // for (var i in $scope.files) {
            fd.append("wechat_picture", pictureFile);

            var xhr = new XMLHttpRequest();

            xhr.addEventListener("load", configWeiChat, false);

            //  xhr.addEventListener("error", uploadFailed, false) ;
            //  xhr.addEventListener("abort", uploadCanceled, false) ;

            xhr.open("POST", angular.rootUrl + "picture/wechat");
            xhr.setRequestHeader("Accept", 'application/json');

            xhr.send(fd);
        } else {
            configWei();
        }




    }

    //  2 微信图片上传完后,提交;
    function configWeiChat(evt) {
        var resp = JSON.parse(evt.target.response);
        if (resp.ret) {
            $scope.wei.logo = $scope.ossRoot + resp.ret;
            configWei();
        } else {
            alert('错误')
        }
    }

    function configWei() {
        $scope.wei.menu = $scope.menu.join(',');
        var accountname = $localStorage.account;
        if( !accountname){
            alert("no account name !");
            return ; 
        }
        $source.$weChat.activeServer(  angular.extend( { accountname:  accountname } , $scope.wei), function(resp) {
            pictureFile = null;
            $scope.op.step = 3;
        })
    }

}