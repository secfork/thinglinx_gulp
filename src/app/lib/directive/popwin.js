
/*

id 默认 时  ;
其他id 指定到  pk ; 
*/

export  default ( $compile, $templateCache, $http  , $utils )=>{
    "ngInject";
    
        return {
            restrict: "E",
            require: "?^ngModel",
            replace:true,
            scope: {},
            // template: ' <a class=" text-muted  {{:: __$$icon || \'glyphicon  glyphicon-edit\' }} m-l-xs  "  popover-placement="bottom"  popover-template =" pop.templateUrl "  popover-title=" {{ pop.title }}" />',
            template: ' <a class=" text-muted   fa fa-pencil  m-l-xs  {{::__$classfor}} "  popover-is-open="isOpen" popover-placement="bottom"  popover-template =" pop.templateUrl "  popover-title=" {{ pop.title }}" />',
            link: function($scope, $ele, $attrs, $model) {

                $scope.__$classfor = $attrs.classfor ; 
                
                $scope.isOpen = false ;
                $scope.pop = {
                    templateUrl: "app/debris/_edit_field.html"
                };

                var prop = $attrs.prop;
                var idObj = {},
                    idkey;

                $model.$formatters.push(function(v) {
                     if(!v){
                        return ; 
                     }
                    idkey = $attrs.pk || "id",
                        idObj[idkey] = v[idkey];
                    $scope.$ov = {
                        value: v[prop]
                    };

                });

                $scope.done = function() {

                    idObj[prop] = $scope.$ov.value;

                    $ele.parent().scope()[$attrs.handler](idObj).then(function() {

                        $model.$modelValue[prop] = $scope.$ov.value;
                        $model.$commitViewValue();
                        $scope.isOpen = false ;
                    } , 
                    $utils.handlerRespErr
                    );
                };

                $scope.cancel = function(){
                    $scope.isOpen = false ;
                }

            }
        }



} 