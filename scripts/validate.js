import got from 'got'
import jsdom from 'jsdom'
import { getFeedContent } from '../utils/index.js'

const { JSDOM } = jsdom
const xml = getFeedContent()

try {
  const data = await got.post('https://validator.w3.org/feed/check.cgi', {
    form: {
      rawdata: xml,
      manual: 1
    }
  }).text()

  // Avoid importing CSS in the document
  const dom = new JSDOM(data.replace(/@import.*/gm, ''))

  const title = dom.window.document.querySelector('h2').textContent
  const recommendations = dom.window.document.querySelector('ul').textContent

  console.log(recommendations)

  if (title === 'Sorry') {
    console.log('🚨 Feed is invalid!')
    process.exit(1)
  } else {
    console.log('✅ Feed is valid!')
  }
} catch (error) {
  console.log('Service is down')
  console.error(error.response.statusCode)
}
