import type { GitCommit } from './types'
import { getGitLog, getLastGitTag } from './git'
import { parseCommit, parseRawCommit } from './parse'

export * from './git'
export * from './parse'
export * from './types'

export function getCommits(from?: string, to?: string): GitCommit[] {
  return getGitLog(from, to)
    .map(parseRawCommit)
    .map(parseCommit)
}

export function getRecentCommits(from?: string, to?: string): GitCommit[] {
  if (!from)
    from = getLastGitTag()
  if (!to)
    to = 'HEAD'

  return getCommits(from, to)
}
