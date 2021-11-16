const {scrape, getResortLocation, delay, formatData} = require('./helpers')
const axios = require('axios')

module.exports.getResorts = async () => {
  try {
    const {data} = await axios('https://www.epicpass.com/')
    const resortData = await scrape(data)
    if (resortData.resorts && resortData.resorts.length) {
      for (const [i, resort] of resortData.resorts.entries()) {
        // HERE geocoding api sets a rate limit of 5 requests per second. Delay by one second every 5th request.
        if (i%5 === 0) {
          await delay(1000)
        }
        const location = await getResortLocation(resort.resortName, resort.region)
        resortData.resorts[i].location = location;
      }
    }
    const formattedResortData = formatData(resortData)
    console.log('formattedResortData', formattedResortData)
  } catch (e) {
    console.error(e);
  }
};
