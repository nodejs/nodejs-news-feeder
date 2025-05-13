import { graphql } from '@octokit/graphql'
import { getConfig, composeFeedItem, buildTitleDate, md2html, buildRFC822Date, getFeedContent, overwriteFeedContent } from '../utils/index.js'

const { discussionsInScope, breakDelimiter, lastCheckTimestamp } = getConfig()

const comments = await Promise.all(discussionsInScope.map(async ({ discussionId, team }) => {
  const { repository } = await graphql(
    `
    {
      repository(name: "help", owner: "nodejs") {
        discussion(number: ${discussionId}) {
          comments(last: 100) {
            edges {
              node {
                body
                publishedAt
                updatedAt
                databaseId
              }
            }
          }
        }
      }
    }
    `,
    {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    }
  )

  return repository.discussion.comments.edges
    .filter(comment => new Date(comment.node.publishedAt).getTime() > lastCheckTimestamp)
    .map(comment => ({ ...comment.node, team, discussionId }))
}))

const relevantComments = comments.flat().map(comment => composeFeedItem({
  title: `${comment.team} update on ${buildTitleDate(comment.publishedAt)}`,
  description: `<![CDATA[${md2html(comment.body)}]]>`,
  pubDate: buildRFC822Date(comment.publishedAt),
  link: `https://github.com/orgs/nodejs/discussions/${comment.discussionId}#discussioncomment-${comment.databaseId}`,
  guid: `https://github.com/orgs/nodejs/discussions/${comment.discussionId}#discussioncomment-${comment.databaseId}`
})).join('')

const feedContent = getFeedContent()
const [before, after] = feedContent.split(breakDelimiter)
const updatedFeedContent = `${before}${breakDelimiter}${relevantComments}${after}`
overwriteFeedContent(updatedFeedContent)
