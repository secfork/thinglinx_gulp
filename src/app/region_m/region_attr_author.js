export default ($scope , $source , $sys , $state , $stateParams) => {
    "ngInject";

 
    $scope.tableHeader = [
        { text: "nav.user", w: "10%" },
        { text: "user.role", w: "10%" },
        { text: "user.author", w: "80%" }
    ];
    $scope.role_category = "1";
 
    $scope.page = {};
    $scope.loadPageData = function(pageNo) {
        $source.$region.query({
            op: "authoruser",
            region_id:  $stateParams.id ,
            currentPage: pageNo,
            itemsPerPage: $sys.itemsPerPage
        }, function(resp) {
            $scope.page.data = resp.data;
            $scope.page.total = resp.total;
            $scope.page.currentPage = pageNo;
            getUserName( $scope.page.data );
        })
    };

    $scope.loadPageData(1);


    function getUserName ( userArray ){
    	$source.$user.get(
    		{ op:"select",  id:  userArray.map( (v)=>{  return v.user_id } )  } ,
    		function( resp ) {
		            resp.ret.forEach( function( v , i ){
		                console.log(v)
		                $("#user_"+ v.id ).text( v.username ) 
		            });

        	}
        ) 

    }




}
