"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var less = require("gulp-less");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync");
var rename = require("gulp-rename");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var run = require("run-sequence");
var del = require("del");
var flatten = require('gulp-flatten');
var csscomb = require('gulp-csscomb');

var config = {
  dest: 'dest/',
  src: 'src/'
};

var path = {
  build: {
    html: config.dest,
    img: config.dest + "img/",
    styles: config.dest + "css/",
    js: config.dest + "js/",
    icons: config.dest + "img/icons/"
  },
  src: {
    html: config.src + "*.html",
    img: config.src + "img/*",
    styles: config.src + "less/**/*.less",
    less: config.src + "less/style.less",
    js: config.src + "js/*.js",
    icons: config.src + "img/icons/*.svg",
    fonts: config.src + "fonts/**/*.{woff,woff2,eot,ttf}"
  }
};

gulp.task("style", function() {
  gulp.src(path.src.less)
    .pipe(plumber())
    .pipe(less())
    .pipe(csscomb())
    .pipe(postcss([
      autoprefixer({
        browsers: [
          "last 5 version"
        ]
      }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest(path.build.styles))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(path.build.styles))
    .pipe(server.reload({ stream: true }));
});

gulp.task("images-min", function() {
  return gulp.src(path.build.img + "*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true })
    ]))
    .pipe(gulp.dest(path.build.img));
});

gulp.task("symbols", function() {
  return gulp.src(path.build.icons + "*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest(path.build.img));
});

gulp.task("serve", function() {
  server.init({
    server: "dest",
    notify: false,
    open: true,
    ui: false
  });
  gulp.watch(path.src.styles, ["style"]).on("change", server.reload);
  gulp.watch(path.src.html, ["copy-html"]).on("change", server.reload);
});

gulp.task("copy", function() {
  return gulp.src([
      path.src.fonts,
      path.src.img,
      path.src.js
    ], {
      base: "."
    })
    .pipe(flatten({ includeParents: -1 }))
    .pipe(gulp.dest(config.dest));
});

gulp.task("copy-html", function() {
  return gulp.src([
      path.src.html
    ], {
      base: "."
    })
    .pipe(flatten())
    .pipe(gulp.dest(config.dest));
});

gulp.task("copy-icons", function() {
  return gulp.src([
      path.src.icons
    ], {
      base: "."
    })
    .pipe(flatten())
    .pipe(gulp.dest(path.build.icons));
});

gulp.task("clean", function() {
  return del(config.dest);
});

gulp.task("build", function(fn) {
  run("clean", "copy", "copy-html", "copy-icons", "style", "images-min", "symbols", fn);
});
