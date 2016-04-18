export default ($scope , $utils ) => {
    "ngInject";



    $scope.setFiles = function(element) {
        $scope.canupload = true;
        $scope.$apply(function($scope) { 

            // Turn the FileList object into an Array   form 中家 multiple  就是多文件上传;
            $scope.files = [];

            var file = element.files[0];
 
            $scope.op.rightfile = (file.size < 1024 * 500 ); //500k ;
 
            // $scope.showmsg = !$scope.rightfile;
            if ($scope.op.rightfile) {
                $scope.files.push(element.files[0]) //  文件路径;
            }
        });
    };


    $scope.uploadFile = function() { 

        if (!/^image/.test($scope.files[0].type)) {
            angular.alert("请选择jpeg,png,jpg格式的图片文件!");
            return;
        } 
        $scope.progress = 1;  
        var fd = new FormData(); 
        fd.append("sys_picture", $scope.files[0]);
        fd.append("old_pic_url_", $scope.system.pic_url); 
        fd.append("system_id", $scope.system.uuid); 

        // 上传 图片; 
        $utils.upLoadPictureFile( 'picture/system' , fd , uploadProgress , uploadComplete )
 
    };

     // 上传完成;  刷新 fileregion 视图;
    function uploadComplete(evt) {
        try {
            $scope.$apply(function() {
                $scope.progressVisible = false;
                $scope.system.pic_url = angular.fromJson(evt.target.response).ret;
                // 清空  file input ; 
                console.log("  empty file  input!! 一般情况下，不允许通过脚本来对文件上传框赋值 ");
            }) 
        } catch (e) {}
    }

    // 进程条滚动;
    function uploadProgress(evt) {
        $scope.$apply(function() {
            if (evt.lengthComputable) {
                $scope.progress = Math.round(evt.loaded * 100 / evt.total)
            } else {
                $scope.progress = 'unable to compute'
            }
        })
    }




}
