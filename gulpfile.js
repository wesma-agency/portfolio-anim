const gulp = require("gulp");
const sass = require("gulp-sass");
const borwsersync = require("browser-sync");
const del = require("del");
const include = require("gulp-file-include");
const cleanCss = require("gulp-clean-css");
// const uglify = require("gulp-uglifyjs");
const rename = require("gulp-rename");
// const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const autoprefixer = require("gulp-autoprefixer");

gulp.task("html", function () {
	return gulp
		.src(["#src/pages/*.html", "!" + "#src/**/_*.html"])
		.pipe(include())
		.pipe(gulp.dest("dist/"))
		.pipe(borwsersync.reload({ stream: true }));
});

gulp.task("sass", function () {
	return gulp
		.src(["#src/scss/style.scss"])
		.pipe(sass().on("error", sass.logError))
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true,
			})
		)
		.pipe(gulp.dest("dist/css"))
		.pipe(borwsersync.reload({ stream: true }))
		.pipe(cleanCss())
		.pipe(
			rename({
				extname: ".min.css",
			})
		)
		.pipe(gulp.dest("dist/css"));
});

gulp.task("cssPlugin", function () {
	return gulp
		.src("#src/scss/style-plugin/**/*.+(css|scss)")
		.pipe(sass().on("error", sass.logError))
		.pipe(gulp.dest("dist/css"))
		.pipe(borwsersync.reload({ stream: true }));
});

gulp.task("js", function () {
	return gulp
		.src("#src/js/*.js")
		.pipe(include())
		.pipe(gulp.dest("dist/js"))
		.pipe(gulp.dest("dist/js"))
		.pipe(borwsersync.reload({ stream: true }));
});

gulp.task("font", function () {
	return gulp.src("#src/fonts/**/*").pipe(gulp.dest("dist/fonts"));
});

gulp.task("img", function () {
	return gulp
		.src("#src/img/**/*")
		.pipe(
			imagemin({
				interlaced: true,
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				use: [pngquant()],
			})
		)
		.pipe(gulp.dest("dist/img"));
});

gulp.task("browser-sync", function () {
	borwsersync({
		server: {
			baseDir: "./dist/",
		},
	});
});

gulp.task("clean", function () {
	return del("dist");
});

gulp.task("watch", function () {
	gulp.watch("#src/scss/style-plugin/*", gulp.parallel("cssPlugin"));
	gulp.watch("#src/fonts/**/*", gulp.parallel("font"));
	gulp.watch("#src/scss/**/*.scss", gulp.parallel("sass"));
	gulp.watch("#src/**/*.html", gulp.parallel("html"));
	gulp.watch("#src/js/*.js", gulp.parallel("js"));
	gulp.watch("#src/img/**/*", gulp.parallel("img"));
});

gulp.task("default", gulp.series("clean", gulp.parallel("html", "img", "font", "js", "sass", "cssPlugin", "watch", "browser-sync")));

gulp.task("build", gulp.series("clean", gulp.parallel("html", "img", "font", "js", "sass", "cssPlugin")));
