var gulp 		 = require('gulp'),
	scss 		 = require('gulp-scss'),
	sass 		 = require('gulp-sass'),
	browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'),
    wait =       require('gulp-wait'); // Подключаем библиотеку для переименования файлов;


gulp.task("sass", function(){
	return gulp.src('app/sass/**/*.sass')
        .pipe(wait(1000))
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});


gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app   
        }
    });
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/home.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

// gulp.task('scripts', function() {
//     return gulp.src([ // Берем все необходимые библиотеки
//         'app/libs/jquery-3.3.1.js', // Берем jQuery
//         'app/libs/jquery-migrate-1.1.1.js',
//         'app/libs/jquery.viewportchecker.js', // Берем Вьюпорт
//         'app/libs/loopimg.js', // Берем Loop
//         'app/libs/slick/slick.js' // Берем слайдер Slick
//         ])
//         .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
//         .pipe(uglify()) // Сжимаем JS файл
//         .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
// });


gulp.task('watch', ['browser-sync', 'css-libs', 'scripts' ], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
});


gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});


gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin([ 
            imagemin.gifsicle(),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng(),
            imagemin.svgo()
        ])))
        .pipe(gulp.dest('dist/img'));
});



gulp.task('build', ['clean', 'img', 'sass'], function() {

    var buildCss = gulp.src([ 
        'app/css/normalize.css',
        'app/css/style.css',
        'app/css/adaptive.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))


    var buildHtml = gulp.src('app/*.html') 
    .pipe(gulp.dest('dist'));

});


gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);

