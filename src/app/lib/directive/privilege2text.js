

/*

	<span>{{::text}}</span>

*/




// scope 中要指明 role_category 的种类; 

export default ($compile,  $sys , $translate ) => {
    "ngInject";

    return {
    	scope: { privilege2text : "=" } ,
    	restrict: "A",
    	//replace:true , 
    	// template:"<span>111{{ priviageText}}</span>" ,
    	link: ( scope , ele , attrs  )=>{
            
            // 只是  $$lang 变化时, 
            // 当 privil 变化时 没法 处理 , 除非 重回  role 列表 究竟是  repeat 来 重绘的 ; 

            if( angular.isDefined( attrs.fresh) ){
                scope.$watch( 'privilege2text' , a )

            }



    		scope.$watch( "$$lang" , a )
 			function a(){  
                
                console.log(1111111)
                var  translateId =  [ 
                     scope.role_category == "1" ?"regionPermission":"accountPermission" ,
                     undefined ,
                     "text" ];  

                //var priviage =  scope.$eval(  attrs.privilege2text ) ;
                var  priviage = scope.privilege2text ; 

                if( priviage ){ 
                    var x = priviage.map( function( v ){
                        translateId[1]= v ; 
                        return   $translate.instant( translateId.join('.')) 
                    }).join(" , ");
                    ele.text(x) 
                }
 

            }

    	}
    }
     

}