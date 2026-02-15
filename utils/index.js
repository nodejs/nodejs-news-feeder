import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'
import * as remark from 'remark'
import remarkHtml from 'remark-html'

const dateRegex = /(\d*-\d*-\d*)/gm
const xmlFile = join(process.cwd(), 'feed.xml')
const configFile = join(process.cwd(), 'config.json')
const websiteFile = join(process.cwd(), 'index.html')
const websiteTemplate = join(process.cwd(), 'templates', 'index.html.ejs')

export function md2html (md) {
  return remark.remark().use(remarkHtml).processSync(md).toString()
}

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

export function getWebsiteTemplate () {
  return readFileSync(websiteTemplate, 'utf8')
}

export function overwriteFeedContent (content) {
  writeFileSync(xmlFile, content)
}

export function overwriteWebsiteContent (content) {
  writeFileSync(websiteFile, content)
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

export function generateRetroRequestUrl (dateString) {
  return `https://raw.githubusercontent.com/cutenode/retro-weekly/main/retros/${dateString}.md`
}

export function generateRetroUIUrl (dateString) {
  return `https://github.com/cutenode/retro-weekly/blob/main/retros/${dateString}.md`
}

export function parseRetrospectiveContent (data) {
  const [rawTitle, , description] = data.split('\n')
  const title = rawTitle.replace('# ', '').replaceAll('`', '').trim()
  const dates = title.split(dateRegex)
  return { title, description, lastDay: dates[1], nextDay: dates[3] }
}

/**
 * Calculate the current week's retrospective date.
 * Returns the date of the most recent Sunday (previous Sunday if today is Sunday).
 * Retro files are named by the Sunday start date of the week they cover.
 * @returns {string} Date in YYYY-MM-DD format
 */
export function getCurrentRetroDate () {
  const today = new Date()
  const day = today.getUTCDay() // 0=Sun, 1=Mon, ..., 6=Sat

  // Calculate days to the previous Sunday
  // If today is Sunday (0), go back 7 days to get the previous Sunday
  // Otherwise, go back 'day' days to reach the most recent Sunday
  const daysBack = day === 0 ? 7 : day

  const targetDate = new Date(today)
  targetDate.setUTCDate(today.getUTCDate() - daysBack)

  // Format as YYYY-MM-DD
  const year = targetDate.getUTCFullYear()
  const month = addLeadingZero(targetDate.getUTCMonth() + 1)
  const dateNum = addLeadingZero(targetDate.getUTCDate())
  return `${year}-${month}-${dateNum}`
}

/**
 * Calculate the next week's retrospective date from a given date.
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Date in YYYY-MM-DD format, 7 days later
 */
export function getNextRetroDate (dateString) {
  const date = new Date(dateString + 'T00:00:00Z')
  date.setUTCDate(date.getUTCDate() + 7)

  const year = date.getUTCFullYear()
  const month = addLeadingZero(date.getUTCMonth() + 1)
  const dateNum = addLeadingZero(date.getUTCDate())
  return `${year}-${month}-${dateNum}`
}
