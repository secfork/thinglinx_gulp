 export default ( $compile , $timeout ) => {
     "ngInject";
     var spinner = '<i class="fa fa-spin hide fa-spinner pull-right" ></i>';
     return {
         restrict: "A",
         require: ["?^ngDisabled"],
         link: function(scope, $ele, attrs, fn) {

             $ele.css({
                 opacity: 1
             });

             if (attrs.spinner != undefined) {
                 $ele.append(spinner);
             }

             $ele.on("click", function() {
                 var that = this;

                 that.disabled = true;
                 $(that).find("i").toggleClass("show")

                 $timeout(function() {
                     that.disabled = false
                     $(that).find("i").toggleClass("show")
                 }, attrs.token || 2000)
             });
         }

     }

 }
