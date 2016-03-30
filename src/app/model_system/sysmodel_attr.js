
export default ( $scope , sysModelResp , $source )=>{
	"ngInject";


	$scope.sysModel = sysModelResp.ret || {} ; 

 
	// 托管 非托管,  daserver getgeway tabs 都不一样; 
	var basicTabs = [
			{ title:"sysModel.info"  ,  state: "app.sysmodelattr.info" ,  icon:" icon icon-screen-desktop "} , 
			{ title:"sysModel.sysconf"  ,  state: "app.sysmodelattr.profile" ,  icon:" icon icon-screen-desktop "} , 
		   
		    { title:"devModel.tag"  ,  state: "app.sysmodelattr.tag" ,  icon:" icon icon-screen-desktop "} , 
			{ title:"trigger.name"  ,  state: "app.sysmodelattr.trigger" ,  icon:" icon icon-screen-desktop "}  
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
	};
 
 	//===============================================
 	$scope.op = { 
 		profile_id : undefined // 当前 操作的profile  ,  针对 tag , trigger ; 

 	};


	// 加载  sysmodel device ; 
	var   holdSysDevice ; 
	$scope.loadSysDevice = ()=>{
		return holdSysDevice = holdSysDevice   || $source.$sysDevice.get({ system_model: $scope.sysModel.uuid },(resp) => {
			    $scope.sysDevices =   resp.ret || [];
			    $scope.sysDevice_KV = {};
			    $scope.sysDevices.forEach( (v)=>{
			    	$scope.sysDevice_KV[ v.id ] =  v ; 
			    }) 
			}).$promise;
	}
 	
	// 加载  device  model ; 
	var  holdDevModel ; 
	$scope.loadDevModels = ()=>{
		return holdDevModel = holdDevModel || $source.$deviceModel.get((resp) => {

             $scope.devModels = resp.ret || []; 
             $scope.devModels_KV = {};

            //  建立  devModel_KV ;
             $scope.devModels.forEach( (v)=>{
                $scope.devModels_KV[ v.uuid ] = v ; 
             })     
        }).$promise;
	}


 	// 加载  sysmodel 的 profile ; 
 	var  holdProfile ;
 	$scope.loadProfile = ()=>{
 		return  holdProfile = holdProfile || $source.$sysProfile.get( { system_model: $scope.sysModel.uuid } , (resp)=>{
			$scope.profiles =  resp.ret.length ? resp.ret : undefined ; 

			$scope.op.profile_id = $scope.profiles[0]  && $scope.profiles[0].uuid ; 


		}).$promise ;

 	}
 
 


	
}