module.exports = {
  // See http://brunch.io for documentation.
  paths: {
    public: 'dist',
    watched: ['app','vendor','server']
  },

  files: {
    javascripts: {
      joinTo: {
        'libraries.js': /^(?!(app|server)\/)/
      },
      order: {
        before: [
          'vendor/scripts/bootstrap.js'
          ]
      },
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
