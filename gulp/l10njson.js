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
var concat = require('gulp-concat'); // delete ; 

var frep = require('gulp-frep');

var stripJsonComments = require('gulp-strip-json-comments');



var patterns = [{
    pattern: /}\s*(\r\n|\n){1,}\s*{/ig, //  wo  fuck your mama !!!
    replacement: ','
},
    {
        pattern:  /,{2,}/ig,
        replacement:","
    }
    
];



function build() {
    try { 

        gulp.src('src/app/**/*.zh.json') 
            .pipe(stripJsonComments())
            .pipe(extend('zh.js'))
            .pipe(inject.wrap('window.zh=', ';'))
            .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));


        gulp.src('src/app/**/*.en.json') 
            .pipe(stripJsonComments())
            .pipe(extend('en.js'))
            .pipe(inject.wrap('window.en=', ';'))
            .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));


        gulp.src('src/app/**/*.conf.js')
            .pipe(concat('sys.js')) 

            .pipe(
                    inject.wrap(
                        " angular.module('thinglinx').value( '$sys' ,", ");")
                )
            .pipe( frep(patterns) )
            .pipe(uglify())
            .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));




    } catch (e) {
        console.error(e)
    }
}




gulp.task("l10n:build", build)
