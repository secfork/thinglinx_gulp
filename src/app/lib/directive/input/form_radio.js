 

/*
<div class="radio"   ng-repeat = "  (k,v) in radio ">
    <label class="i-checks">
        <input type="radio" ng-value="k" 
               ng-model=""   >
        <i></i>
        {{::v}} 
    </label>
</div> 


*/





 export  default ( $compile )=>{

	"ngInject";
	return  {
		restrict:"E", 
		replace:true , 
		// scope:true,

		templateUrl:"app/directive/input/form_radio.html",
		link: ( scope , ele ,attrs )=>{

			scope.radio =  scope.$parent.$eval( attrs.radio );

			var s = scope ;

			console.log( scope.radio  )

		}
	}

} 