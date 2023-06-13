import xmlFormat from 'xml-formatter'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const xmlFile = join(process.cwd(), 'feed.xml')
const xml = readFileSync(xmlFile, 'utf8')
const formattedXml = xmlFormat(xml, { indentation: '  ', collapseContent: true })
writeFileSync(xmlFile, formattedXml)
