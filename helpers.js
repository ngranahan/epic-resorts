const cheerio = require('cheerio')
const axios = require('axios');

async function scrape(html) {
  const $ = cheerio.load(html)
  const resortListItems = $('.footer__container').find('.footer__panel__body--resortGroup li')
  const resortData = {
    resorts: []
  }

  for (const regionEl of resortListItems) {
    const region = $(regionEl).find('.panel-title').first().text().trim()
    const regionResorts = $(regionEl).find('.footer__panel__list')
    for (const resortEl of regionResorts) {
      const resortObj = {}
      let resort = $(resortEl).find('.footerlink').first().text().trim()
      resort = resort.split(', opens in a new window')
      resort = resort[0].trim()
      resortObj.resortName = resort
      resortObj.region = region
      resortData.resorts.push(resortObj)
    }
  }

  return resortData
}

async function getResortLocation(resort, region) {
  const country = region === 'Canada' || region === 'Australia' ? region : 'USA'
  const baseUrl = 'https://geocode.search.hereapi.com/v1/geocode'
  const apiKey = process.env.HERE_API_KEY;
  const endpointUrl = `${baseUrl}?q=${resort},${country}&limit=1&apiKey=${apiKey}`;
  try {
    const locationData = await axios(endpointUrl)
    const location = {}
    if (locationData && locationData.data && locationData.data.items && locationData.data.items.length) {
        location.lat = locationData.data.items[0].position.lat,
        location.lng = locationData.data.items[0].position.lng,
        location.hereLocationTitle = locationData.data.items[0].title
    } else {
      throw new Error('Error getting results for:', resort, region, endpointUrl)
    }
    return location
  } catch(e) {
    console.error(e)
  }
}

function delay(ms) {
  new Promise(res => setTimeout(res, ms))
}

function test() {
  console.log('testing')
}

function formatData(data) {
  const formattedData = {
    resorts: data.resorts,
    regions: {}
  }

  data.resorts.forEach(resort => {
    formattedData.regions[resort.region] && formattedData.regions[resort.region].length ? formattedData.regions[resort.region].push(resort) : formattedData.regions[resort.region] = [resort]
  })

  return formattedData
}

module.exports = {
  scrape,
  getResortLocation,
  delay,
  formatData
};