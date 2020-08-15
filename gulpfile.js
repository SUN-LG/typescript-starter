/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp')
const ts = require('gulp-typescript')
const merge = require('merge2')

const tsProject = ts.createProject('./tsconfig.json')

gulp.task('default', () => {
  const tsResult = tsProject.src().pipe(tsProject())

  return merge([
    tsResult.js.pipe(gulp.dest('dist')),
    tsResult.dts.pipe(gulp.dest('types')) 
  ])
})