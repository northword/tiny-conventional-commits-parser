export interface GitCommitAuthor {
  name: string
  email: string
}

export interface RawGitCommit {
  message: string
  body: string
  shortHash: string
  author: GitCommitAuthor
  data: string
}

export interface Reference {
  type: 'issue' | 'pull-request'
  value: string
}

export interface GitCommit extends Omit<RawGitCommit, 'author'> {
  isConventional: boolean
  description: string
  type: string
  scope: string
  references: Reference[]
  authors: GitCommitAuthor[]
  isBreaking: boolean
}
