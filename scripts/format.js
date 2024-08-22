import ParseRss from 'rss-parser'
import xmlFormat from 'xml-formatter'
import {
  composeFeedItem,
  getConfig,
  getFeedContent,
  overwriteFeedContent,
} from '../utils/index.js'

const { breakDelimiter } = getConfig()

const parser = new ParseRss()

const xml = getFeedContent()

parser.parseString(xml).then((parsedXml) => {
  const sortedItems = parsedXml.items
    .sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate))
    .map(composeFeedItem)
    .join('')

  const [before] = xml.split(breakDelimiter)
  const updatedFeedContent = `${before}${breakDelimiter}${sortedItems}</channel></rss>`

  const formattedXml = xmlFormat(updatedFeedContent, {
    indentation: '  ',
    collapseContent: true,
  })

  overwriteFeedContent(updatedXml)
})
