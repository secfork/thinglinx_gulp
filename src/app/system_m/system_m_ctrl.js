
import  b  from "../lib/utils/bmap";
 

export default ($scope, $sys, $source, modal , $q  , $interval , $state ,$stateParams , $utils ) => {
    "ngInject";

    var thatScope = $scope;
    
    $scope.al = function(){
        // b.test();
        var  x = new b();
        console.log(x);

        x.test();
    }

    $scope.od = { state: undefined };
    $scope.op = { lm:"list"};

    $scope.page = {};

    
    $scope.panel = {
        subject: "系统管理",
        title: "系统列表",
        pagger: true,

        panelTBS: [

        ],

        panelBotButs: [{
            text: "添加系统",
            classFor: " btn-primary",
            handler:   createSystem 
        }]
    };

    $scope.tableHeaders = [
        {   text: "system.online",  w: "5%"  }, 
        {   text: "system.name",   w: "20%"},
        {   text: "ID", w: "20%"        }, 
        {   text: "nav.region", w: "20%"    }, 
        {   text: "system.state",  w: "10%" },
        {  text: "text.desc",  w: "25%"  },
        {  text: "system.stateOptions.1",  w: "15%"  },
        {  text: "system.sync",  w: "15%"  },
        {  text: "text.del",  w: "15%"  }, 
    ]
 

       //是否为 show 模块;
      //  $scope.isShowModul = $state.$current.data && $state.$current.data.isShowModul;

       // $state.current.text = ($scope.project && $scope.project.name) || ($scope.isShowModul ? '系统' : '系统管理');

        // xxx 
       // $scope.from = $utils.backState("dastation_ignore_active");


        //@if  append
        // console.log("dastation_ignore_active   $stateParams = ", $stateParams, $state)
        //@endif 
 
        // var region_id = $stateParams.id;


 
        // $scope._$projState = $scope.isShowModul ? 'app.s_region_system' : 'app.m_region_prop.system';
        // $scope._$mapState = $scope.isShowModul ? 'app.s_system_prop.map' : 'app.m_system_prop._map';
        // $scope._$stationState = $scope.isShowModul ? "app.s_system_prop.basic" : "app.m_system_prop._basic";

        // $scope._$showRegionTH = $state.includes('app.m_system') || $state.includes('app.s_system');


        // $scope.active2del = true;

        // if ($scope.isShowModul) {
            // xxx
            // $scope.$moduleNav("系统", $state);
        // } else {
            // xx
           // $scope.$moduleNav($stateParams.isactive == '1' ? "已激活系统" : "未激活系统", $state);
        // }


        // $scope.updataORdel = "del";



        // 加载 系统模型;   
        var loadSysmodel = $source.$sysModel.get({ currentPage: 1 }, function(resp) {
               $scope.sysModels = resp.ret;  
           }).$promise;
 

        // 加载区域  并建立 区域的 id self 索引; 
        $scope.regionID_Self = {};
        var loadRegion = $source.$region.get({ currentPage: 1 }, function(resp) {
               $scope.regions = resp.data;

               _( $scope.regions ).forEach( (v)=>{
                    $scope.regionID_Self[ v.id ] = v ;
               })  
           }).$promise;

 

        // 加载 分页 system 数据, 并建立 当前页没 system 的 uuid self 索引; 
        var  systemUUID_Self  ;
        function loadSystem ( pageNo ){ 
            systemUUID_Self = {};

            $scope.showMask = true;
 
            // 分页加载 系统数据;
            var d = angular.extend({
                options: "query", 
                currentPage: pageNo,
                itemsPerPage: $sys.itemsPerPage
            }, $scope.od ); 

            var permise = $source.$system.query(d, function(resp) {
                                $scope.showMask = false;
                                $scope.page.currentPage = pageNo;
                                $scope.page.data = resp.data;
                                $scope.page.total = resp.total;

                                _($scope.page.data).forEach(function(v) { 
                                    systemUUID_Self[v.uuid] = v; 
                                }) 
                            }, $utils.handlerErr).$promise


            return permise

        }
 
        var  interval_queryOnline
        $scope.$on("$destroy" , function(){
            // 清除 查询 在线状态的 interval , 
            $interval.cancel( interval_queryOnline );
        })

        $scope.loadPageData = function( pageNo ){
           
            // 清除 查询 在线状态的 interval ,
            $interval.cancel( interval_queryOnline );

            loadSystem( pageNo ).then( function(){
                var  systemUUids =  Object.keys( systemUUID_Self ); 

                querySysOnline( systemUUids , $scope.page.data );

                //  实时 查询 在线 状态; 
                interval_queryOnline = $interval( function(){
                    querySysOnline( systemUUids , $scope.page.data ); 

                } , $sys.state_inter_time )
 
                // 查询 是否需要 同步;   
                queryNeedSync( systemUUids , systemUUID_Self  );

            })

        };
        $scope.reSet = function(){
            $scope.od = {};
            $scope.loadPageData(1);
        }

        // 查询 在线状态;  
        function  querySysOnline ( uuids , pageData ){ 
            return $source.$system.status(uuids , ( resp )=>{ 
                    _( resp.ret ).forEach( (v , i )=>{  
                        pageData[i].online =   v &&   ( v.daserver ?  v.daserver.logon : v.online );
                    }) 
                }).$promise ;

        } 

        // 加载同步状态 ; 
        function queryNeedSync( uuids , system_uuid_self ) { 
            return $source.$system.needSync(uuids , ( resp )=>{ 
                _.forEach( resp.ret , (v , i )=>{
                    system_uuid_self[i].needsync = v ;
                }) 
            }).$promise
        }
 

        $scope.loadPageData(1);
 

        $scope.updateSystem = function(idObj) {
            return $source.$system.put({}, idObj).$promise;
        }
        

        function createSystem ( region_id ) {
            angular.open(
                {  title:"system.createSystem",templateUrl: "app/system_m/system.add.html" },

                function($scope ) {  
                    "ngInject";
                    $scope.regions = thatScope.regions;
                    $scope.sysModels = thatScope.sysModels;

                    $scope.system = {
                        region_id: region_id
                    };

                    $scope.od = {
                        systemModel: undefined,
                        selectRegion: !!region_id
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
                        }, $scope.system);


                        $source.$system.save(sys, function(resp) {
                            // alert("创建成功!");  
                            sys.uuid = resp.ret;
                            sys.state = 0;

                            thatScope.page.data.unshift(sys);

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
        $scope.effStation = function( dastations, station, index, todel) { 

            angular.confirm({
               // title: "失效系统 " + station.name,
                note: [ 'system.noteUnActive' , station.name ]//"确认要失效该系统吗?"
            }, function(next) {
                var d = {  uuid: station.uuid,  state: 0  }; 
                $source.$system.deactive({  pk: station.uuid  }, function() { 
                    station.state = 0; 
                    todel && (dastations.splice(index, 1)); 
                    next();
                }, $utils.handlerErr )

            })
        };

        // 激活系统; 
        //激活采集站;
        //  jump 是否 跳转;
        $scope.activateStation = function(dastations, station, index, jump) {
 
            angular.confirm({
                // jjw 采集站->系统
                // title: "激活系统 " + station.name,
                note: [ "system.noteActive" ,station.name ]//确认要激活该系统吗?"
            }, function(next) {
                // 激活采集站;
                $source.$system.active({
                    pk: station.uuid
                }, function(resp) {
                    station.state = 1;
                    dastations && (dastations.splice(index, 1));
                    next();
                    jump && $scope.goto('app.station.prop._basic', station, station);

                }, $utils.handlerErr );
            })
        };

         // 移除;
        $scope.delStation = function(dastations, station, index) {
            angular.confirm({
                //title: "您是否要删除系统:" + station.name,
                note: [ "system.noteDel" , station.name ],
                warn:   "system.warnDel"  //"删除系统将会丢失此系统的全部历史数据"

            }, function(next) {
                $source.$system.delete({
                    system_id: station.uuid
                }, function(resp) {

                    dastations.splice(index, 1);

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

            $source.$system.sync({  pk: das.uuid  },  function(resp) {

                    das.needsync = false;
                    that._show_sync_ok = true;
                }, $utils.handlerErr);
        };




        return ;
        //=============================
        //=============================
        //=============================
        //=============================


 



     

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