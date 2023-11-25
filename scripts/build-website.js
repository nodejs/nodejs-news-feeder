import { getFeedContent, overwriteWebsiteContent, getWebsiteTemplate } from '../utils/index.js'
import ejs from 'ejs'
import { XMLValidator, XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

// @Ulises: Remove when @ulisesgascon/rss-feed-parser is fixed. 
// @see: https://github.com/UlisesGascon/micro-utilities/issues/24
function rssParse(rssContent) {
  const result = XMLValidator.validate(rssContent);
  if (result.err !== undefined) {
    throw new Error('XML is invalid');
  }
  
  const jObj = parser.parse(rssContent);

  if (jObj?.rss?.channel === undefined) {
    throw new Error('XML has not valid rss format');
  }

  const {item: items, ...metadata} = jObj.rss.channel;

  return {
    metadata,
    items: items ?? []
  }
}

const template = getWebsiteTemplate()
const feed = getFeedContent()
const { metadata, items } = rssParse(feed)
const html = ejs.render(template, { metadata, items });
overwriteWebsiteContent(html)