import path from 'path';
import webpack from 'webpack';
import MemoryFs from 'memory-fs';

export default (fixture, rules = [{}]) => {
  const compiler = webpack({
    mode: 'development',
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules,
    },
  });

  compiler.outputFileSystem = new MemoryFs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) reject(err);

      resolve(stats);
    });
  });
};
