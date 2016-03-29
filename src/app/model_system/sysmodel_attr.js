
export default ( $scope , sysModelResp , $source )=>{
	"ngInject";


	$scope.sysModel = sysModelResp.ret || {} ; 

	// 加载  sysmodel 的 profile ; 
	$scope.loadProfile = $source.$sysProfile.get( { system_model: $scope.sysModel.uuid } , (resp)=>{
		$scope.profiles =  resp.ret.length ? resp.ret : undefined ; 

	}).$promise ;



	// 托管 非托管,  daserver getgeway tabs 都不一样; 
	var basicTabs = [
			{ title:"sysModel.info"  ,  state: "app.sysmodelattr.info" ,  icon:" icon icon-screen-desktop "} , 
			{ title:"sysModel.sysconf"  ,  state: "app.sysmodelattr.profile" ,  icon:" icon icon-screen-desktop "} , 
		   
		    { title:"devModel.tag"  ,  state: "app.sysmodelattr.tag" ,  icon:" icon icon-screen-desktop "} , 
			{ title:"sysModel.trigger"  ,  state: "app.sysmodelattr.trigger" ,  icon:" icon icon-screen-desktop "}  
	] ,
	 // device ; 
	deiveTab =  { title:"nav.device"  ,  state: "app.sysmodelattr.device" ,  icon:" icon icon-screen-desktop "} , 
	// 托管 gateway 时; 
	gatewayTab = 	{ title:"sysModel.gateway"  ,  state: "app.sysmodelattr.gateway" ,  icon:" icon icon-screen-desktop "} ,
	tabs ;

	// 1 托管, 2 非托管; 
  	if( $scope.sysModel.mode == 2 ){
  		tabs = basicTabs ;
  	}
	if( $scope.sysModel.mode == 1 ){
		basicTabs.splice( 2 , 0 , deiveTab );
		if( $scope.sysModel.comm_type == 2 ){
			basicTabs.splice( 5 , 0 , gatewayTab );
		} 
		tabs = basicTabs ;

	}; 
 	
 	console.log( 2222 ,tabs )

	$scope.panel = {
		subject: $scope.sysModel.name  ,
		tabs : tabs
	}
	
}