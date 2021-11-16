const {scrape} = require('./helpers')
const axios = require('axios')

module.exports.getResorts = async (event, context, callback) => {
  axios('https://www.epicpass.com/')
  .then(({data}) => {
    const resortData = scrape(data)
    console.log('resortData', resortData)
    callback(null, { resortData })
  })
  .catch(callback)
};
