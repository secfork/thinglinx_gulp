var myGeo = new BMap.Geocoder(),
    local = new BMap.LocalCity(),
 

    pointMarkerOptions = {
        offset: new BMap.Size(0, 5)
    },


    pointMouseOver2ShowSysem = (e) => {
        var point = e.point,
            system = point.system,
            marker ,

            region = region_id_self[system.region_id]  ;

        system.region_name = region|| region.name;


        $templateRequest("athena/dastation/prop_map_popup.html").then(function(html) {

            marker = point.marker = point.marker || new BMap.Marker(point, markerOptions);
           // point.marker = marker;

            map.addOverlay(marker);

            // s.proj_name = s.proj_name || projName; // ;
            system.create_time = $filter("date")(system.create_time, "yyyy-MM-dd hh:mm:ss");
            // system 类型;
            // system.type =  $sys.stationtype.values[s.type].k ; 
            var str = $interpolate(html)(system);
            var infoWindow = new BMap.InfoWindow(str);
            marker.openInfoWindow(infoWindow);
        })
    },
    pointMouseOut2CloseInfoWindow = (e) => {
        var point = e.point;
        marker = point.marker || marker;
        marker.closeInfoWindow();
        map.removeOverlay(marker);
        point.marker = null;
    } 
    ;



export default {
    
    pointOptions :   { offset: new BMap.Size(0, 5)  } ,

    markerOptions  : {   offset: new BMap.Size( 0,5)     }  , 
    infoWindowOptions : { enableCloseOnClick: false  , enableMessage :false } ,

    // // 创建地图; 
    createMap: (scope, Dom_id, h_offset) => {
            var map = new BMap.Map(Dom_id   ); // 创建Map实例


            map.centerAndZoom(new BMap.Point(116.404, 39.915), 8);

            local.get((result) => {
                map.centerAndZoom(result.center, 8);
                map.setCurrentCity(result.name);
            })

            //开启鼠标滚轮缩放
            map.enableScrollWheelZoom(true);

            // 左上角，添加比例尺
            var top_left_control = new BMap.ScaleControl({
                anchor: BMAP_ANCHOR_TOP_LEFT
            });
            //左上角，添加默认缩放平移控件
            var top_left_navigation = new BMap.NavigationControl();

            //右上角，仅包含平移和缩放按钮
            var top_right_navigation = new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_TOP_RIGHT,
                type: BMAP_NAVIGATION_CONTROL_SMALL
            });

            /*缩放控件type有四种类型:
                BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/
            map.addControl(top_left_control);
            map.addControl(top_left_navigation);

            map.addControl(  new BMap.MapTypeControl(   
                { 
                    mapTypes: [ 
                        BMAP_NORMAL_MAP 
                        //,BMAP_PERSPECTIVE_MAP 
                        , BMAP_HYBRID_MAP
                    ]
                }  
            ));

            // 取消  resize 事件 ;
            scope.$on("$destroy", function() {
                $(window).off("resize");
            })

            var $mapdom = $("#"+Dom_id )
            $(window).on("resize", function() {
                $mapdom.css({
                    height: window.innerHeight - h_offset
                });
            });
            $mapdom.css({
                height: window.innerHeight - h_offset
            });

            return map;
        }
        // 创建 mark ;  x= 经度, y= 维度 ; 
        ,
    createMarker: (x, y, text) => {
        var mark = new BMap.Marker(new BMap.Point(y, x));
        if (text) {
            label = new BMap.Label(text, {
                offset: new BMap.Size(20, -10)
            });
            label.setStyle({
                'border-width': 0,
                'font-weight': 700
            });
            mark.setLabel(label);
        }

        return mark;
    }

    // // 添加 位置搜索; 
    ,
    addSearch: (map, inputid, resultid) => {
        function G(id) {
            return document.getElementById(id);
        }

        //建立一个自动完成的对象
        var ac = new BMap.Autocomplete({
            "input": inputid,
            "location": map
        });
        //鼠标放在下拉列表上的事件
        ac.addEventListener("onhighlight", function(e) {
            var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            G("searchResultPanel").innerHTML = str;
        });

        var myValue;
        //鼠标点击下拉列表后的事件
        ac.addEventListener("onconfirm", function(e) {
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            G(resultid).innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

            setPlace();
        });

        function setPlace() {
            map.clearOverlays(); //清除地图上所有覆盖物
            function myFun() {
                var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果

                map.centerAndZoom(pp, 18);
                // map.addOverlay(new BMap.Marker(pp));    //添加标注
            }
            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }
    }

    // // //  获取 当前地址,    getLocation( callback(result) );
    ,
    // getLocation: ()=>{
    //     myGeo.getLocation
    //    // console.log( pointCollectionOptions );
    // } 
    getLocation: myGeo.getLocation


    // // // 创建 海量点 集合;  voerlayer ;
    ,
    createPointCollection: ( systemArray ) => {
        var that = this,
            collection = new BMap.PointCollection(
                systemArray.map(function(v, i) {
                    var p = new BMap.Point(v.longitude, v.latitude) // long 经度 , lat 维度 ;
                    p.system = v;

                    return p;
                }),
                {
                    size: 7,
                    shape: BMAP_POINT_SHAPE_WATERDROP,
                    color: 'red'
                }
            );

        //mouseover 显示 system 名字;  详细属性;  
        //collection.addEventListener("mouseover", that.pointMouseOver2ShowSysem);

        //collection.addEventListener("mouseout", pointMouseOut);

        return collection;

    } 





}