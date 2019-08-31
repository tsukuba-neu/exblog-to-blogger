import { Comment } from './Comment'

export class Post {
  id = ''
  title = ''
  date: Date
  content = ''
  categories: string[] = []
  comments: Comment[] = []
}
