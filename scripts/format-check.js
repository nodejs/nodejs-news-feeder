import { execSync } from 'child_process'
import { getFeedHash } from '../utils/index.js'

const currentHash = getFeedHash()
execSync('npm run rss:format')
const newHash = getFeedHash()

if (currentHash !== newHash) {
  console.log('The feed.xml file is not formatted.')
  console.log('Please run rss:format to format the feed.xml file.')
  process.exit(1)
}
