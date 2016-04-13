

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
		  
        var  mapCenter = null ;

		map =bdMap.createMap( $scope , "sysmap" , 230 , mapCenter );

		bdMap.addSearch( map , "suggestId", "searchResultPanel" );

		if( system.latitude){ 
			addMarker(); 
		}

	};




 	// 移动定位把;
        function moveMarker(e) {
            if(!marker){ 
                marker = bdMap.createMarker( e.point.lng, e.point.lat ); 
                map.addOverlay(marker); 
            } 
            marker.setPosition( e.point ) 
        }

 	// 初始定位, 坐落 定位把 位置;  待确定 ; 
        function toLocationSystem() { 
        	
            $scope.op.toNewLocation = true ;
            // 获得  address ; 
            openLocationInfoWin(); 
            marker.addEventListener('click' , openLocationInfoWin );

            map.removeEventListener("mousemove", moveMarker);
            map.removeEventListener("click", toLocationSystem);
 
        }
 
	// 添加 marker时 获取  location地址;  
	$scope.locationMsg = {};


    // 初始状态  定位;
	function addMarker (){

		marker = bdMap.createMarker( system.longitude , system.latitude   ) ;
	    
  		marker.addEventListener( 'click' , openLocationInfoWin ) ;

		map.addOverlay(  marker ); 

        map.panTo(  new BMap.Point(  system.longitude , system.latitude ) )
        openLocationInfoWin();

	}


    function removeMapkerAndMapLinser(){
        marker.removeEventListener( "click" ,  openLocationInfoWin );
        marker.closeInfoWindow( infoWindow);
        map.removeEventListener('mousemove' , moveMarker);
        map.removeEventListener('click' , toLocationSystem); 
        
    }


    // 新建 定位 ; 
    $scope.markLocation = function() {

        if (marker){
           removeMapkerAndMapLinser();
           map.removeOverlay( marker ) ;
           marker = null ;
        } ; 
  
        $scope.op.toNewLocation = true;

        map.addEventListener('mousemove', moveMarker);
        map.addEventListener('click' , toLocationSystem );

        //map.addEventListener('click', toLocationSystem)

    }
 
	function openLocationInfoWin() {
	    // var marker = this;   
	    $templateRequest("app/system_m/system_attr_map_location.html").then((htmlText) => {
	         
            infoWindow = new BMap.InfoWindow( $compile(htmlText)($scope).get(0)  , bdMap.infoWindowOptions  );

            // 添加  关闭 监听 , 恢复 原始位置; 
            infoWindow.addEventListener('clickclose' , removeOrReverseLocation );
             
	        marker.openInfoWindow( infoWindow, marker.point );

            //  获取地址  
            bdMap.getLocation( marker.point , ( result )=>{  
                $scope.$apply(()=>{
                    angular.extend(  $scope.locationMsg , marker.point , { address :  result.address } ) ;
                }) 
            }); 

	    }); 
	}

    // 关闭 infowin 时  回调, 不点 确定位置 , 恢复原始位置;
    // 点的 window 上的 X 关闭了 window , 还是 点击 移动位置 关闭了window ; 
    //  待固定位置 ,没点确定,  但是 想换位置时;  不删除marker ,  ( 点移动位置)  ( close 事件 )
    //  待固定位置 , 没点确定 , 关闭 window , 不进行定位了, 删除 marker ( 点 X ) ( clickclose 事件 );  
 
    function  removeOrReverseLocation ( e ){

        if( $scope.op.toNewLocation ){  
            if( system.longitude ){  // 需要定位 但是 关闭了  window ;  回到原位置; 
                $scope.op.toNewLocation = false ;  // 回到原位置 不需要 新定位了; 
                var  p = new BMap.Point( system.longitude , system.latitude  );
                marker.setPosition(  p )
            }else{ 
                map.removeOverlay( marker ); 
            } 
        }    
    }



    // 确定位置; 
	    $scope.locatedSation = function() {

	        var d = {
	            uuid: $scope.system.uuid,
	            longitude: marker.point.lng,
	            latitude: marker.point.lat
	        };

	        $source.$system.put(d, function(resp) { 
	            $scope.op.toNewLocation = false;
	            angular.extend($scope.system, d);
                marker.closeInfoWindow( infoWindow )

	            // angular.alert("定位成功!") 
	        });

	    }

  	// 点击 移动  按钮 ; 使 定位把 跟随 鼠标  ; 
        $scope.letMarkerMove = function() { 
            marker.closeInfoWindow( infoWindow );
            marker.removeEventListener("click" , openLocationInfoWin ); 

            $scope.op.toNewLocation = true; 

            map.addEventListener("mousemove", moveMarker );
            map.addEventListener("click", toLocationSystem);
        }

 	  

 	//  删除marker ,若station有坐标也删除 staation定位; 
        $scope.delMarker = function() {

            if (!marker) return;  
            removeMapkerAndMapLinser(); 
            marker = null;
            infoWindow = null; 

            if ($scope.system.latitude) {
                var d = {
                    uuid:   system.uuid ,
                    longitude: "",
                    latitude: ""   //  0 0 坐标既是 删除 坐标位置, 易出 bug ; 
                };
                $source.$system.put(d, function() {
                    $scope.system.longitude = 0;
                    $scope.system.latitude = 0;
                    map.clearOverlays();
                    // angular.alert("成功移除定位!"); 
                })
            } else {
                map.clearOverlays();
            }
        }








}