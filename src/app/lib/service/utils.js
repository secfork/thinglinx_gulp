export default ( $translate  , $modalStack , $rootScope  , $sys )=>{
	"ngInject";
	return {
		//  关闭所有 modal , 然后 alert ; 
		handlerErr: function( resp ){  
				$modalStack.dismissAll();
				// $rootScope.$broadcast( "$cloasMask" ); 
				angular.alert( { warn: $translate.instant('err.'+resp.err  )  } ) ; 
		} ,

		// 只 提示 不 关闭 modal ; 
		handlerRespErr : function( resp ){ 
		 	angular.alert( { warn: $translate.instant('err.'+resp.err  )  } ) ; 
			 
		}  
		// [ a, b,c ]  =>  { a:true , b:true , c:true }
		, array2Obj : ( array )=>{
			var  x = {} ;
			angular.forEach( array , (v)=>{
				x[v] = true ; 
			})
			return  x ; 
		}
		// { a:true , b:false , c:true  } => [ a ,c ]
		, obj2Array	: ( obj )=>{
			var x = [];
			angular.forEach( obj , (v ,i )=>{
				if( v ){
					x.push(i)
				}
			})
			return  x ; 
		}




	}

}