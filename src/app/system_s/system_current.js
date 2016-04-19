
export default ( $scope, $show, $interval, $sys, $state, $filter,$timeout )=>{
	"ngInject";

  var interval;	
 

    //$scope.$popNav($scope.system.name + "()", $state);

    $scope.$on("$destroy", function() {
        $interval.cancel(interval);
    });

    // 自动刷新   ;
    $scope.auto_r = true;

    //保留小数; 
    $scope.decimal = false;

    $scope.fractionSize = 4; // 保留四位小数; 


    // 开始订阅数据; 进程条 
    $scope.progValue = 0;



    var names = [],
        reg;

    $scope.filtTags = [];
    $scope.filterTags = function(name) {
        names = [];
        reg = new RegExp(name);

        $scope.filtTags = ($scope.tags || [] ).filter(function(v) {
            if (reg.test(v.name)) {
                names.push(v.name);
                return true;
            }
            return false;
        });
        getCurrent();
    };

    $scope.filterTags("");

    $scope.$watch("auto_r", function(n) {
        if (n) { // 自动刷新;
            $scope.liveData();
        } else { // false;
            // 取消 interval , 但是保存状态( 保持 progvalue );
            $interval.cancel(interval);
        }
    })




    $scope.liveData = function() { // need = $last ;
        $interval.cancel(interval);

        interval = $interval(function() {

            $scope.progValue += 1000;
            console.log(111111)

            if ($scope.progValue == $scope.op.c_int) {
                getCurrent();
            }

            if ($scope.progValue > $scope.op.c_int) {
                $scope.progValue = 0;
            }

        }, 1000);
    }


    // 单次获得 当前数据;
    var x = {
            src: null,
            pv: null
        },
        t,  
        v ,
        b,  regExp  , formatter;

    function getCurrent($event) {

        console.log(names);

        var $dom; 

        if (names.length) {
            if ($event) {
                $dom = $($event.currentTarget);
                $dom.text("刷新中").attr("disabled", true);

            };

            $show.live.get({
                uuid: $scope.system.uuid,
                tag: names
            }, function(resp) {
  
                b = $scope.decimal; 

                if(b){
                    if( $scope.fractionSize == 0){
                        regExp = new RegExp( "(\\d+).(\\d+)" );
                        formatter = "$1";

                    }else{
                        regExp = new RegExp(  "(\\d+).(\\d{" +$scope.fractionSize+  "})(\\d*)" );
                        formatter = "$1.$2";
                    } 
                }


                $.each(resp.ret, function(i, d) {
                    d = d || x;
                    t = $filter("date")(d.src, 'MM-dd HH:mm:ss'); 
                    t && $("#_time_" + i).text(t);


                    // '1232.1233455666'.replace(/(\d+).(\d{3})(\d*)/, "$1"+'xxx'+"$2");

                    $("#_val_" + i).text(d.pv == null ?  "" 
                        : (  b ? ( (d.pv+'').replace( regExp , formatter)  )  : d.pv ) 
                    );
 
                });

                if ($dom) {
                    $dom.text("刷新成功");

                    $timeout(function() {
                        $dom.text("刷新").attr("disabled", false);
                    }, 3000);

                } 
            }, function() { 
                $dom && $dom.text("刷新").attr("disabled", false);
            })
        }

    }

    function handlerPv ( pv ){
    // toFixed


    }


    $scope.getCurrent = getCurrent;


    // 下置数据;
    $scope.liveWrite = function(t, v, e, s) {
        //console.log(arguments);  // String system_id , String name ,String value

        if (!v) {
            angular.alert("请输入下置数据");
            return;
        }

        if (!t) return;
        var d = {},
            $button = $(e.currentTarget);;
        d[t.name] = v;
 
        s.showSpinner = true;
        $show.liveWrite.save({
            uuid: $scope.system.uuid
        }, d, function(resp) {
            s.showSpinner = false; 
            console.log(resp); 

        }, function() {
            s.showSpinner = false; 
        })
    }


}