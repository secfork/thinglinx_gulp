var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var merge = require('gulp-merge-json')





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
		.pipe(gulp.dest(  path.join(conf.paths.dist, '/thing')  ) );

		gulp.src('src/app/**/*.en.json')
		.pipe(merge('en.json'))
		.pipe(gulp.dest( path.join(conf.paths.dist, '/thing')  ));

	}catch(e){
		console.error(e)
	}
}

// gulp.task("l10n:watch" , function(){
// 	watch();
// 	//gulp.watch( "src/app/**/*.json" , watch )

// })

gulp.task("l10n" , watch )


gulp.task("l10n:build" , build )

