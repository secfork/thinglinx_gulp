



export default ( $scope  , $sys , $modal , $source )=>{
	"ngInject";

	 var g = {
                distance: 100,
                baud_rate: 1200
            },
            S = $scope;


        S.GateWay = angular.copy($scope.sysModel.gateway_default || {});;



        S.needUpdate = false,
        S.enbaleGPS = !!S.GateWay.GPS,
        S.canAddPort = 0;

        // 监视 还能否添加串口;
        S.$watchCollection('GateWay', function(n, o) {
            var n = 0;
            angular.forEach(S.GateWay, function(v, i, t) {
                i != 'GPS' && (S.canAddPort = n++ == 9 )
            })
        })



        S.gpsChange = function() {
            S.enbaleGPS ? (
                S.GateWay.GPS = g
            ) : (
                g = S.GateWay.GPS,
                delete S.GateWay.GPS
            )

            S.needUpdate = true;
        }

        // geteway  串口类型 ;
        var types = $sys.gatewayTypes;

        S.c_u_Gateway = function(T, t, data) {

			// S.needUpdate = true;
			// return ;

            angular.open({
                	templateUrl: "app/model_system/sysmodel_attr_gateway_add.html"
            	},
                function($scope, $modalInstance) {
  
                    $scope.isAdd = !data,
                    // 串口 名称; key
                    $scope.G = {
                        t: t
                    },
                    // 串口数据 ; value ;
                    $scope.D = angular.copy(data || $sys.gatewayEntity ),

                    // 过滤掉 已经 创建了的串口 类型; 
                    $scope.filterType = function() {
                        if (!$scope.isAdd) return;

                        var obj = {};
                        // { k:v , .. } k 小类 , v 大类  ;
                        angular.forEach(types, function(v, k ) {
                            if (!(S.GateWay[v] && S.GateWay[v][k])) {
                                obj[k] = v;
                            }
                        });
                        //@if  append

                        console.log("filterType", obj);
                        //@endif
                        $scope.G.t = Object.keys(obj)[0];

                        $scope._$types = obj;
                    }

                    $scope.done = function() {
                        $scope.validForm();
                        t = t || $scope.G.t,
                        T = T || $scope._$types[t];

                        ( S.GateWay[T] || ( S.GateWay[T] = {}))[t] = $scope.D

                        S.needUpdate = true;
                        $scope.cancel();
                    }
                }
            )
        }

        S.cc = function() {
            S.needUpdate = true;
        }

        S.deleteGateway = function(T, t, data) {
            angular.confirm({
                title: "删除串口: " + t,
                note: "确认要删除该串口吗?"
            }, function(next) {
                delete S.GateWay[T][t];
                //S.sysmodel.gateway_default = S.GateWay ;
                S.needUpdate = true;
                next();
            })
        }

        S.saveGateWay = function() {

            console.log( 111111111 ,  S.GateWay )

            $source.$sysModel.put({
                uuid: S.sysModel.uuid,
                gateway_default: angular.toJson(S.GateWay)
            }, function(resp) {
                S.sysModel.gateway_default = angular.copy(S.GateWay);
                S.haveSave = true;
                S.needUpdate = false;
            })
        }


	
}