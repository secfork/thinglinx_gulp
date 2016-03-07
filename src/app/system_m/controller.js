export default ($scope, $sys, $source, modal , $q  ) => {
    "ngInject";

    $scope.od = {};
    $scope.page = {};

    
    $scope.panel = {
        subject: "系统管理",
        title: "系统列表",
        pagger: true,

        panelTBS: [

        ],

        panelBBS: [{
            text: "添加系统",
            classFor: " btn-primary",
            handler:   addSystem 
            

        }]
    };

    $scope.tableHeaders = [
        {   text: "状态",  w: "5%"  }, 
        {   text: "系统名称",   w: "20%"},
        {  text: "ID", w: "20%"        }, 
        {  text: "区域", w: "20%"    }, 
        {   text: "活跃状态",  w: "10%" },
        {  text: "备注",  w: "25%"  },
        {  text: "激活",  w: "15%"  },
        {  text: "同步",  w: "15%"  },
        {  text: "删除",  w: "15%"  }, 
    ]


    function addSystem(){
        modal(  {
                title: "添加系统", 
                templateUrl: "app/main/m_system/add_system.html", 
                resolve:{

                }
            },    
            ($scope )=>{
                "ngInject";



            })
    }



    // 加载 system  分页数据; 
    
    $scope.loadPageData = function(pageNo ) { 

        $scope.showMask = true ;
  
        $scope.page.currentPage = pageNo; 

        // 分页加载 系统数据;
        var d = angular.extend({
            options:"query", 
            currentPage: pageNo, 
            itemsPerPage: $sys.itemsPerPage  
        } , $scope.od );
         
        $source.$system.query(d).$promise.then(function(resp) {

            var sys_ref,
                promise_A, promise_B, sysState, sta2sync;

            sys_ref = {}; 

            resp.data.forEach(function(n, i, a) { 
                sys_ref[n.uuid] = n ; 
            }) 
            promise_A = {}  //  状态 是否在线, 挂起 ; 
            // $source.$region.getProjNameByIdS(Object.keys(projids)).$promise;

            // 激活的系统;
            var ids = Object.keys(sys_ref) ;


            if ( ( d.state == '1' || d.state == undefined ) && ids.length) {

                // 在线状态 ; 
                promise_A = $source.$system.status(   ids ).$promise ; 

                // proj name ;
                // 是否要 同步;
                promise_B = ! $scope.isShowModul &&  $source.$system.needSync(  ids  ).$promise;


                // 没分钟 刷新 状态; 
                $interval.cancel( state_interval );

                state_interval = $interval( function(){
                    $source.$system.status(  ids , function( resp_x ){
                        var  sysStatus = resp_x.ret ; 
                        $.each( resp.data , function(i , n ){
                              n.online =  sysStatus && sysStatus[i] &&  
                                        ( sysStatus[i].daserver? 
                                            sysStatus[i].daserver.logon 
                                            : sysStatus[i].online
                                        )  
                        })

                    });

                }, $sys.state_inter_time  )

            }

            // 非激活的system; 或者 展示模块;
            // 加载 state , needsysnc ,  拆分 region数据;  ,
            $q.all([promise_A, promise_B , analyzeRegionPromise ]).then(function(resp_B) {

                sysStatus = resp_B[0] && resp_B[0].ret;
                sta2sync = resp_B[1] && resp_B[1].ret; //在 未激活,  展示 模块 为 undefind ;
                
                // 组装是否需要 同步 ; 
                $.each(resp.data, function(i, n) {
                    //  不是这个 系统状态(0:未激活,1:活跃,2:挂起)
                    // 而是系统在线在线状态; 

                    n.online = sysStatus && sysStatus[i] &&  
                                ( sysStatus[i].daserver? 
                                    sysStatus[i].daserver.logon 
                                    : sysStatus[i].online
                                )  
                    n.needsync = sta2sync && sta2sync[n.uuid];

                    n.region_name = $scope.rg_k_v[n.region_id].name ;

                });

                angular.extend($scope.page, resp );

                //$scope.page = resp_A ;

                // 翻页 刷新  地图上的点;
                if ($scope.lm == "map") {
                    $map.flushMarkers(map, $scope.page.data);
                }

                $scope.showMask = false ;
            },function(){   $scope.showMask = false;  })

        },function(){   $scope.showMask = false;  })
    }


    $scope.loadPageData(1);

}