export default ($scope, $source) => {
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


    //   就 托管 类型 的 DaServer 不用   ticket  ===========  Ticket  ======================================================
        //  不需要 ticket 时 , 需要  配置Dtu ; 
        // ticket  DTU 互斥; 

        $scope.loadSystemModel.then( (resp)=>{
            var model =  $scope.systemModel  ;  
            $scope.needDaServer = model.mode == 1  && model.comm_type ==1 ;  // 托管 daserver 类型; 
            $scope.needTicket = !$scope.needDaServer ;                      // 除了 托管 Daserver 都需要 ticket ;  
            $scope.needGateWay =  model.mode ==1 && model.comm_type == 2 ;   // 托管 gateway 类型; 
        });

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
                $source.$system.getDtuServer({ options: "getassign"  , proj_id : $scope.system.uuid  }, function(resp) {
                    $scope.assignedServer = resp.ret;
                })
            }
        }


        // 获得 sysmodel 配置项; 
        $scope.$parent.loadProfile = $scope.$parent.loadProfile ||  $source.$sysProfile.get({
            system_model: $scope.system.model
        }).$promise ;  


        $scope.loadProfile.then(function(resp) {
            $scope.profiles = resp.ret ; 
            var p_uuid = $scope.system.profile ;
            $.each($scope.profiles, function(i, v, t) {
                if (v.uuid == p_uuid) {
                    $scope.profile = v ;
                    return false ; 
                }
            })
        });


    //  更新 system 的 profile ;  =========================== profile ==========================================================
        $scope.setProfile = function(){
            $source.$system.put( { uuid: $scope.system.uuid ,  profile: $scope.profile.uuid } ,
                (resp)=>{
                    $scope.system.profile = $scope.profile.uuid ;
                }
            )
        };
  
    //=========================== ticket  绑定 解绑  ===========================
        // 解绑, 绑定  ticket ; 
        // 生成 ticket ; //createTicket
        $scope.createTicket = function() {

            if (!$scope.t.sn) {
                angular.alert("请输入SN号");
                return;
            }

            // 先 写死 ticket 的 选前;
            $scope.t.privilege = ['SYSTEM_MANAGE', 'SYSTEM_CONTROL'];

            $source.$ticket.save({
                    system_id: $scope.station.uuid
                },
                $scope.t,
                function(resp) {
                    // $scope.ticket = { sn: $scope.t.sn , ticket: resp.ret };
                    $scope.t.ticket = resp.ret;
                }
            )
        };

        // 删除ticket ;
        $scope.unBindTicket = function() {

            $source.$ticket.delete({
                system_id:  system_uuid
            }, undefined, function(resp) {
                $scope.t.ticket = undefined;
                $scope.t.sn = undefined;
            })
        };

    //  dtu 设置; 
    




}
