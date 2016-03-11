var path = require('path');
var gulp = require('gulp');
var conf = require('./conf'); 
var merge = require('gulp-merge-json');
var jsonMinify = require('gulp-json-minify');
var uglify = require('gulp-uglify');
 
var inject = require('gulp-inject-string');
var extend = require('gulp-extend');
var wrap = require('gulp-wrap');
 
// var json2js=require('gulp-ng-json2js'); //  delete 
var concat=require('gulp-concat');		// delete ; 



 
function build (){
	try{  
  
		    
		gulp.src('src/app/**/*.zh.js') 
		   .pipe( concat('zh.js' , {newLine: ','})  )   
		   // .pipe( extend('zh.js'))
		   .pipe( inject.wrap( 'window.$zh={'  , "};")  )

 			// .pipe( uglify())
		    .pipe(  gulp.dest(  path.join(conf.paths.tmp , '/serve')  )  );
 
 
		gulp.src('src/app/**/*.en.js') 
			.pipe( concat('en.js' , {newLine: ','})  )   
		    .pipe( inject.wrap( 'window.$en={'  , "};")  )

 			// .pipe( uglify())
		    .pipe(  gulp.dest(  path.join(conf.paths.tmp , '/serve')  )  );

 		
 		gulp.src('src/app/**/*.conf.js')
		    .pipe( concat('sys.js' , {newLine: ','})  )   
 			.pipe( inject.wrap( 
 					" angular.module('thinglinx').value( '$sys' , {  "  , 
 						// code ....
 					" }) " ) 
 					) 
 			// .pipe( uglify())
		    .pipe(  gulp.dest(  path.join(conf.paths.tmp , '/serve')  )  ); 

		   // angular.module('thinglinx').value( "$sys" , {  ... })    


 

	}catch(e){
		console.error(e)
	}
}
 
 
 

gulp.task("l10n:build", build  )
  
 
