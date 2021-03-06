var gulp = require('gulp');
var path = require('path');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var uglify = require('gulp-uglify');

var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

var htmlmin = require('gulp-htmlmin');
const imageminPngquant = require('imagemin-pngquant');

var del = require('del');
var runSequence = require('run-sequence');

var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');
/* yaho 压缩 */
var smushit = require('gulp-smushit');
/* tiny  */
var tiny = require('gulp-tinypng-nokey');

/* gulp 错误处理 */
var plumber = require('gulp-plumber');

/* 重命名 */
var rename = require('gulp-rename');

// 静态服务器
gulp.task('browser-sync', ['less', 'watch-less', 'sprites', 'watch-sprites'], function() {
    browserSync.init({
        server: {
            baseDir: "./src"
        },
        files: ['./src/**/*.*', '!./src/less/*']
    });
});

/* 编译less */
gulp.task('less', function() {
    console.log('dev: 编译less');
    return gulp.src('./src/less/**/index.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(rename(function(path) {
            console.log(path);
            path.basename = path.dirname;
            path.dirname = '';
        }))
        .pipe(gulp.dest('./src/css'))
        .pipe(reload({
            stream: true
        }));
});

/* 实时编译less */
gulp.task('watch-less', function() {
    var watcher = gulp.watch('./src/less/**/*.less', ['less']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running less tasks...');
    });
});


/* 生成雪碧图 */
gulp.task('sprites', function() {
    return gulp.src('./src/images/sprites/*.png')
        .pipe(spritesmith({
            imgName: 'src/images/sprite.png',
            cssName: 'src/less/sprite.less',
            padding: 5,
            algorithm: 'binary-tree',
            cssTemplate: function(data) {
                var arr = [];
                data.sprites.forEach(function(sprite) {
                    arr.push(".icon_" + sprite.name +
                        "{" +
                        "background-image: url('" + sprite.escaped_image + "');" +
                        "background-position: " + sprite.px.offset_x + " " + sprite.px.offset_y + ";" +
                        "width:" + sprite.px.width + ";" +
                        "height:" + sprite.px.height + ";" +
                        "}\n");
                });
                return arr.join(" ");
            }
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('watch-sprites', function() {
    var watcher = gulp.watch('./src/images/sprites/*.png', ['sprites']);

    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running sprites tasks...');
    });
});


/* 生产任务 */
/* 清理文件夹 */
gulp.task('dist:clearDist', function() {
    return del([
        './dist/**/*'
    ]);
});

/* 压缩 js */
gulp.task('dist:js', function() {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

/* 处理压缩css */
gulp.task('dist:less', function() {
    return gulp.src('./src/less/**/index.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: [
                'last 3 versions',
                'ie >= 8',
                'ie_mob >= 10',
                'ff >= 30',
                'chrome >= 34',
                'safari >= 6',
                'opera >= 12.1',
                'ios >= 6',
                'android >= 4.4',
                'bb >= 10',
                'and_uc 9.9'
            ],
            cascade: false
        }))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename(function(path) {
            path.basename = path.dirname;
            path.dirname = '';
        }))        
        .pipe(gulp.dest('./dist/css'));
});

/* 压缩 html  */
gulp.task('dist:html', function() {
    return gulp.src('./src/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(gulp.dest('./dist'))
});

/* 压缩图片 使用 imagemin，支持所有图片格式，压缩率较低，质量高*/
gulp.task('dist:imagemin', function() {
    return gulp.src(['src/images/**/*', '!src/images/sprites/**/*'])
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{removeViewBox: false}],
            use: [imageminPngquant()]
        }))
        .pipe(gulp.dest('dist/images'))
});

/* 压缩图片 使用 tiny, 支持多种图片格式, 压缩率较高，图片质量较低 */
gulp.task('dist:tiny', function() {
    return gulp.src(['src/images/**/*', '!src/images/sprites/**/*'])
        .pipe(tiny())        
        .pipe(gulp.dest('dist/images'))
});
/* 压缩图片 使用 smushit，只支持jpg、png，质量适中 */
gulp.task('dist:smushit', function() {
    return gulp.src(['src/images/**/*', '!src/images/sprites/**/*'])
        .pipe(smushit({
            verbose: true
        }))        
        .pipe(gulp.dest('dist/images'))
});

/* 移动文件 */
gulp.task('dist:moveFile', function() {
    return gulp.src(['./src/lib/**/*'], {
            base: './src'
        })
        .pipe(gulp.dest('./dist'));
});

/* 清理 build 任务产生的中间文件*/
gulp.task('dist:clearBuild', function() {
    return del('./dist/images/sprites/**');
});

/* 编译生产文件 */
gulp.task('build', function(callback) {
    runSequence(
        'dist:clearDist', ['dist:js', 'dist:less', 'dist:html', 'dist:imagemin', 'dist:moveFile'], 'dist:clearBuild',
        callback
    )
});

/* 删除之前的旧文件*/
/*清理项目 */
gulp.task('deploy:clear', function() {
    return del([
        '/var/www/html/**/*',
        '!/var/www/html/en'
    ], {
        force: true
    });
});

/* 生产环境部署 */
gulp.task('production', ['deploy:clear'], function() {
    return gulp.src(['./dist/**/*'])
        .pipe(gulp.dest('/var/www/html/'))
});

