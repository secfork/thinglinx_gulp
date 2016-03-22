

/*

	<span>{{::text}}</span>

*/



export default ($compile,  $sys , $translate ) => {
    "ngInject";

    return {
    	scope: { privilege2text : "=" } ,
    	restrict: "A",
    	//replace:true , 
    	// template:"<span>111{{ priviageText}}</span>" ,
    	link: ( scope , ele , attrs  )=>{
            
    		scope.$watch( "$$lang" , function(){  
    			
    			var  translateId =  [ 
    			     scope.role_category == "1" ?"regionPermission":"accountPermission" ,
    			     undefined ,
    			     "text" ];


    			if( scope.privilege2text ){

    				var x = scope.privilege2text.map( function( v ){
    					translateId[1]= v ; 
    					return   $translate.instant( translateId.join('.'))

    				}).join(" , ");
    				ele.text(x) 
    			}

    			


    		})
 			

    	}
    }
     

}