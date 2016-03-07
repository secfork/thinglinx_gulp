export  default ( $timeout )=>{
	"ngInject";
	return {
        restrict: "A",
        link: function($scope, $element, $attrs) {

           // $element.addClass("pos-rlt");
            var $maskDom = $('<i class="fa fa-spin fa-3x  text-info fa-spinner hide pos-abt" style="top:50%;left:50%;z-index:9999" ></i>'),
                wtcher =  $attrs.loadMask || "showMask";


            $element.append($maskDom);
 
            $scope.$watch( wtcher , function(n) {
                
                console.log("showMask =", n);
 
                (n ? show : hide)();

            })

            function show() {
                $maskDom.addClass("show");
            }

            function hide() {
                $maskDom.removeClass("show");
            }
        }
    }

} 