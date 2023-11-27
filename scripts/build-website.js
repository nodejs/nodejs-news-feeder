import { getFeedContent, overwriteWebsiteContent, getWebsiteTemplate } from '../utils/index.js'
import ejs from 'ejs'
import { rssParse } from '@ulisesgascon/rss-feed-parser'

const template = getWebsiteTemplate()
const feed = getFeedContent()
const { metadata, items } = rssParse(feed)
const html = ejs.render(template, { metadata, items })
overwriteWebsiteContent(html)
