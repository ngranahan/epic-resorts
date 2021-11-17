const cheerio = require('cheerio')
const axios = require('axios');

async function scrape(html) {
  const $ = cheerio.load(html)
  const resortLists = $('.resort_access__container').find('.resort_access__access_resorts')
  const resortListItems = $(resortLists[0]).find('.resort_access__access_row .resort_access__access_resort')
  const resortData = {
    resorts: []
  }

  resortListItems.each((i, el) => {
    const resortObj = {}
    const regions = {
      rockies: ['CO', 'CA/NV', 'UT'],
      west: ['CA', 'WA'],
      northeast: ['VT', 'NH', 'NY'],
      midAtlantic: ['PA'],
      midwest: ['OH', 'MN', 'MO', 'MI', 'IN', 'WI'],
      canada: ['BC'],
      australia: ['Australia', 'Australia - 2022 Access']
    }
    const text = $(el).find('h4').first().text().trim()
    const textArr = text.split(',')
    const resort = textArr[0]
    const location = textArr[1].trim()
    resortObj.resortName = resort
    Object.keys(regions).forEach((region, i) => {
      console.log('region', region)
      regions[region].includes(location) ? resortObj.region = region : null
    })

    if (resortObj.region === 'australia' || resortObj.region === 'canada') {
      resortObj.query = `${resort}, ${resortObj.region}`
    } else if (location === 'CA/NV') {
      resortObj.query =`${resort}, CA, USA`
    } else if (resort === 'Attitash Mountain Resort') {
      resortObj.query = '775 US-302, Bartlett, NH 03812'
    } else if (resort === 'Wildcat Mountain') {
      resortObj.query = '542 Route 16, Pinkham Notch Gorham, NH 0358'
    } else if (resort === 'Whitetail Resort') {
      resortObj.query = '13805 Blairs Valley Rd, Mercersburg, PA 17236'
    } else if (resort === 'Mad River Mountain') {
      resortObj.query = '1000 Snow Valley Rd, Zanesfield, OH 43360'
    } else {
      resortObj.query = `${resort}, ${location}, USA`
    }
    resortData.resorts.push(resortObj)
  })

  return resortData
}

async function getResortLocation(resort) {
  const query = resort.query
  const baseUrl = 'https://geocode.search.hereapi.com/v1/geocode'
  const apiKey = process.env.HERE_API_KEY;
  const endpointUrl = `${baseUrl}?q=${query}&limit=1&apiKey=${apiKey}`;

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