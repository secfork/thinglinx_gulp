
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


import  custom_translate from "./custom_translate";

export default  ( modele)=> {


	modele.factory("$sys" ,  sys  )
		.factory("$source" , source)
		.factory("$show" , show )
		.factory("httpInterceptor" , httpInterceptor )
		.factory("modal" , modal )
		.factory("custom_translate" , custom_translate )



}