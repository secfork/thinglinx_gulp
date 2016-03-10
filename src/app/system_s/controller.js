export default ($scope, $sys, $source ) => {
    "ngInject";

    var thatScope  = $scope ; 
    $scope.od = {};

    $scope.textb = 'done';

    $scope.page = {};

    $scope.panel = {
        subject: "region_m.subject",
        title: "region_m.title",
        pagger: true,

        panelTopButs: [
           // {text:"ss"}
        ],

        panelBotButs: [

            {  text: "region_m.addRegion",  classFor: " btn-primary", handler:   addProj  }

        ]
    }; 

    $scope.tableHeaders = [
        { text: "text.name", w: "20%"}, 
        { text: "text.createTime",  w: "20%"  }, 
        {  text: "region_m.th_active",  w: "20%" }, 
        {  text: "region_m.th_unactive",   w: "20%"  }, 
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

        }, function() {
            $scope.showMask = false;
        });
    };
 

    thatScope.page = { data:[ {name:11} ] , currentPage:1 , total:100 }
    // $scope.loadPageData(1);

    var region_ids = [];
    $scope.collectRegionId = function(region, $last) {
        region_ids.push(region.id);

        if ($last) {

            getActiveSum(region_ids);
            getUnActiveSum(region_ids);
        }
    }


    function getActiveSum(region_ids) {
        $source.$region.save({
            pk: "sum",
            state: 1
        }, region_ids, function(resp) {
            resp.ret.forEach(function(v, i) {
                $("#act_" + v.region_id).text(v.count);
            })
        })
    }


    function getUnActiveSum(region_ids) {
        $source.$region.save({
            pk: "sum",
            state: 0
        }, region_ids, function(resp) {
            resp.ret.forEach(function(v, i) {
                $("#unact_" + v.region_id).text(v.count);
            })
        })
    }



    /*
     * 从 fps 中移除, 从 filterP 中移除;   从 allprojects 中移除;
     * */
    $scope.delProject = function(proj, index) {

        angular.confirm({
                title: "删除区域: " + proj.name,
                warn: "确认要删除该区域吗?"
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
                title:"region_m.addRegion",
                templateUrl: "app/region_m/region.add.html" ,
            } , ( $scope )=>{
                "ngInject";
                //$scope.__proto__ = thatScope; 
                $scope.proj = {};

                $scope.done = function(e) {
                    $scope.validForm();
                    $scope.showMask = true; 

                    $source.$region.save($scope.proj, function(resp) {
                        //resp.ret && $state.go("app.proj.manage");  
                        $scope.showMask = false;
                        $scope.proj.id = resp.ret;

                        $scope.page.data.unshift(angular.copy($scope.proj));
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
