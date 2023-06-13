import { buildRFC822Date, overwriteFeedContent, getFeedContent } from '../utils/index.js'

const xml = getFeedContent()
const now = new Date()

const lastBuildDateRegex = /<lastBuildDate>.*<\/lastBuildDate>/g
const [before, after] = xml.split(lastBuildDateRegex)
const updatedXml = `${before}<lastBuildDate>${buildRFC822Date(now.toISOString())}</lastBuildDate>${after}`

overwriteFeedContent(updatedXml)
