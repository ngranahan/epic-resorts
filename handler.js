const {scrape, getResortLocation, delay, formatData} = require('./helpers')
const axios = require('axios')

module.exports.getResorts = async (event, context, cb) => {
  try {
    // epicpass.com/passes/epic-pass is built with react, which won't return page html to the scraper by default. spoofing web crawler user-agent to get html.
    const {data} = await axios.get('https://www.epicpass.com/passes/epic-pass', {
      headers: {
        'User-Agent': 'Googlebot-News'
      }
    })
    const resortData = await scrape(data)
    if (resortData.resorts && resortData.resorts.length) {
      for (const [i, resort] of resortData.resorts.entries()) {
        // HERE geocoding api sets a rate limit of 5 requests per second. Delay by one second every 5th request.
        if (i%5 === 0) {
          await delay(1000)
        }
        const location = await getResortLocation(resort)
        resortData.resorts[i].location = location;
      }
    }
    const formattedResortData = formatData(resortData)
    const response = {
      "statusCode": 200,
      "body": JSON.stringify(formattedResortData),
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      }
    }
    cb(null, response)
  } catch (e) {
    console.error(e);
  }
};
