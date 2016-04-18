export default ($scope, $source , $utils , $q ) => {
    "ngInject";
 

    $scope.op = {
        // PLC 编程 ;
        plcstate: false , 
        enAblePlcProg:false  
    } ;

    $scope.od  = {}; 

    $scope.needUpdate = {
        profile: false ,
        daserver:false 
    };
    $scope.hadSave ={
        profile: false ,
        daserver:false 
    } ; 

    function  updateSystem ( data ){ 
        data.uuid = system.uuid ;
        return $source.$system.put( data ).$promise;

    } 

    var   system_uuid = $scope.system.uuid ,
        system = $scope.system ; 

  
    //  =========== 得到 systemodel  ,      判断 gateway , daserver  ======================================================

        // ticket  DTU 互斥;  
            var model =  $scope.sysModel  ;  
            $scope.needDaServer = model.mode == 1  && model.comm_type ==1 ;  // 托管 daserver 类型; 
            $scope.needTicket =  !$scope.needDaServer ;                      // 除了 托管 Daserver 都需要 ticket ;  
            $scope.needGateWay =  model.mode ==1 && model.comm_type == 2 ;   // 托管 gateway 类型; 

            // 需要配置 device ;  还要看  managed gateway sysmodel 下 有没有 device ; 
            // needDevice = sysmodel.devices.length && sysmodel.mode ==1 && sysmodel.comm_type ==2
            $scope.needDevice = false ; 


    // system 的 network , 或者 gateway 数据; 
        if( model.comm_type ==1 ){ // daserver ;
            try {
                $scope.daserver =  ( angular.fromJson($scope.system.network || {})  ).daserver   ; 
                if( ! $scope.daserver.type )  {
                    alert.alert( " 系统发生严重错误! 请删除重新创建试试!!");
                    return; 
                }   
            } catch (e) {
                console.error (" system . network 字段 不是 json 格式", $scope.system.network);
            }
        }  
        if( model.comm_type == 2 ){ // gateway ; 

            try {  // gateway  类型的system  ,创建时 gateway字段 无值 ;
               // $scope.gateway = angular.fromJson($scope.system.gateway || {});
            } catch (e) {
               // console.error (" system . gateway  字段 不是 json 格式", $scope.system.gateway);
            }

        }

      
 

    // 设置  daserver 类型  plc 的编程 状态; 

        // 先假设: 只有 manage 模式 的 daserver 类型 才可 设置 plc编程;  
        // 得到  plc 状态;     && $scope.daserver.params.driverid 
        if(  $scope.needDaServer &&   $utils.isEnablePlcProg(  $scope.daserver.params )  ){

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
 
    // 配置 daserver 或者 gageeway之前 判断是否 激活 了 system ; 返回 promise ; 
        function activeSystem(  system ){   // system 
            return $q(  function( resolve  , reject){
                if( system.state == 1 ){
                    resolve();
                }else{
                    angular.confirm({
                            title:"system.sysNuActive",
                            note: ["system.noteActive", system.name] //确认要激活该系统吗?"
                        } ,
                        ( close)=>{  
                            $source.$system.active({  pk:  system.uuid  },
                                (resp) =>{
                                    system.state = 1;
                                    close();
                                    resolve();
                                },
                                (resp)=>{
                                    $utils.handlerErr( resp );
                                    reject();
                                }   
                            )  
                        } 
                    ) 
                } 
            }); 
        }
 

    //  若是  Daserver类型时  加载支持的 dtu 驱动  ,  写 更新 DTU 函数; ;
        if( $scope.needDaServer ){
            // 支持的DTU ;
            if( !$scope.dtuList ){
                 $source.$driver.get({
                    type: "dtu"
                }, function(resp) { 
                    $scope.$parent.dtuList =  resp.ret ;  
                }); 
            };

            // 配置上的  daserver 服务器 ;
            if( !$scope.assignedServer ){
                // 激活的 , assign了 server 的 system ; 
                if( $scope.system.state  && $scope.daserver.params  ) {
                    $source.$system.getDtuServer({ options: "getassign"  , proj_id : system_uuid  }, function(resp) {
                        $scope.$parent.assignedServer = resp.ret;
                    })
                }
            } 
        };

        // 保存  DAServer 的网络配置参数; 
        $scope.saveDaserverConf = function(){
             
            $scope.assert (  $scope.validForm('daserverForm') , $scope.needUpdate.daserver  ) ;
 
            activeSystem( system ) 
            .then( ()=>{ // 确保激活了 system ; 
                // 保存 网络参数 ; 
                return   updateSystem(  {  network: { daserver:   $scope.daserver  }  } )
            })  
            .then( 
                ()=>{  // 没有assign 过 则 assign  daserver ; 
                    $scope.assignedServer || $source.$system.assign( 
                        { pk: system_uuid , driver_id : $scope.daserver.params.driverid } ,
                        ( resp )=>{
                            $scope.$parent.assignedServer = resp.ret ; 
                        } ,
                        $utils.handlerRespErr
                    )
                } ,
                $utils.handlerRespErr
            )
 
            // dtu时          == >assign Daserver ; 
            // tcpclient时 ;  ==> ???
            // vpn 时 ;       ==> ???
        }




    //  若是  gateway 类型  ========================== ticket  绑定 解绑  ===========================
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


    //  更新 system 的 profile ;  ===========================  更新 profile ==========================================================
        $scope.setProfile = function(){

            updateSystem( { profile: $scope.profile.uuid } ).then( ()=>{
                $scope.system.profile = $scope.profile.uuid ;
                $scope.hadSave.profile = true ;
                $scope.needUpdate.profile = false ;
            } , $utils.handlerRespErr ) 
        };
  




}
