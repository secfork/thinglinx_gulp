

export default  ( $compile )=>{
	'ngInject';

	return {
		restrict:"E",
		transclude:true,
		replace:true , 
		templateUrl:"app/lib/directive/panel/subject.html",
		link:( scope , ele, attrs ,  ctrl , transclude  )=>{
			
		 		 
			transclude(  function(  cloneLinkFn ,futureParentElement ){

				console.log( "tl panel  transclude = ", cloneLinkFn , futureParentElement )
			})

		}
	}

}