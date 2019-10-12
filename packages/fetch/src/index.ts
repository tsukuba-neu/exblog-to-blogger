import * as path from 'path'
import { promises as fs } from 'fs'
import parseArgs from 'minimist'
import axios from 'axios'
import cheerio from 'cheerio'
const consola = require('consola')

import { chomp, delay } from '@tsukuba-neu/exblog-to-blogger-util'
import { Comment, Post } from './models'

const args = parseArgs(process.argv.slice(2))

// 開始ページ
const entryPoint: string = args._[0]

// ページごとの取得間隔
const interval: number = +args.i || 0

// 取得ページ数: 指定なき場合は上限なし
const limit: number = +args.l || Infinity

// 書き出しディレクトリ名
const out: string = args.o || null

// 画像データ引っ越し先ホスト・パス名
let imgHost: string = args.imgHost || null
if(imgHost && !imgHost.match(/\/$/)) imgHost = imgHost + '/'

async function fetch (url: string, count: number = 0): Promise<Post[]> {
  consola.log('📄 ' + url)

  // ページの取得
  const { data } = await axios.get(url)
  const $ = cheerio.load(data, {
    decodeEntities: false,
    normalizeWhitespace: true
  })

  if(!url.match(/^https:\/\/neu0\.exblog\.jp\/([0-9]+)\//)) {
    throw new Error('Unknown url format')
  }

  const id = RegExp.$1

  // 画像の取得と引っ越し
  // - imgタグとリンクの置き換え
  const imgLinks = $(`a[href^='https://neu0.exblog.jp/iv/detail/']`)
  const srcBase = /^https:\/\/pds\.exblog\.jp\/pds\/1\//
  const images = []
  imgLinks.each((i, el) => {
    const href = el.attribs.href
    const img = $(`a[href^='${href}'] img`)
    const src = img.attr('src')
    if(src) {
      images.push(src)
      if (imgHost) img.attr('src', src.replace(srcBase, imgHost))
      img.removeAttr('width')
      img.removeAttr('height')
      $(`a[href^='${href}']`).replaceWith(img)
    }
  })

  // - 画像のダウンロードと保存
  await Promise.all(images.map(async img => {
    consola.log('-> 📷 ' + img)
    const { data } = await axios.get(img, { responseType: 'arraybuffer' })
    const outPath = path.join(process.cwd(), out, img.replace(srcBase, ''))
    const dir = path.dirname(outPath)
    try{
      await fs.stat(dir)
    } catch(e) {
      await fs.mkdir(dir, { recursive: true })
    }
    await fs.writeFile(outPath, data)
  }))

  // scriptタグの除去
  $('script').remove()

  const title = chomp($('.post-title').text())
  const postDate = new Date(chomp($('.post-tail .TIME a:nth-child(2)').text()))
  const category = chomp($('.post-tail .TIME a:nth-child(3)').text())
  const content = chomp($('.post-body .inner .post-main').html())

  const nextUrl = $('#pager .older_page').attr('href')

  const posts = []
  const post = new Post()

  post.id = id
  post.title = title
  post.date = postDate
  post.content = content
  if(category.length > 0) post.categories.push(category)

  // コメントのパース
  const commentNames = $('.COMMENT .COMMENT_TAIL b').toArray().map(e => cheerio(e).text())
  const commentDates = $('.COMMENT .COMMENT_TAIL').toArray().map(e => {
    const text = cheerio(e).text()
    if(!text.match(/([0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]+:[0-9]+)/)) {
      throw new Error('Unknown date format for comment: ' + text)
    }
    return new Date(RegExp.$1)
  })
  const commentBodies = $('.COMMENT .COMMENT_BODY').toArray().map(e => {
    const $ = cheerio.load(e, { decodeEntities: false })
    $('* div').remove()
    return chomp($('*').html())
  })

  for (let i = 0; i < commentNames.length; i++) {
    const comment = new Comment()
    comment.author = commentNames[i]
    comment.date = commentDates[i]
    comment.content = commentBodies[i]
    post.comments.push(comment)
  }

  posts.push(post)

  if(nextUrl){
    if (count + 1 < limit) {
      if(interval >= 500) consola.info('Waiting interval...')
      await delay(interval)
      posts.push(...await fetch(nextUrl, count + 1))
    } else {
      consola.info('Count reached')
    }
  }

  return posts
}

(async function() {
  const result = JSON.stringify(await fetch(entryPoint), null, 2)
  if (out) {
    await fs.writeFile(path.resolve(out, 'output.json'), result, { encoding: 'utf-8' })
  } else {
    process.stdout.write(result)
  }
})()

