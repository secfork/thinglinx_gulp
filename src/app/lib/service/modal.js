export default ($modal, $uibModal ,$rootScope , $translate ) => {

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


      alert ;   type="alert" // alert 时, 有 tempalteUrl 时, note , warn 失效;  
      options =  {  options ,  callback   } ;


    
      conform ;  type="comform"
      options =  {    options , done_callback , cancel_callback } 

    */ 


    function handler(options, controller, closehandler)  { 
        var modalScope = $rootScope.$new(), 
            openedWin;


        options.title =  $translate.instant(   options.title || "text.alert" ); 
        options.doneText =  $translate.instant(  options.doneText || "text.done" );
        options.cancelText = $translate.instant(  options.cancelText || "text.cancel" );

        if(  options.note instanceof Array ){
          //String.prototype.format.apply("$s === %s",["xxx","yy"])
            options.note =   String.prototype.format.apply(
                $translate.instant(  options.note[0] ) ,
                options.note.slice(1)
            )
        }else{
            options.note = $translate.instant( options.note );
        };

        if (  options.warn instanceof Array ){
            options.warn =   String.prototype.format.apply(
                $translate.instant(  options.warn[0] ) ,
                options.warn.slice(1)
            ) 
        }else{
            options.warn = $translate.instant( options.warn );
        }



        angular.extend(modalScope, options);
 
        console.log(" modalScope = " , modalScope )

        modalScope.cancel =  function(){  

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
            // openedWin = $modal.open( {
            openedWin = $uibModal.open( {
                templateUrl:"app/lib/service/modal.alert.html",
                scope: modalScope,
                backdropClass:'m-b'
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
                scope : modalScope,
                backdropClass:'m-b', 

            })

        }  
    }

    return {
        open: function( options={}, controller ) {   
            options.type = 'modal';
            handler( options , controller );
        },
        alert: function(  options ) { 
           if(  ! angular.isObject( options ) ){
              options = { note: options }
           } 
            options.type = "alert";  
            handler( options );
        },

        confirm: function( options={}, controller, closehandler ) {
            options.type = "confirm"; 
            handler( options , controller , closehandler )
        }

    }

}
