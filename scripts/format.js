import xmlFormat from 'xml-formatter'
import { getFeedContent, overwriteFeedContent } from '../utils/index.js'

const xml = getFeedContent()
const formattedXml = xmlFormat(xml, { indentation: '  ', collapseContent: true })
overwriteFeedContent(formattedXml)
