import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'

const xmlFile = join(process.cwd(), 'feed.xml')
const configFile = join(process.cwd(), 'config.json')

export function buildTitleDate (timestamp) {
  const [date, time] = new Date(timestamp).toISOString().split('T')
  // Format: YYYY-MM-DD HH:MM:SS
  return `${date} ${time.slice(0, 8)}`
}

export function getConfig () {
  return JSON.parse(readFileSync(configFile, 'utf8'))
}

export function overwriteConfig (config) {
  writeFileSync(configFile, JSON.stringify(config, null, 2))
}

export function composeFeedItem ({ title, description, pubDate, link, guid }) {
  return `
    <item>
      <title>${title}</title>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <link>${link}</link>
      <guid>${guid}</guid>
    </item>
  `
}

export function getFeedContent () {
  return readFileSync(xmlFile, 'utf8')
}

export function overwriteFeedContent (content) {
  writeFileSync(xmlFile, content)
}

export function getFeedHash () {
  const xml = getFeedContent()
  return createHash('sha256').update(xml).digest('hex')
}

// @see: https://whitep4nth3r.com/blog/how-to-format-dates-for-rss-feeds-rfc-822/
export function addLeadingZero (num) {
  num = num.toString()
  while (num.length < 2) num = '0' + num
  return num
}

export function buildRFC822Date (dateString) {
  const dayStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const timeStamp = Date.parse(dateString)
  const date = new Date(timeStamp)

  const day = dayStrings[date.getDay()]
  const dayNumber = addLeadingZero(date.getDate())
  const month = monthStrings[date.getMonth()]
  const year = date.getFullYear()
  const time = `${addLeadingZero(date.getHours())}:${addLeadingZero(date.getMinutes())}:00`
  const timezone = date.getTimezoneOffset() === 0 ? 'GMT' : 'BST'

  // Wed, 02 Oct 2002 13:00:00 GMT
  return `${day}, ${dayNumber} ${month} ${year} ${time} ${timezone}`
}
