module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist/public',
  root: 'dist/public/',
  staticFileGlobs: [
    'dist/public/index.html',
    'dist/public/**.js',
    'dist/public/**.css'
  ]
};
