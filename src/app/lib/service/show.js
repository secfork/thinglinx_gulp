export default ( $resource  , $sys )=>{
	"ngInject";

    var  $show = {} ,
        restNode = $sys.restNode ;

    var live = restNode + "show/live/:uuid",
        liveWrite = restNode + 'show/livewrite/:uuid', // uuid = system uid ;
        // his = restNode + "show/history/:uuid",   // uuid = system uid ;
        his = restNode + "line/:uuid/:method",   // uuid = system uid ;
        alarm = restNode + "show/alarm/:uuid/:op";   // uuid = system uid ;

 
    $show.live = $resource(live);
    $show.his = $resource(his);

    $show.alarm = $resource(alarm , {},{
        conform: { method:"POST" , params:{uuid:"confirm"}   },
        getConformMsg: { params: {uuid:"confirm"}    }
    });
    $show.liveWrite = $resource(liveWrite); // 下置; 


    return $show ;
}