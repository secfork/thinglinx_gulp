var path = require('path');
var gulp = require('gulp');
var conf = require('./conf'); 
var merge = require('gulp-merge-json');

var jsonMinify = require('gulp-json-minify');
 
var json2js=require('gulp-ng-json2js');
var concat=require('gulp-concat');




function watch (){
	try{
		gulp.src('src/app/**/*.zh.json') 
		.pipe(merge('zh.json')) 
		.pipe( gulp.dest(   path.join(conf.paths.tmp, '/serve/thing')  )  );

		gulp.src('src/app/**/*.en.json')
		.pipe(merge('en.json'))   
		.pipe(gulp.dest(  path.join(conf.paths.tmp, '/serve/thing') )   );
	}catch(e){
		console.error(e)
	}
	

}

function build (){
	try{
		gulp.src('src/app/**/*.zh.json') 
		.pipe(merge('zh.json')) 
		.pipe( jsonMinify() ) 
		.pipe(gulp.dest(  path.join(conf.paths.dist, '/thing')  ) );

		gulp.src('src/app/**/*.en.json')
		.pipe(merge('en.json')) 
		.pipe( jsonMinify() ) 
		.pipe(gulp.dest( path.join(conf.paths.dist, '/thing')  ));

	}catch(e){
		console.error(e)
	}
}
 

 

// watch ; 
gulp.task("l10n" , watch )

 
// build
// gulp.task("l10n:build" , build)

// build ;
gulp.task('l10n:build' , function(){
 
	gulp.src('src/app/**/*.zh.json')
				.pipe(merge('zh.json')) 
                .pipe(json2js({  moduleName:'thinglinx' ,rename: function(){ return "$zh"} })  )
                .pipe(concat('l10n_zh.js'))
                .pipe(gulp.dest('.tmp/serve/'));


	gulp.src('src/app/**/*.en.json')
				.pipe(merge('zh.json')) 
                .pipe(json2js({  moduleName:'thinglinx' ,rename: function(){ return "$en"} })  )
                .pipe(concat('l10n_en.js'))
                .pipe(gulp.dest('.tmp/serve/'));


})
