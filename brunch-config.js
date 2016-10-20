module.exports = {
  // See http://brunch.io for documentation.
  paths: {
    public: 'dist',
    watched: ['app']
  },

  files: {
    javascripts: {
      entryPoints: {
        'app/application.js': {
          'app.js': /^app\//
        }
      }
    },
    stylesheets: { joinTo: 'app.css' },
    templates: { joinTo: 'app.js' }
  }
};
