import * as path from 'path'
import { promises as fs } from 'fs'
import parseArgs from 'minimist'
import * as xmlbuilder from 'xmlbuilder'

const consola = require('consola')
const blogId = '1234567890'

const args = parseArgs(process.argv.slice(2))
const source: string = args._[0]
const out: string = args.o
;(async (): Promise<void> => {
  const posts = JSON.parse(await fs.readFile(source, { encoding: 'utf-8' }))

  const root = xmlbuilder.create('feed')
  root
    .att('xmlns', 'http://www.w3.org/2005/Atom')
    .att('xmlns:thr', 'http://purl.org/syndication/thread/1.0')
    .att('xmlns:gd', 'http://schemas.google.com/g/2005')
    .att('xmlns:openSearch', 'http://a9.com/-/spec/opensearch/1.1/')
  root.ele('id').txt('tag:blogger.com,1999:blog-' + blogId)
  root
    .ele('generator')
    .att('version', '7.00')
    .att('uri', 'https://www.blogger.com')
    .txt('Blogger')

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const date = new Date(post.date).toISOString().replace('Z', '') + '+00:00'
    const idStr = `tag:blogger.com,1999:blog-${blogId}.post-${post.id}`

    root.com(post.id)

    const ent = root.ele('entry')
    ent.ele('id').txt(idStr)
    ent.ele('published').txt(date)
    ent.ele('updated').txt(date)
    ent
      .ele('title')
      .att('type', 'text')
      .txt(post.title)
    ent
      .ele('content')
      .att('type', 'html')
      .txt(post.content)
    ent
      .ele('link')
      .att('rel', 'alternate')
      .att('type', 'text/html')
      .att('href', `http://blogName.blogspot.com/${post.id}`)
    ent
      .ele('category')
      .att('scheme', 'http://schemas.google.com/g/2005#kind')
      .att('term', 'http://schemas.google.com/blogger/2008/kind#post')
    const author = ent.ele('author')
    author.ele('name').txt('筑波大学人形劇団NEU')
    author.ele('email').txt('hello@tkbneu.net')
    author
      .ele('gd:image')
      .att('rel', 'http://schemas.google.com/g/2005#thumbnail')
      .att('src', 'https://avatars3.githubusercontent.com/u/43556559')

    for (let h = 0; h < post.categories.length; h++) {
      ent
        .ele('category')
        .att('scheme', 'http://www.blogger.com/atom/ns#')
        .att('term', post.categories[h])
    }

    for (let j = 0; j < post.comments.length; j++) {
      const comment = post.comments[j]
      const comDate =
        new Date(comment.date).toISOString().replace('Z', '') + '+00:00'

      const com = root.ele('entry')
      com
        .ele('id')
        .txt(
          `tag:blogger.com,1999:blog-${blogId}.post-${post.id}.comment-${j *
            10000}`
        )
      com.ele('published').txt(comDate)
      com.ele('updated').txt(comDate)
      com
        .ele('title')
        .att('type', 'text')
        .txt(comment.content.replace(/<[^>]+>/, ''))
      com
        .ele('content')
        .att('type', 'html')
        .txt(comment.content)

      const author = com.ele('author')
      author.ele('name').txt(comment.author)
      author.ele('email').txt('noreply@blogger.com')
      author
        .ele('gd:image')
        .att('rel', 'http://schemas.google.com/g/2005#thumbnail')
        .att('src', 'https://avatars3.githubusercontent.com/u/43556559')

      com
        .ele('category')
        .att('scheme', 'http://schemas.google.com/g/2005#kind')
        .att('term', 'http://schemas.google.com/blogger/2008/kind#comment')
      com
        .ele('thr:in-reply-to')
        .att('type', 'text/html')
        .att('ref', idStr)
        .att('href', `http://blogName.blogspot.com/${post.id}`)
    }
  }

  const output = root.end({
    pretty: true
  })
  await fs.writeFile(path.resolve(out), output, { encoding: 'utf-8' })

  consola.info(`👽 Converted ${posts.length} posts.`)
})()
