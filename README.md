# 📦 @tsukuba-neu/exblog-to-blogger

Takeout contents of exblog.jp and export for blogger.com


![GitHub](https://img.shields.io/github/license/tsukuba-neu/exblog-to-blogger?style=flat-square)
![Dependencies for fetch package](https://img.shields.io/david/tsukuba-neu/exblog-to-blogger?label=Dependencies%28fetch%29&path=packages%2Ffetch&style=flat-square)
![Dependencies for feed package](https://img.shields.io/david/tsukuba-neu/exblog-to-blogger?label=Dependencies%28feed%29&path=packages%2Ffeed&style=flat-square)
![Dependencies for util package](https://img.shields.io/david/tsukuba-neu/exblog-to-blogger?label=Dependencies%28util%29&path=packages%2Futil&style=flat-square)
[![Our blog](https://img.shields.io/badge/blog-tsukuba--neu-blue?style=flat-square)](https://blog.tkbneu.net)

## 🤔 これはなに？

[エキサイトブログ](https://exblog.jp)のコンテンツを[Blogger](https://blogger.com)に引っ越すためのツール群です。[人形劇団NEUのブログ](https://blog.tkbneu.net)をBloggerに移転させる際に開発したコードを公開しています。

## 🧰 セットアップ

```shell
# 依存パッケージのインストール
$ yarn
```
## ✊ 使い方
### `packages/fetch`

エキサイトブログから画像とテキストコンテンツをダウンロードします。記事のテキスト部分はJSONに格納されます。

ダウンロード時に画像URLのホスト名を書き換えることができます。NEUブログでは`https://exblog-takeout.storage.tkbneu.net`に書き換える処理をしています。

⚠ **[画像URL検出のための文字列をハードコードしています。](https://github.com/tsukuba-neu/exblog-to-blogger/blob/eaefa1bab2f27a59f433a66b98870793fa673293/packages/fetch/src/index.ts#L47-L48) また、スクレイピングはノイブログで採用していたスキンをもとに開発しています。別ブログに流用する際はこれらを書き換える必要があります。**

```shell
# $ yarn start [最新記事ページのURL]
#     -i [ダウンロード間隔(sec)]
#     -o [書き出し先ディレクトリ]
#     --imgHost [画像URLのホスト]

$ yarn start https://neu0.exblog.jp/30550848/ -i 0.3 -o out --imgHost https://exblog-takeout.storage.tkbneu.net
```

書き出し先ディレクトリに `output.json` と画像のディレクトリが配置されます。 `output.json` は以下のような記事オブジェクトの配列です。

```json
{
  "id": "30464080",
  "title": "愛知学生人形劇連盟合宿に参加しました",
  "content": "<!-- interest_match_relevant_zone_start -->\n              <center><center style=\"text-align: left;\">帰省して少し休めると思ったら突如実家の階段で足をくじきました。こんばんは、宴です。<br> .....",
  "categories": [
    "日記"
  ],
  "comments": [
    {
      "author": "tsukuba-neu",
      "content": "@先輩<br>\nありがとうございます〜！よかったです……よろしくお伝えください……🙇‍♂️（宴）",
      "date": "2019-03-21T09:29:00.000Z"
    }
  ],
  "date": "2019-03-11T11:00:00.000Z"
}
```

### `packages/feed`

`packages/fetch` で出力されたJSONデータを、[Bloggerのインポート](https://support.google.com/blogger/answer/41387?hl=ja)で利用可能なXMLファイルへ変換します。

```shell
# $ yarn start [記事jsonデータへのパス] -o [書き出し先xmlファイルのパス]

$ yarn start ../fetch/out/output.json -o out.xml
```

## 📋 免責事項

他者の提供するWebサーバからデータを読み出す際には、サーバに負荷をかけ業務を妨害することの無いように注意してください。そのほか、このプログラムを使用する際には、自己の責任の元で利用してください。このプログラムを使用して生じた損害等に開発者は一切の責任を負いません。

## 👽 人形劇団NEUについて

1976年旗揚げ。筑波大学（茨城県）の芸術系サークルとして、主に中高生以上をターゲットとした独特な作品の制作を続ける。国内最大の人形劇の祭典「いいだ人形劇フェスタ」への上演参加や、小学校・保育園等への出張公演など、学外での活動も積極的に行なっている。劇団名は「ノイ」、ドイツ語で「新しい」を意味する。

[![Our blog](https://img.shields.io/badge/blog-tsukuba--neu-blue?style=flat-square)](https://blog.tkbneu.net)
