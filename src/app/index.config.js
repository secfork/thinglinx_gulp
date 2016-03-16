export default function config($logProvider, $stateProvider, $urlRouterProvider,
    $controllerProvider, $compileProvider,
    $filterProvider, $provide, $httpProvider,
    $resourceProvider, $translateProvider

) {

    'ngInject';
 

    $provide.decorator('$rootScope', function($delegate) {

        var $new_proxy = $delegate.$new;
        $delegate.$new = function() {
            var $scope = $new_proxy.apply(this);
            $scope.$on("$destroy", function(event) {
                console.log(" Scope Destroy!!");
            });

            $scope.$on("$cloasMask", function(event) { 
                console.log(" $cloasMask event  !!") 
                $scope.showMask = false ;
 
            })


            return $scope;
        };


        return $delegate;
    })




    // Enable log
    // $logProvider.debugEnabled(true);

    // Set options third-party lib
    // toastrConfig.allowHtml = true;
    // toastrConfig.timeOut = 3000;
    // toastrConfig.positionClass = 'toast-top-right';
    // toastrConfig.preventDuplicates = true;
    // toastrConfig.progressBar = true;

    // 自定义 ajax 拦截器;
     $httpProvider.interceptors.push('httpInterceptor');


    $resourceProvider.defaults.actions = {
        put: { method: "PUT" },
        get: { method: "GET" },
        post: { method: "POST" },
        "delete": { method: "DELETE" },

        remove: { method: "DELETE" },
        getByPk: { method: "GET" },
        delByPk: { method: "DELETE" },

        save: { method: "POST" },
        getArr: { method: "GET", isArray: !0 },
        query: { method: "GET" }

    }

    // lazy controller, directive and service

    // thinglinx.controller = $controllerProvider.register;
    // thinglinx.directive = $compileProvider.directive;
    // thinglinx.filter = $filterProvider.register;
    // thinglinx.factory = $provide.factory;
    // thinglinx.service = $provide.service;
    // thinglinx.constant = $provide.constant;
    // thinglinx.value = $provide.value;

    // 自定义 转换 拦截器;   

    $translateProvider.translations('en', window.en);
    $translateProvider.translations('zh', window.zh);



    $translateProvider.useInterpolation('custom_translate');

    $translateProvider.preferredLanguage('zh');
    $translateProvider.useLocalStorage();





}
