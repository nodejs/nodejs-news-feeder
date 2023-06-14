import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { execSync } from 'child_process'
import { join } from 'path'

const xmlFile = join(process.cwd(), 'feed.xml')

const getHash = () => {
  const xml = readFileSync(xmlFile, 'utf8')
  return createHash('sha256').update(xml).digest('hex')
}

const currentHash = getHash()
execSync('npm run rss:format')
const newHash = getHash()

if (currentHash !== newHash) {
  console.log('The feed.xml file is not formatted.')
  console.log('Please run rss:format to format the feed.xml file.')
  process.exit(1)
}
