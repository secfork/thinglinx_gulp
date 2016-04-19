


 

export default ($scope , $source , $sys  , $utils ) => {
    "ngInject";

    $scope.panel = {
        subject: "region.subject",
        title: "region.title",
        pagger: true
    };

    $scope.tableHeaders = [
        { text: "text.name", w: "20%" },
        { text: "text.createTime", w: "20%" },
        { text: "system.activeNum", w: "20%" },
        { text: "text.desc", w: "30%" }
    ];

    $scope.od= {}; 

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

            $utils.queryAcUnAcSysNum( $scope.page.data );

        }, function() {
            $scope.showMask = false;
        });
    };
    
    $scope.loadPageData(1);

   
   
    



}
