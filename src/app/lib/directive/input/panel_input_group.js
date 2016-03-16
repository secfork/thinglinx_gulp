export default () => {


    "ngInject";
    return {
        restrict: "E", 
        transclude:true ,
		replace:true ,  
        template: '<div class="row m-l-xs m-r-xs m-t"  ng-transclude > </div>'
    }
}
