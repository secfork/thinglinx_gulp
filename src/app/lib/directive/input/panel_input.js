
/*
input 框 ;
<div class="form-group col-lg-2-4 col-sm-6">
                <label>ID</label> 
                <input class="form-control" ng-model="od.uuid">
 
 </div>
*/

  
/*  search 框 ; 
   <div class="input-group m-sm col-md-4  "   >
            <input type="text" class="form-control" ng-model="f_projname">
            <span class="input-group-btn">
                <button class="btn btn-default" type="button" 
                        ng-click=" loadPageData(1)" >搜索</button>
            </span>
        </div>
*/
 

 /**
 	col :  col-md-x 类似 的class ; 
 	label:  labe 字段; 
 */

 var  search = [
 	'<span class="input-group-btn"><button class="btn btn-default" type="button" ng-click=" ',
    'search(1)',
    '" >搜索</button></span>'
 ];




// {   col  ,  search  ,   }

export default ( $compile )=>{
	"ngInject";
	return {
		restrict:"A",  
		// scope:{search:"&"},
		link: (scope , ele ,attrs )=>{ 
			//  attrs.search  = "loadPageDate(1)";
			// 有 search 即位 搜索 组合 输入框;  

			if( attrs.search ){
				search[1] = attrs.search ;
				ele.addClass("form-control").wrap(
					'<div class="input-group m-sm m-t-n-xs '+  ( attrs.col || 'col-md-4 col-sm-6' ) +' " >'
					).after( $compile(search.join(""))( scope) )

			}else{
				ele.addClass("form-control").wrap( 
				 	'<div class="form-group '+ ( attrs.col || 'col-md-3 col-sm-6') +'"></div>'
				 ).before(
				  "<label>"+attrs.label+"</label>" );
				
			}

		


		}



	}
}