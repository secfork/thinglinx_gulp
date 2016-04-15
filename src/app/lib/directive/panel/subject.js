

export default  ( $compile )=>{
	'ngInject';

	return {
		restrict:"E",
		transclude:true,
		// scope: { subject:"=" },
		replace:true , 
		templateUrl:"app/lib/directive/panel/subject.html",
		link:( scope , ele, attrs ,  ctrl , transclude  )=>{
			
			if( attrs.subject ){ 
				scope.$watch( attrs.subject , function( n ){ 
					scope.panel.subject = n 
				}) 
			}
		 		 
			transclude(  function(  cloneLinkFn ,futureParentElement ){

				console.log( "tl panel  transclude = ", cloneLinkFn , futureParentElement )
			})

		}
	}

}