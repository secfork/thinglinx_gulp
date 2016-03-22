


/* 


	$scope.panel = {
	   subject: "region_m.subject",
	    title: "region_m.title",
	    pagger: true,

	    panelTopButs: [
	        {text:"ss"  , classFor , handler }
	    ],

	    panelBotButs: [{
	        text: "添加区域",
	        classFor: " btn-primary",
	        handler:   addProj 
	    }]
	}; 

    
*/
export default  ( $compile )=>{
	'ngInject';

	return {
		restrict:"E",
		transclude:true ,
		replace:true , 
		templateUrl:"app/lib/directive/panel/panel.html",
		link:( scope , ele, attrs ,  ctrl , transclude  )=>{

		 		 
			transclude(  function(  cloneLinkFn ,futureParentElement ){

				console.log( "tl panel  transclude = ", cloneLinkFn , futureParentElement )
			})

		}
	}

}