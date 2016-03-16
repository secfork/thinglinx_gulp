export default ( $translate  , $modalStack , $rootScope )=>{

	return {
		handlerErr: function( resp ){
			if( resp.err){
				console.log( "$modalStack = ", $modalStack );
				
				$modalStack.dismissAll();
				$rootScope.$broadcast( "$cloasMask" ); 
				angular.alert( { warn: $translate.instant('err.'+resp.err  )  } ) ;

			}

		}

	}

}