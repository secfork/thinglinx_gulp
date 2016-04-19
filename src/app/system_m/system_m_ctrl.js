 

import bmap from "../lib/utils/bmap";


export default ($scope, $sys, $source, $interpolate, $q, $compile, $translate, $interval, $state, $stateParams, $utils, $filter, $timeout, $templateRequest) => {
    "ngInject";

    var thatScope = $scope;

    var isManage = $state.current.data && $state.current.data.manage ,
        isRegionAttr = $state.current.data && $state.current.data.regionAttr ,

        region_id =   $stateParams.id && parseInt(  $stateParams.id  ) ,
        state = isManage? undefined: 1;  // 管理加载全部, 展示 只加载 激活的; 
 
 
    $scope.isManage = isManage ;
    $scope.isRegionAttr = isRegionAttr ;

    $scope.od = { state: state  , region_id : region_id  };
    $scope.op = { lm: "list" };
    // 复位 按钮 ; 
    $scope.reSet = function() {
        $scope.od = { state: state  , region_id : region_id   };
        $scope.loadPageData(1);
    }



    // 点击 系统名称时 跳转 路径;  有可能还是 show 部分要用 该函数; 
    $scope.getNextSystemState = ( das )=>{ 
        return   "app.m_system_attr.basic({uuid:'"+ das.uuid +"', model:'"+ das.model+"'  })" ;
    };

  


    $scope.page = {};


    $scope.panel = isManage ? {
            subject: "system.sysManage",
            title: "system.sysList",
            pagger: true,
            panelBotButs: []
        } :

        {
            subject: "nav.system",
            title: "system.sysList",
            pagger: true

        };



    var botButs = [{
        text: "system.add",
        classFor: " btn-primary",
        handler: createSystem
    }]



    $scope.tableHeaders =
        isManage ? [
            { text: "system.online", w: "5%" },
            { text: "system.name", w: "20%" },
            { text: "ID", w: "20%" },
            { text: "nav.region", w: "20%" },
            { text: "system.state", w: "10%" },
            { text: "text.desc", w: "25%" },
            { text: "system.stateOptions.1", w: "5%" },
            { text: "system.sync", w: "5%" },
            { text: "text.del", w: "5%" },
        ] : [
            { text: "system.online", w: "5%" },
            { text: "system.name", w: "20%" },
            { text: "ID", w: "20%" },
            { text: "nav.region", w: "20%" },
            { text: "text.desc", w: "25%" }
        ] ;
    if( isRegionAttr ){
        $scope.tableHeaders.splice( 3 , 1)
    }
 

    $scope.$watch("op.lm", function(n) {
        $scope.panel.pagger = n == 'list';
        if( isManage ){
              $scope.panel.panelBotButs = (n == "list" ? botButs : []);
        } 
    })

    // 加载 系统模型;   
    var loadSysmodel = $source.$sysModel.get({ currentPage: 1 }, function(resp) {
        $scope.sysModels = resp.ret;
    }).$promise;


    // 加载区域  并建立 区域的 id self 索引; 
    $scope.regionID_Self = {};

    // 如果是 RegionAttr 属性 , 则是按id 查 region; 
    var loadRegion ;
    if(isRegionAttr) {
        // region attr router 中 加载了  region 数据;  
        $scope.regionID_Self = { [region_id]:  $scope.region }
    }else{
        loadRegion = $source.$region.get({ currentPage: 1 }, function(resp) {
                    $scope.regions = resp.data;

                    angular.forEach($scope.regions, (v) => {
                        $scope.regionID_Self[v.id] = v;
                    });  
                }).$promise;

    }
 


    // 加载 分页 system 数据, 并建立 当前页没 system 的 uuid self 索引;  用于 同步 ;
    var systemUUID_Self;

    function loadSystem(pageNo) {
        systemUUID_Self = {};
        return $utils.loadSystem($scope, pageNo).then(
            function() {
                angular.forEach($scope.page.data, function(v) {
                    systemUUID_Self[v.uuid] = v;
                });
                $scope.showMask = false;
            }, $utils.handlerErr
        )

    }



    var interval_queryOnline
    $scope.$on("$destroy", function() {
        // 清除 查询 在线状态的 interval , 
        $interval.cancel(interval_queryOnline);
    })

    $scope.loadPageData = function(pageNo) {


        // 清除 查询 在线状态的 interval ,
        $interval.cancel(interval_queryOnline);
        $scope.showMask = true;

        if ($scope.op.lm == "map") {

            loadSystemForMap = $source.$system.get(angular.extend({ options: "queryformap" }, $scope.od)).$promise;
            loadSystemForMap.then((resp) => {
                map.clearOverlays();
                map.addOverlay(createSystemOverlay(resp.ret));
                $scope.showMask = false;

            });
            return;
        }

        loadSystem(pageNo).then(function() {

            if ($scope.od.state == 1 || $scope.od.state == undefined) {
                var systemUUids = Object.keys(systemUUID_Self); 
                $utils.querySystemOnline(systemUUids, $scope.page.data);
                //  实时 查询 在线 状态; 
                interval_queryOnline = $interval(function() { 
                    // 期间可能删除或 添加了 system ;
                    var systemUUids = Object.keys(systemUUID_Self); 
                    $utils.querySystemOnline(systemUUids, $scope.page.data);
                }, $sys.state_inter_time)
            }
            // 查询 是否需要 同步;   
            isManage && queryNeedSync(systemUUids, systemUUID_Self);

        })

    };




    // 加载同步状态 ; 
    function queryNeedSync(uuids, systemUUID_Self) {
        return $source.$system.needSync(uuids, (resp) => {
            angular.forEach(resp.ret, (v, i) => {
                systemUUID_Self[i].needsync = v;
            })
        }).$promise
    }


    $scope.loadPageData(1);


    $scope.updateSystem = function(idObj) {
        return $source.$system.put({}, idObj).$promise;
    }


    function createSystem( ) {
        angular.open({ title: "system.add", templateUrl: "app/system_m/system.add.html" },

            function($scope) {
                "ngInject";
                $scope.regions = thatScope.regions;
                $scope.sysModels = thatScope.sysModels;

                $scope.isRegionAttr = isRegionAttr ;

                $scope.system = {
                    region_id: region_id
                };

                $scope.od = {
                    systemModel: undefined,
                };


                $scope.$watch("od.systemModel", function(n, o) {
                    if (!n) return;

                    // 加载  profile;
                    if (n.mode == 2) {
                        delete $scope.system.network;
                    } 
                    $scope.showMask = true;
                    $source.$sysProfile.get({
                        system_model: n.uuid
                    }, function(resp) {
                        $scope.profiles = resp.ret;
                        $scope.system.profile = resp.ret[0] && resp.ret[0].uuid;
                        $scope.showMask = false;
                    }, function() {
                        $scope.showMask = false;
                    })

                })


                $scope.done = function() {
                    $scope.validForm();
                    $scope.showMask = true;

                    // $scope.system.network = angular.toJson($scope.system.network);
                    var sys = angular.extend({
                        model: $scope.od.systemModel.uuid
                    }, $scope.system );


                    $source.$system.save(sys, function(resp) {
                        // alert("创建成功!");  
                        sys.uuid = resp.ret;
                        sys.state = 0;

                        // 添加数据; 
                        thatScope.page.data.unshift(sys);
                        // 添加索引; 
                        systemUUID_Self[ sys.uuid ] = sys ;


                        $scope.cancel();
                        angular.confirm({
                                title: "配置系统",
                                note: "创建成功,是否去配置该系统?",
                                doneText: "是",
                                cancelText: "不用了"
                            },
                            function(next) {
                                $scope.goto("app.m_system_prop._config", sys, sys);
                                next();
                            }
                        ) 
                        $scope.showMask = false;

                    }, function() {
                        $scope.showMask = false;
                    })
                }


            }
        )
    }


    // 失效系统; 
    $scope.effStation = function(dastations, station, index, todel) {

        angular.confirm({
            // title: "失效系统 " + station.name,
            note: ['system.noteUnActive', station.name] //"确认要失效该系统吗?"
        }, function(next) {
            var d = { uuid: station.uuid, state: 0 };
            $source.$system.deactive({ pk: station.uuid }, function() {
                station.state = 0;
                todel && (dastations.splice(index, 1));
                next();
            }, $utils.handlerErr)

        })
    };

    // 激活系统; 
    //激活采集站;
    //  jump 是否 跳转;
    $scope.activateStation = function(dastations, station, index, jump) {

        angular.confirm({
            // jjw 采集站->系统
            // title: "激活系统 " + station.name,
            note: ["system.noteActive", station.name] //确认要激活该系统吗?"
        }, function(next) {
            // 激活采集站;
            $source.$system.active({
                pk: station.uuid
            }, function(resp) {
                station.state = 1;
                dastations && (dastations.splice(index, 1));
                next();
                jump && $scope.goto('app.station.prop._basic', station, station);

            }, $utils.handlerErr);
        })
    };

    // 移除;
    $scope.delStation = function(dastations, station, index) {
        angular.confirm({
            //title: "您是否要删除系统:" + station.name,
            note: ["system.noteDel", station.name],
            warn: "system.warnDel" //"删除系统将会丢失此系统的全部历史数据"

        }, function(next) {
            $source.$system.delete({
                system_id: station.uuid
            }, function(resp) {
                
                // 删除 数据; 
                dastations.splice(index, 1);
                // 删除 索引;
                delete  systemUUID_Self[ station.uuid ]

                next();
            }, function() {

                next()
            });
        })
    };



    // 同步 das 配置;
    $scope.syncSystem = function(das, e, scope) {


        // if( scope._$preventDefault){
        //     angular.alert("请不要频繁操作!");
        //     return ;
        // }
        // scope._$preventDefault = true ; 

        //@if  append 
        console.log(das, this, e.currentTarget);
        //@endif 

        var that = this;
        this._show_sync_ok = false;
        this._show_sync_error = false;

        $source.$system.sync({ pk: das.uuid }, function(resp) {

            das.needsync = false;
            that._show_sync_ok = true;
        }, $utils.handlerErr);
    };


    var map, loadSystemForMap;

    $scope.initMap = function() {
        //$scope.showMask = true;

        map = bmap.createMap($scope, "bdmap", 168);
        $interval.cancel(interval_queryOnline);

        loadSystemForMap = loadSystemForMap || $source.$system.get(
            angular.extend({ options: "queryformap" }, $scope.od)
        ).$promise;

        loadSystemForMap.then(function(resp) {

            map.addOverlay(createSystemOverlay(resp.ret));

            $scope.showMask = false;
        })

    }

    function createSystemOverlay(systemArray) {
        var collection = bmap.createPointCollection(systemArray);

        collection.addEventListener("mouseover", pointMouseOver);
        collection.addEventListener("mouseout", pointMouseOut);

        return collection;

    }


    function pointMouseOut(e) {
        var point = e.point;
        point.marker.closeInfoWindow();

        map.removeOverlay(point.marker);


    }
    // point moudse over ;
    var timeOutGetSystemStatus;

    function pointMouseOver(e) {
        var point = e.point,
            system = point.system;


        system.region_name = $scope.regionID_Self[system.region_id].name;



        $timeout.cancel(timeOutGetSystemStatus);

        timeOutGetSystemStatus = $timeout(function() {
            $source.$system.status([system.uuid], function(resp) {
                // 获取 单个 系统的在线 状态; 
                $("#one_system_status").addClass(resp.ret[0] ? 'fa-circle  text-success' : 'fa-circle text-danger');

            })
        }, 500)


        if (!point.marker) {
            var marker = new BMap.Marker(point, bmap.pointOptions);

            marker.addEventListener('click', function() {
                $scope.goto($scope._$stationState, system);
            })
            point.marker = marker;
        }

        $templateRequest("app/system_m/map.info_window.html").then(function(html) {

            // s.proj_name = s.proj_name || projName; // ;
            system.create_time = $filter("date")(system.create_time, "yyyy-MM-dd hh:mm:ss");
            // system 类型;
            // system.type =  $sys.stationtype.values[s.type].k ; 
            // var str =  $compile ( $interpolate(html)(system) ) ( $scope ).html();

            var str = $compile($interpolate(html)(system))($scope)[0],

                infoWindow = new BMap.InfoWindow(str,  bmap.infoWindowOptions );

            point.marker.openInfoWindow(infoWindow);
        })

        map.addOverlay(point.marker);
    }




    return;
    //==============================================================
    //==============================================================
    //==============================================================
    //==============================================================








    // $scope.reset = function() {
    //     $scope.od = {
    //         state: undefined,
    //         region_id: region_id
    //     };
    //     $scope.loadPageData(1);
    // }


    //  切换到 地图; 
    var map, points;
    $scope.initMap = function(dom) {
        map = $map.createMap($scope, "bdmap", 268);

        $map.createDAPoint2Map(map, $scope.page.data, showMsgHandler);

    }

    function showMsgHandler(event) {
        // this =  dbpoint ; 
        var system = this.system,
            that = this;

        //console.log( $templateCache.get("athena/dastation/prop_map_popup.html") )
        $http({
            url: "athena/dastation/prop_map_popup.html",
            cache: $templateCache
        }).success(function(html) {
            // s.proj_name = s.proj_name || projName; // ;
            system.create_time = $filter("date")(system.create_time, "yyyy-MM-dd hh:mm:ss");
            // system 类型;
            // system.type =  $sys.stationtype.values[s.type].k ; 
            var str = $interpolate(html)(system);
            var infoWindow = new BMap.InfoWindow(str);
            that.openInfoWindow(infoWindow);
            //  删除 手机 小图片;
        })
    }
    // 创建定位;
    function createPositionHandler() {


    }

    // 编辑定位; 
    function editPositionHandler() {

    }





}
