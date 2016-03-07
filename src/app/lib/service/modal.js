export default ($modal, $rootScope) => {

    "ngInject";

    console.log("modal service run ");


    /**
      conforme ;
      options   =  {  title  , templateUrl ,  resolve }
      contorller =  ( $scope )=>{ }

      alert ; 
      options =  { type="alert" , title  , note , wran ,  }
      contorller = null ;

    
      invoke ;
      options =  { type="invoke" , title  , note , wran }
      contorller = funtion  ;
 

    */
 

    return (options, controller , closehandler ) => {

        console.log(typeof controller)


        var modalScope = $rootScope.$new(),
            openedWin;

        angular.extend(modalScope, options);

        modalScope.cancel =  function(){
          closehandler && closehandler();
          openedWin.dismiss() ;
        } 
       
 
        if (options.templateUrl) {
            openedWin = $modal.open({
                templateUrl: 'app/lib/service/modal.html',
                scope: modalScope,
                resolve: options.resolve,
                controller: controller
            });

        } else {

            modalScope.done =  function(){
              controller &&  controller( openedWin.dismiss )
            }   
            openedWin = $modal.open({
                templateUrl: 'app/lib/service/modal.' + options.type + '.html',
                scope: modalScope,
                resolve: options.resolve,
            });


        }


 


    }



}
