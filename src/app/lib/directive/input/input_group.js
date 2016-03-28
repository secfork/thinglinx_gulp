





export default () => {
 
    "ngInject";
    return {
        restrict: "E", 
        transclude:true ,
		replace:true ,  
        template: '<div class="row m-l-xs m-r-xs " style="padding-top:15px;"   ng-transclude > </div>'
    }
}
