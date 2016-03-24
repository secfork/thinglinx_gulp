

export  default {


			// [ a, b,c ]  =>  { a:true , b:true , c:true }
	  array2Obj : ( array )=>{
			var  x = {} ;
			angular.forEach( array , (v)=>{
				x[v] = true ; 
			})
			return  x ; 
		}
		// { a:true , b:false , c:true  } => [ a ,c ]
	  , obj2Array	: ( obj )=>{
			var x = [];
			angular.forEach( obj , (v ,i )=>{
				if( v ){
					x.push(i)
				}
			})
			return  x ; 
		}



}