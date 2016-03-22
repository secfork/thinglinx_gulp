
export default  ($scope , $source  , $utils )=>{
	"ngInject";

	$scope.title = "xxx"


	// tabs  配置 ; 
	$scope.panel = {
		subject:"nav.manageRole" ,
		tabs :[ 

			{ title:"nav.region"  ,  state: "app.role.region" ,  icon:" icon icon-screen-desktop "} , 
			{ title:"nav.account"  , state: "app.role.account" ,  icon:" icon icon-user "}  

		]
	}

	// 预先 加载所有的 角色 ;  
	$scope.showMask = true ;
	$scope.loadAllRole  = $source.$role.get( function( resp ){
		$scope.roles = resp.ret  ; 
		$scope.showMask = false ;
	} ,  ( resp )=>{
		$scope.showMask = false ; 
		$utils.handlerRespErr( resp )
	} ).$promise;
 
	
}