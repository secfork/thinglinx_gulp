

import bdMap from "../lib/utils/bmap";


export default  ( $scope , $source , $element , $templateRequest , $compile )=>{
	"ngInject";
 	 
 	var map  ,
 		system = $scope.system ,
 		infoWindow ,
 		marker 
 	; 


    $scope.op = {};

	$scope.initMap  =  function ( ) {
		
		map =bdMap.createMap( $scope , "sysmap" , 230);

		bdMap.addSearch( map , "suggestId", "searchResultPanel" );

		if( system.latitude){
			
			addMarker();

		}

	};

	$scope.markLocation = function() {

        if (marker) return;

        marker = bdMap.createMarker(0, 0, $scope.system.name );
        marker.enableDragging();

        map.addOverlay(marker);

        $scope.op.toNewLocation = true;

        map.addEventListener('mousemove', moveMarker);
        map.addEventListener('click', toLocationSystem)

    }

 	// 移动定位把;
        function moveMarker(e) {
            marker && marker.setPosition(e.point)
        }

 	// 初始定位,松开移动 , 坐落 定位把 位置;  待确定 ; 
        function toLocationSystem() { 
        	
            // 获得  address ; 
            openLocationInfoWin(); 

            map.removeEventListener("mousemove", moveMarker);
            map.removeEventListener("click", toLocationSystem);

        }



	// 添加 marker时 获取  location地址; 

	$scope.locationMsg = {};
	function addMarker (){
		marker = bdMap.createMarker( system.latitude , system.longitude  ) ;
	    
  		marker.addEventListener( 'click' , openLocationInfoWin ) ;

		map.addOverlay(  marker );

		// 给  locationiMsg 赋值 ; 
	    bdMap.getLocation( marker.point , ( result )=>{  
			angular.extend(  $scope.locationMsg , marker.point , { address :  result.address } ) ;
		}); 

		map.centerAndZoom(marker.point, 12);
	}

 

	function openLocationInfoWin() {
	    var marker = this;  
	    $templateRequest("app/system_m/system_attr_map_location.html").then((htmlText) => {
	        infoWindow = new BMap.InfoWindow($compile(htmlText)($scope).get(0));
	        marker.openInfoWindow(infoWindow, marker.point);
	    }); 
	}



    // 确定位置; 
	    $scope.locatedSation = function() {

	        var d = {
	            uuid: $scope.station.uuid,
	            longitude: marker.point.lng,
	            latitude: marker.point.lat
	        };

	        $source.$system.put(d, function(resp) {
	            marker.disableDragging();
	            $scope.op.toNewLocation = false;
	            angular.extend($scope.station, d);
	            // angular.alert("定位成功!") 
	        });

	    }

  	// 移动 ; 使 定位把 可移动 ; 
        $scope.letMarkerMove = function() {
            marker.enableDragging();
            $scope.op.toNewLocation = true;
            map.removeEventListener("mousemove", moveMarker);
            map.removeEventListener("click", toLocationSystem);
        }

 	

 	//  删除marker ,若station有坐标也删除 staation定位; 
        $scope.delMarker = function() {

            if (!marker) return;

            marker.removeEventListener('click' , openLocationInfoWin );  
            marker = null;
            infoWindow = null; 

            if ($scope.station.latitude) {
                var d = {
                    uuid: $scope.station.uuid,
                    longitude: "",
                    latitude: ""   //  0 0 坐标既是 删除 坐标位置, 易出 bug ; 
                };
                $source.$system.put(d, function() {
                    $scope.station.longitude = 0;
                    $scope.station.latitude = 0;
                    map.clearOverlays();
                    // angular.alert("成功移除定位!"); 
                })
            } else {
                map.clearOverlays();
            }
        }








}