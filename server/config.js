module.exports = {
  passport: {
    secret: process.env.MUJO_PASSPORT_SECRET
  },
  server: {
    port: process.env.MUJO_SERVER_PORT
  },
  mongo: {
    url: process.env.MUJO_MONGO_URL
  }
};
