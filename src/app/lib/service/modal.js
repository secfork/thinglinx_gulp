export default ($modal, $rootScope) => {

    "ngInject";

    console.log("modal service run ");


    /**
      form ;
      options   =  {  title  , templateUrl ,  resolve }
      contorller =  ( $scope )=>{ }

      alert ; 
      options =  { type="alert" , title  , note , wran ,  }
      contorller = null ;

    
      invoke ;
      options =  { type="invoke" , title  , note , wran }
      contorller = funtion  ;
 

    */
 

    return (options, controller) => {

        console.log(typeof controller)


        var modalScope = $rootScope.$new(),
            openedWin;

        angular.extend(modalScope, options);

        modalScope.cancel = function() {
            openedWin.dismiss();
        };
 
        if (options.templateUrl) {
            openedWin = $modal.open({
                templateUrl: 'app/lib/service/modal.html',
                scope: modalScope,
                resolve: options.resolve,
                controller: controller
            });

        } else {

            modalScope.done = controller;

            openedWin = $modal.open({
                templateUrl: 'app/lib/service/modal.' + options.type + '.html',
                scope: modalScope,
                resolve: options.resolve,

            });


        }


 


    }



}
