const tsConfig = require('./tsconfig.json')

export default async function (fly) {
  await fly.start('buildAndCopy')
  await fly.watch('src/**/*.ts', ['compileTypescript'])
}

export async function build(fly) {
  await fly.serial([
    'clean',
    'compileTypescript',
  ]);
}

export async function buildAndCopy(fly) {
  await fly.serial([
    'clean',
    'compileTypescript',
    'copyBasic',
  ]);
}

export async function clean(fly) {
  await fly.clear('dist');
}

export async function copyBasic(fly) {
  await fly.source(['package.json', 'LICENSE', 'README.md'])
    .flatten({ levels: 5 })
    .target('dist');
}

export async function compileTypescript(fly) {
  for (const include of tsConfig.include) {
    yield fly
      .source(include)
      .typescript(tsConfig.compilerOptions)
      .target(tsConfig.compilerOptions.outDir);
  }
}
