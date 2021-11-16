const cheerio = require('cheerio')

function scrape(html) {
  const $ = cheerio.load(html)
  const resortListItems = $('.footer__container').find('.footer__panel__body--resortGroup li')

  const resortData = {
    resorts: [],
    regions: {}
  };

  resortListItems.each((i, regionEl) => {
    const region = $(regionEl).find('.panel-title').first().text().trim()
    const regionResorts = $(regionEl).find('.footer__panel__list')
    regionResorts.each((i, resortEl) => {
      const resortObj = {}
      let resort = $(resortEl).find('.footerlink').first().text().trim()
      resort = resort.split(', opens in a new window')
      resort = resort[0].trim()
      resortObj.resortName = resort
      resortObj.region = region
      resortObj.location = getResortLocation(resort, region)
      resortData.resorts.push(resortObj)
      resortData.regions[region] && resortData.regions[region].length ? resortData.regions[region].push(resortObj) : resortData.regions[region] = [resortObj]
    })
  })

  return resortData
}

function getResortLocation(resort, region) {
  console.log('geocoding location for:', resort, region)
  // TODO: Use Google Places API to get resort address from resort name and region
  // TODO: Use Google Geocoding API to get lat/lng from resort address
  return {
    address: 'address',
    latlng: 'latlng'
  }
}

module.exports = {
  scrape
};