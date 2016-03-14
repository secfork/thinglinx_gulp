export default function runBlock($rootScope, $state, $stateParams, $sys, $compile,
    $localStorage, $cacheFactory, $log, $sce, $sessionStorage  , modal  , $translate ) {

    'ngInject';
    $log.debug('runBlock end');

    $('#preload').fadeOut('slow');

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$sceHtml = $sce.trustAsHtml;
    $rootScope.$session = $sessionStorage;
    $rootScope.fromJson = angular.fromJson;

    $rootScope.$sys = $sys;  
    window.sys = $sys ;
    window.instant = $translate.instant

     // 模态框 ;
 
    $rootScope.open = modal.open ;
 // 让 select 支持 {k:v} , k为number 时 的回显 ;  
    $rootScope.parse = parseInt ;
    $rootScope.extend = angular.extend ;
    $rootScope.fromJson = angular.fromJson ;


    // function(){
    //    modal.open.apply( this,  arguments );
    // };
    angular.open = modal.open ; 
    angular.alert = modal.alert;
    angular.confirm= modal.confirm


    //@if  append
    window.test = function() {
        alert("test  function !")
    };
    $rootScope.funTest = function(){
        console.log(' rootScope.funText run !! ');
        return "funcTest";
    };
     
    //@endif
 

   

    
    // 表单验证; 
    $rootScope.validForm = function(formName, scope) { 
        console.log(" valid Form  Scope " , this )
 
        formName = formName || "form";
        var that = scope || this;
        var valids = that[formName] || // 递归去找 ? 不了;
            that.$$childTail[formName] ||
            that.$$childTail.$$childTail[formName];

        if (valids && valids.$invalid) {
            // 处理 form 的 validate ;
            var errName;
            angular.forEach(valids.$error, function(e, k) {
                //@if  append 
                console.log(e);
                //@endif
                angular.forEach(e, function(modelCtrl, k1) {
                    modelCtrl.$setDirty(true); // = true ; 

                    //modelCtrl.$setViewValue(modelCtrl.$viewValue);

                })
            });  
            throw (" form invalid !!", valids.$error); 
        }
    }



 



}
