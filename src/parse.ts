import type { GitCommit, GitCommitAuthor, RawGitCommit, Reference } from './types'

// https://www.conventionalcommits.org/en/v1.0.0/
// https://regex101.com/r/FSfNvA/1
const ConventionalCommitRegex
  = /(?<emoji>:.+:|(\uD83C[\uDF00-\uDFFF])|(\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF])|[\u2600-\u2B55])?( *)(?<type>[a-z]+)(\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i
// eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-misleading-capturing-group
const CoAuthoredByRegex = /co-authored-by:\s*(?<name>.+)(<(?<email>.+)>)/gi
const PullRequestRE = /\([ a-z]*(#\d+)\s*\)/g
const IssueRE = /(#\d+)/g
const BreakingRE = /breaking[ -]changes?:/i

export function parseRawCommit(commit: string): RawGitCommit {
  const [shortHash, message, authorName, authorEmail, data, ..._body] = commit.split('|')
  const body = _body.filter(Boolean).join('\n')

  /// keep-sorted
  return {
    author: { name: authorName, email: authorEmail },
    body,
    data,
    message,
    shortHash,
  }
}

export function parseCommit(rawCommit: RawGitCommit): GitCommit {
  const { shortHash, message, body, data } = rawCommit

  const match = message.match(ConventionalCommitRegex)
  const isConventional = match !== null

  const type = match?.groups?.type || ''
  const scope = match?.groups?.scope || ''
  let description = match?.groups?.description || message

  // Check if the commit is a breaking change
  const hasBreakingBody = BreakingRE.test(body)
  const isBreaking = Boolean(match?.groups?.breaking || hasBreakingBody)

  // Extract references from message
  const references: Reference[] = []
  for (const m of description.matchAll(PullRequestRE)) {
    references.push({ type: 'pull-request', value: m[1] })
  }
  for (const m of description.matchAll(IssueRE)) {
    if (!references.some(i => i.value === m[1])) {
      references.push({ type: 'issue', value: m[1] })
    }
  }

  // Remove references and normalize
  description = description.replace(PullRequestRE, '').trim()

  // Find all authors
  const authors: GitCommitAuthor[] = [rawCommit.author]
  for (const match of body.matchAll(CoAuthoredByRegex)) {
    authors.push({
      name: (match.groups?.name || '').trim(),
      email: (match.groups?.email || '').trim(),
    })
  }

  /// keep-sorted
  return {
    authors,
    body,
    data,
    description,
    isBreaking,
    isConventional,
    message,
    references,
    scope,
    shortHash,
    type,
  }
}
