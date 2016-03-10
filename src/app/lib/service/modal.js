export default ($modal, $rootScope) => {

    "ngInject";

    /**
     
      options : {
          doneText  ,  cancelText ,
          templateUrl ,
          title , note , warn ,

          resolve  ,  //   permission ; 
      }



     modal ( templateUrl) ;    type = "modal"
     args = (  options,  controller );


      alert ;   type="alert"
      options =  {  options ,  callback  } ;


    
      conform ;  type="comform"
      options =  {    options , done_callback , cancel_callback } 

    */ 


    function handler(options, controller, closehandler)  {
         

        var modalScope = $rootScope.$new(  false  ),
            openedWin;

        options.doneText = options.doneText || "text.done";
        options.cancelText = options.cancelText || "text.cancel";

        angular.extend(modalScope, options);


        console.log(" modalScope = " , modalScope )

        modalScope.cancel =  function(){ 
          alert(1)
          if( closehandler ){
              closehandler( openedWin.dismiss )
          }else{
              openedWin.dismiss();
          } 
        } 

        if (options.type == 'modal') {
            if (!options.templateUrl) {
                alert("无 templateUrl");
                return;
            } 
            openedWin = $modal.open({
                templateUrl: 'app/lib/service/modal.html',
                scope: modalScope,
                resolve: options.resolve,
                controller: controller
            });
        };

        if (options.type == 'alert') {
            modalScope.done = modalScope.cancel ;
            openedWin = $modal.open( {
                templateUrl:"app/lib/service/modal.alert.html",
                scope: modalScope
            })  
        } 

        if( options.type =="confirm"){
            modalScope.done = function(){
              if( controller ){
                  controller( openedWin.dismiss )
              }else{
                  openedWin.dismiss();
              } 
            } 
            openedWin = $modal.open({
                templateUrl:"app/lib/service/modal.alert.html",
                scope : modalScope
            })

        }  
    }

    return {
        open: function( options={}, controller ) {

            console.log( 'parnet scope =' ,this );

            options.type = 'modal';
            handler( options , controller );
        },
        alert: function( options={} ) {
            options.type = 'alert';
            options.title = "text.alter";
            handler( options );
        },

        confirm: function( options={}, controller, closehandler ) {
            options.type = "confirm";
            handler( options , controller , closehandler )
        }

    }

}
