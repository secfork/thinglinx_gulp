
/*

export default ( ) => {
	"ngInject"

}

*/

import  sys from "./sys";
import  source from "./source";
import  show from "./show";
import  httpInterceptor from "./httpInterceptor";
import  modal from "./modal";


export default  ( modele)=> {


	modele.factory("$sys" ,  sys  )
		.factory("$source" , source)
		.factory("$show" , show )
		.factory("httpInterceptor" , httpInterceptor )
		.factory("modal" , modal )



}