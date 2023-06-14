import { buildRFC822Date } from '../utils/index.js'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const xmlFile = join(process.cwd(), 'feed.xml')
const xml = readFileSync(xmlFile, 'utf8')
const now = new Date()

const lastBuildDateRegex = /<lastBuildDate>.*<\/lastBuildDate>/g
const [before, after] = xml.split(lastBuildDateRegex)
const updatedXml = `${before}<lastBuildDate>${buildRFC822Date(now.toISOString())}</lastBuildDate>${after}`

writeFileSync(xmlFile, updatedXml)
