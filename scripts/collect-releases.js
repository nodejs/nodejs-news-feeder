import ghGot from 'gh-got'
import { buildRFC822Date, composeFeedItem, getFeedContent, overwriteFeedContent, getConfig } from '../utils/index.js'

const { lastCheckTimestamp, releasePaginationLimit, reposPaginationLimit, breakDelimiter } = getConfig()

// Collect Org Repos
const repos = await ghGot.paginate.all(
  'users/nodejs/repos',
  {
    token: process.env.GITHUB_TOKEN,
    pagination: { countLimit: reposPaginationLimit }
  }
)

// Collect New Releases
const releases = await Promise.all(repos.map(async repo => {
  const repoReleases = await ghGot(
            `repos/${repo.full_name}/releases`,
            {
              token: process.env.GITHUB_TOKEN,
              pagination: { countLimit: releasePaginationLimit }
            }
  ).json()

  // Select only releases that are newer than the last check and add the repo name
  return repoReleases
    .filter(rel => new Date(rel.published_at).getTime() > lastCheckTimestamp)
    .map(rel => ({ ...rel, repo: repo.full_name }))
}))

const relevantReleases = releases.flat().map(rel => composeFeedItem({
  title: `Released ${rel.repo} ${rel.tag_name}`,
  description: "",
  pubDate: buildRFC822Date(rel.published_at),
  link: rel.html_url,
  guid: rel.html_url
})).join('')

const feedContent = getFeedContent()
const [before, after] = feedContent.split(breakDelimiter)
const updatedFeedContent = `${before}${breakDelimiter}${relevantReleases}${after}`
overwriteFeedContent(updatedFeedContent)
