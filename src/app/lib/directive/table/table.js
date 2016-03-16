
 /*


  $scope.tableHeaders = [
        { text: "text.name", w: "20%"}, 
        { text: "text.createTime",  w: "20%"  }, 
        {  text: "region_m.th_active",  w: "20%" }, 
        {  text: "region_m.th_unactive",   w: "20%"  }, 
        { text: "text.desc",   w: "30%"  }, 
        {  text: "text.del",  w: "15%"  }
    ]

	$translate.instant () ; 


 */

export default ( $compile , $translate  )=>{
	"ngInject";

	return {
		restrict:"A" , 
		// scope:true ,   
		// replace:true ,
		// priority: 1000 ,
		// multiElement:true ,
		// templateNamespace:"html",
		// scope: { theader:"=" },
		// transclude:"elememt" , 
	 	// templateUrl:"app/lib/directive/table/table.html",

		link: ( scope , ele , attrs , ctrl  )=>{
			
		var  header = [ '<thead class="flip-content">',
	            '<tr class="background "> ',
	                '<th ng-repeat=" th in  ',
	                attrs.theader,
	                ' " width="{{:: th.w }} "  translate="{{ :: th.text}}">',    
	                '</th>',
	            '</tr>',
	        '</thead>' 
	        ].join('')
          
		    ele.wrap('<div class="table-responsive "></div>').addClass("table table-hover table-striped  b-t").prepend(  $compile( header)(scope) );
 

		}
	}

}