import { buildRFC822Date, overwriteFeedContent, getFeedContent, getConfig, overwriteConfig } from '../utils/index.js'

const xml = getFeedContent()
const now = new Date()

// Replace lastBuildDate with current date in the feed
const lastBuildDateRegex = /<lastBuildDate>.*<\/lastBuildDate>/g
const [before, after] = xml.split(lastBuildDateRegex)
const updatedXml = `${before}<lastBuildDate>${buildRFC822Date(now.toISOString())}</lastBuildDate>${after}`

overwriteFeedContent(updatedXml)

// Overwrite config with new timestamp
const config = getConfig()
overwriteConfig({ ...config, lastCheckTimestamp: now.getTime() })
