export default function runBlock($rootScope, $state, $stateParams, $sys, $compile,
    $localStorage, $cacheFactory, $log, $sce, $sessionStorage  , modal ) {

    'ngInject';
    $log.debug('runBlock end');

    $('#preload').fadeOut('slow');

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$sys = $sys; 
    $rootScope.$sceHtml = $sce.trustAsHtml;
    $rootScope.$session = $sessionStorage;
    $rootScope.fromJson = angular.fromJson;

     // 模态框 ;

    $rootScope.open = modal.open ;
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

    $rootScope.test = function() {
            alert("test  function !")
        }
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
