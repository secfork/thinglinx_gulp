export default ($scope , $utils  , $sys ) => {
    "ngInject";
    

    $scope.op = { largeSize: false , noPictureType: false  , needUpload: false  ,progressVisible:false } ;


    $scope.setFiles = function(element) { 
        $scope.$apply(function($scope) {  
            // Turn the FileList object into an Array   form 中家 multiple  就是多文件上传; 
            $scope.op.largeSize = false ;
            $scope.op.noPictureType = false ;
            $scope.files =  element.files ; 

            pictureType(); 

            if( $scope.files[0].size  >  $sys.systemPictureSize  ){

                 $scope.op.largeSize =  true ; //500k ; 
                throw( 'picture too lage '); 
            };
            $scope.op.needUpload = true ; 
        });
    };
 

    function pictureType(){
        if (!/^image/.test($scope.files[0].type)) {
            $scope.op.noPictureType = true ;
            angular.alert("请选择jpeg,png,jpg格式的图片文件!");
            throw(' no picture type')
        }  
    }
  
    $scope.uploadFile = function() { 

        pictureType();
    
        $scope.progress = 1;  
        var fd = new FormData(); 
        fd.append("sys_picture", $scope.files[0]);
        fd.append("old_pic_url_", $scope.system.pic_url); 
        fd.append("system_id", $scope.system.uuid); 


        // 上传 图片; 

        $scope.op.progressVisible = true;
        $utils.upLoadPictureFile( 'picture/system' , fd , uploadProgress , uploadComplete )
 
    };

     // 上传完成;  刷新 fileregion 视图;
    function uploadComplete(evt) {
        try {
            $scope.$apply(function() {
                $scope.op.progressVisible = false;
                $scope.op.needUpload = false ;
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
