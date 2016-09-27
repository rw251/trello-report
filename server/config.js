module.exports = {
  passport: {
    secret: process.env.TRELLO_REPORT_PASSPORT_SECRET
  },
  server: {
    port: process.env.TRELLO_REPORT_SERVER_PORT
  },
  mongo: {
    url: process.env.TRELLO_REPORT_MONGO_URL
  }
};
