

import  bdMap from "../lib/utils/bmap";


export default ( $scope, $state, $filter , $compile  , $templateRequest , $interpolate )=>{
	"ngInject";


  var map;
    $scope.initMap = function() { 
 

        map = bdMap.createMap($scope, "station_map", 213 ); 
        var system = $scope.system;
        system.regionName = system.region_name //||  $scope.rg_k_v[system.region_id].name ;
        system.createTime = system.createTime || $filter("date")(system.create_time, "yyyy-MM-dd hh:mm:ss");
 
 		// 展示 system  infowindow ; 
   		if ( system.latitude != 0  )  {

 			var marker =  bdMap.createMarker( system.longitude, system.latitude );

 			map.addOverlay( marker );

 			map.panTo( marker.point  ) ;

	        $templateRequest("app/system_m/map.info_window.html").then(function(html) { 

	            var str = $compile($interpolate(html)(system))($scope)[0],

	                infoWindow = new BMap.InfoWindow(str,  bdMap.infoWindowOptions );

	            marker.openInfoWindow(infoWindow);
	        })

  			
        }











 
    }

}