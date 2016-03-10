export default function config($logProvider, $stateProvider, $urlRouterProvider,
    $controllerProvider, $compileProvider,
    $filterProvider, $provide, $httpProvider,
    $resourceProvider , $translateProvider 
) {

    'ngInject';

    // Enable log
    // $logProvider.debugEnabled(true);

    // Set options third-party lib
    // toastrConfig.allowHtml = true;
    // toastrConfig.timeOut = 3000;
    // toastrConfig.positionClass = 'toast-top-right';
    // toastrConfig.preventDuplicates = true;
    // toastrConfig.progressBar = true;

    // 自定义 ajax 拦截器;
    // $httpProvider.interceptors.push('httpInterceptor');


    $resourceProvider.defaults.actions = {
                put:    {method:"PUT"},
                get:    {method: "GET"},
                post: { method:"POST"},
                "delete": {method: "DELETE"} ,

                remove:   {method: "DELETE"},
                getByPk:{method:"GET"} , 
                delByPk:{ method:"DELETE"}, 

                save:   {method: "POST"},
                getArr: {method: "GET", isArray: !0},
                query:  {method:"GET"} 

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
    $translateProvider.useInterpolation('custom_translate');
     

    // $translateProvider.useStaticFilesLoader({
    //     prefix: 'thing/',
    //     suffix: '.json'
    // }); 

  $translateProvider.translations('en', {
    "nav": {
        "show": "show-",
        "manage": "manage-",

        "region": "region",
        "system": "系统",
        "alarm": "报警",

        "account": "账户",
        "accountInfo": "账户信息",
        "bindWechat": "微信绑定",

        "user": "用户",
        "manageUser": "用户管理",
        "manageRole": "角色管理",

        "model": "模型",
        "systemModel": "系统模型",
        "deviceModel": "设备模型"
    }
  });
 
  $translateProvider.translations('zh', {
    "nav": {
        "show": "展示",
        "manage": "管理",

        "region": "区域",
        "system": "系统",
        "alarm": "报警",

        "account": "账户",
        "accountInfo": "账户信息",
        "bindWechat": "微信绑定",

        "user": "用户",
        "manageUser": "用户管理",
        "manageRole": "角色管理",

        "model": "模型",
        "systemModel": "系统模型",
        "deviceModel": "设备模型"
    }
  });

    $translateProvider.preferredLanguage('zh');
    $translateProvider.useLocalStorage();


 


}
