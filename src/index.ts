import type { GitCommit } from './types'
import { getGitLog, getLastGitTag } from './git'
import { parseCommit, parseRawCommit } from './parse'

export * from './git'
export * from './parse'
export * from './types'

export function getCommits(from?: string, to?: string, path?: string): GitCommit[] {
  return getGitLog(from, to, path)
    .map(parseRawCommit)
    .map(parseCommit)
}

export function getRecentCommits(from?: string, to?: string, path?: string): GitCommit[] {
  if (!from)
    from = getLastGitTag()
  if (!to)
    to = 'HEAD'

  return getCommits(from, to, path)
}
