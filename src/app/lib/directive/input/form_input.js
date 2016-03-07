
 

 

export  default ( $compile ,$translate )=>{ 
	"ngInject";
  

	function  pText( type  , value ){ 
	
		var html ;
		if( typeof value !=='undefined' ){
			html =   "<p class='text-danger' ng-if=' m.$dirty &&  m.$error."+type+"'  translate='inputValid."+ type
					 +"'  translate-values='{value: "+ value +"}' ></p>" ;
		}else{
			html =   "<p class='text-danger' ng-if=' m.$dirty &&  m.$error."+type+"'  translate='inputValid."+ type +"'    ></p>" 
		}

		console.log( html );
		
		return html ;
	

	} ;
 
	return  {
		restrict:"A", 
		require: 'ngModel',
		scope:true,
		transclude:true ,
		link:( scope , ele , attrs , modelCtrl  , transclude )=>{

			console.log( 'valid scope ' ,scope , transclude )

			var label = ' <label class= "col-sm-3 control-label "  translate >'+  $translate.instant(attrs.label) +'</label> ' ,
				wrap_input = '<div class="form-group"><div class="col-sm-8"></div></div> ' ,
 				messageDom = $('<div></div>');
				
 			scope.m = modelCtrl ; 

	       
	        attrs.required  && 	messageDom.append(  pText('required') );
	        attrs.type  	&&  messageDom.append(  pText( attrs.type ) );
	        attrs.max 		&&  messageDom.append( pText( 'max' ,  attrs.max )  );
	        attrs.min 		&&  messageDom.append( pText( 'min' ,  attrs.min ) );
	        attrs.ngMinlength  &&	messageDom.append( pText( 'minlength' ,  attrs.ngMinlength  ) );
	        attrs.ngMaxlength 	&&  messageDom.append( pText( 'maxlength' ,  attrs.ngMaxlength  ) );
	       		
 			console.log( 'messageDom' ,  messageDom.html() )

	        ele.addClass(  ele.is("input , textarea ,select")?"form-control" : " no-border" )
				.wrap( wrap_input)
	       	    .after( $compile( messageDom)( scope) ) 
				// .parent().before(     $compile( label)( scope)     );
				  .parent().before(     label    );
 


		}

	}

} 