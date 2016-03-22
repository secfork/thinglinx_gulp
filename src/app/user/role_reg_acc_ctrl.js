


export default  ($scope  , $state  , $utils , $source )=>{
	"ngInject";

 	var thatScope = $scope ;

	$scope.tableHeaders = [
		{ text:"text.name" , w:"15%"},
		{ text:"user.author" , w:"75%"},
		{ text:"text.edit" , w:"15%"},
		{ text:"text.del" , w:"5%"}

	] ;

	$scope.role_category = $state.current.data.role_category ;
 
	// 添加 或者 编辑  role ; 
	$scope.addRole =  function( role , index ){

		angular.open( {
				title:"xx" ,
				templateUrl:"app/user/role_add.html"
			}, ( $scope )=>{
			  	

					if( role ){
						// 原先的  [ a , b ,c ] 转换为  { a:true, b:true, c:true }
						var _role = angular.copy( role );
							_role.privilege = $utils.array2Obj( _role.privilege );
		 				$scope.r = _role ; 
					}else{ 
						$scope.r =  { privilege:{} , role_category: thatScope.role_category  } ;
					}



					$scope.promise =  $scope.$$lang[  thatScope.role_category == "1" ?"regionPermission":"accountPermission"  ] ;

					$scope.done = ()=>{

						$scope.validForm();

						var  $role = angular.copy( $scope.r ) ;

						$role.privilege = $utils.obj2Array( $role.privilege );

						// console.log( $role )
						if( role ) { // 编辑 
							$source.$role.put({  pk: $role.id },  $role , function(resp) {
	                            thatScope.roles[index] =  $role ;
	                            $scope.cancel();
	                        }, $utils.handlerRespErr )

						}else{ // 新建; 
							$source.$role.save(
	                            $role ,
	                            function(resp) {
	                                $role.id = resp.ret;

	                                thatScope.roles.unshift( $role );
	                                $scope.cancel(); 
	                            },
	                            $utils.handlerRespErr
	                        ) 
						}

					}

		})

	}


	$scope.delRole = function( role , index ){

		angular.confirm ( {
			title:"xx",
			warn: [ "user.wrnDelRole" , role.name ]
		} , function(close){

			$source.$role.delete({
                pk: role.id
            }, function(resp) { 

                thatScope.roles.splice(index, 1) 
                close();
            }, $utils.handlerErr )

		})

	}





	
}