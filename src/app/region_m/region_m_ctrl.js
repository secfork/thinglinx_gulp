 
export default ($scope, $sys, $source , $utils   ) => {
    "ngInject";
  

    var thatScope  = $scope ; 
    $scope.od = {};

    $scope.textb = 'done';

    $scope.page = {};

    $scope.panel = {
        subject: "region.subject",
        title: "region.title",
        pagger: true,

        panelTopButs: [
           // {text:"ss"} 
        ], 
        panelBotButs: [ 
            {  text: "region.addRegion", 
             classFor: " btn-primary",
              handler:   addProj  }
        ]
    }; 

    $scope.tableHeaders = [
        { text: "text.name", w: "20%"}, 
        { text: "text.createTime",  w: "20%"  }, 
        {  text: "region.th_active",  w: "20%" }, 
        {  text: "region.th_unactive",   w: "20%"  }, 
        { text: "text.desc",   w: "30%"  }, 
        {  text: "text.del",  w: "15%"  }
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

            $utils.queryAcUnAcSysNum( $scope.page.data , true  );

        }, function() {
            $scope.showMask = false;
        });
    };
  
    $scope.loadPageData(1); 


  
  


    /*
     * 从 fps 中移除, 从 filterP 中移除;   从 allprojects 中移除;
     * */
    $scope.delProject = function(proj, index) {

        angular.confirm({
               // title: "region.delRegion" ,// + proj.name,
                warn: [ "region.delWarn",  proj.name ]// "确认要删除该区域吗?"
            },
            function(next) { 
                $source.$region.delete({
                    pk: proj.id
                }, function(resp) {
                    $scope.page.data.splice(index, 1);
                    next();
                }, next )
            }
        )
    };


   
    function addProj() { 
        angular.open({ 
                title:"region.addRegion",
                templateUrl: "app/region_m/region.add.html" ,
            } , ( $scope )=>{
                "ngInject"; 
                console.log( "controller Scope  id " , $scope )
 
                $scope.proj = {};

                $scope.done = function(e) {
                    $scope.validForm();
                    thatScope.showMask = true; 

                    $source.$region.save($scope.proj, function(resp) {
                        //resp.ret && $state.go("app.proj.manage");  
                        thatScope.showMask = false;
                        $scope.proj.id = resp.ret;

                        thatScope.page.data.unshift(angular.copy($scope.proj));
                        $scope.cancel(); 
                    }, function() {
                        $scope.showMask = false;
                        $scope.cancel();
                        
                    }) 
                } 

            }
        ) 
    } 
 

    $scope.updateRegion = function(fieldObj) {

        return $source.$region.put({
            pk: fieldObj.id
        }, fieldObj).$promise;
    }



    //======================================

}
