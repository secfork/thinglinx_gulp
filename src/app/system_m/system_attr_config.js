export default ($scope, $source , $utils ) => {
    "ngInject";
 

    $scope.op = {
        // PLC 编程 ;
        plcstate: false , enAblePlcProg:false  
    } ;
    $scope.od  = {};

 
    // 控制 编辑 按钮 显隐 ;
    function toUpdate(field) {
        needUpdate[field] = true;
        hasSave[field] = false; 
    } 
    function toSave(field) {
        needUpdate[field] = false;
        hasSave[field] = true;
    } 
    $scope.toUpdate = toUpdate;
    $scope.toSave = toSave;


    var   system_uuid = $scope.system.uuid ; 

    // system 的 network , 或者 gateway 数据; 
        try {
            $scope.daserver =  ( angular.fromJson($scope.system.network || {})  ).daserver;
        } catch (e) {
            console.error(" system . network 字段 不是 json 格式", $scope.system.network);
        }

        try {
            $scope.gateway = angular.fromJson($scope.system.gateway || {});
        } catch (e) {
            console.error(" system . gateway  字段 不是 json 格式", $scope.system.gateway);
        }


    // 设置  daserver 类型  plc 的编程 状态; 

        // 先假设: 只有 manage 模式才可 设置 plc编程;  
        // 得到  plc 状态;     && $scope.daserver.params.driverid 
        if(  $scope.systemModel.mode ==1 &&   $utils.isEnablePlcProg(  $scope.daserver.params )  ){

            // 设置 plc 可编程; 
            $scope.op.enAblePlcProg = true ; 

            $source.$system.getPLC( { system_id: system_uuid } , function(resp){
                $scope.op.plcstate = resp.ret ; 
            } , ( resp )=>{
                // 报错 就不让 设置 plc 编程; 
                //$utils.handlerRespErr( resp );

               // $scope.op.enAblePlcProg = false ;
            }) ;
        }  

        // 设置 plc 编程 状态; 
        $scope.setPLC = function( plcstate ){ // plcstate = true | false ;

            //  拒绝 实时 反应 开关状态; 
            $scope.op.plcstate = !$scope.op.plcstate ;

            if(!$scope.op.enAblePlcProg) return ;

            // 属于可编程 的 ; 
            //  1 : 编程 , 2: 运行状态 ;
            // plc_programming
            angular.confirm({
               title: "system." + (plcstate ? "enablePlcProg" : "disablePlcProg"),
               note: "system." + (plcstate ? "enablePlcProgDesc" : "disablePlcProgDesc")
            }, function(close) {
               $source.$system.setPLC(
                    {
                       system_id:  system_uuid,
                       plc_programming: plcstate ? 1 : 2
                   },
                   function(resp) {
                       $scope.op.plcstate = plcstate;
                       close();
                   }, 
                   $utils.handlerErr

               ) 
            }) 

        };
 

    //  =========== 得到 systemodel  ,      判断 gateway , daserver  ======================================================

        // ticket  DTU 互斥;  
            var model =  $scope.systemModel  ;  
            $scope.needDaServer = model.mode == 1  && model.comm_type ==1 ;  // 托管 daserver 类型; 
            $scope.needTicket =  !$scope.needDaServer ;                      // 除了 托管 Daserver 都需要 ticket ;  
            $scope.needGateWay =  model.mode ==1 && model.comm_type == 2 ;   // 托管 gateway 类型; 

            // 需要配置 device ;  还要看  managed gateway sysmodel 下 有没有 device ; 
            // needDevice = sysmodel.devices.length && sysmodel.mode ==1 && sysmodel.comm_type ==2
            $scope.needDevice = false ; 

     

        // 加载支持的 dtu 驱动;
        $scope.loadSupportDtus = function() {
            if ($scope.dutList) return;
            $source.$driver.get({
                type: "dtu"
            }, function(resp) { 
                $scope.dtuList =  resp.ret ;  
            });
        }
      
        $scope.loadAssignedServer = function(){
            // 激活的 , assign了 server 的 system ; 
            if( $scope.system.state  && $scope.daserver.params  ) {
                $source.$system.getDtuServer({ options: "getassign"  , proj_id : system_uuid  }, function(resp) {
                    $scope.assignedServer = resp.ret;
                })
            }
        }


    // ========================== 获得 sysmodel 配置项=================================; 
       

        $scope.loadProfile() 

        .then(function(resp) { 

            var p_uuid = $scope.system.profile ;

            //  显得有点烦吗 , 但是 便于 显示 profile的desc ; 
            $.each($scope.profiles, function(i, v, t) {
                if (v.uuid == p_uuid) {
                    $scope.profile = v ;
                    return false ; 
                }
            })
        });


    //  更新 system 的 profile ;  =========================== profile ==========================================================
        $scope.setProfile = function(){
            $source.$system.put( { uuid: system_uuid ,  profile: $scope.profile.uuid } ,
                (resp)=>{
                    $scope.system.profile = $scope.profile.uuid ;
                }
            )
        };
  
    //=========================== ticket  绑定 解绑  ===========================
        //   就 托管 类型 的 DaServer 不用   ticket 
        // 解绑, 绑定  ticket ; 
        // 生成 ticket ; //createTicket

        $scope.ticket = {};

        // 是否需要 注册 ticket ;
        //  获取 之前声称的ticket , 即使没有 注册过 ticket ; 

            $scope.needTicket && $source.$ticket.get( { system_id:  system_uuid } , ( resp )=>{
                $scope.ticket = resp.ret || {} ;
            }); 

        $scope.operateTicket = function() {

            if (!$scope.ticket.sn) {
                angular.alert("system.noSN");
                return;
            }

            // 先 写死 ticket 的 选前;
            $scope.ticket.privilege = ['SYSTEM_MANAGE', 'SYSTEM_CONTROL'];

            ( $scope.ticket.ticket ? unBindTicket : createTicket )();

            
        };

        // 创建 ticket ;
        function  createTicket (){
            $source.$ticket.save({
                    system_id:  system_uuid
                },
                $scope.ticket,
                function(resp) {
                    // $scope.ticket = { sn: $scope.t.sn , ticket: resp.ret };
                    $scope.ticket.ticket = resp.ret;
                },
                $utils.handlerErr 
            )
        }


        // 删除ticket ;
        function unBindTicket () {

            $source.$ticket.delete({
                system_id:  system_uuid
            }, undefined, function(resp) {
                $scope.ticket.ticket = undefined;
                $scope.ticket.sn = undefined;
            },
             $utils.handlerErr 
             )
        };

    //  dtu 设置; 
    




}
