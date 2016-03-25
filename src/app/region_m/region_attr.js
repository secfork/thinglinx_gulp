




export default ( $scope  ,regionResp )=>{
	"ngInject";
 	 

	$scope.region = regionResp.ret ;  
	console.log( "region  = " ,  $scope.region )
 
		// tabs  配置 ; 
	$scope.panel = {
		subject:"nav.manageRole" ,
		tabs :[ 

			{ title:"nav.system"  ,  state: "app.m_region_attr.sys" ,  icon:" icon icon-screen-desktop "} , 
			{ title:"user.author"  , state: "app.m_region_attr.author" ,  icon:" icon icon-user "}  

		]
	}





}