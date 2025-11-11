import { execSync } from 'node:child_process'

function execCommand(
  cmd: string,
  options?: { cwd?: string, throwOnError?: boolean },
): string {
  try {
    return execSync(cmd, { encoding: 'utf8', cwd: options?.cwd }).trim()
  }
  catch (error) {
    if (options?.throwOnError)
      throw error
    return ''
  }
}

export function getLastGitTag(): string | undefined {
  return execCommand('git describe --tags --abbrev=0')?.split('\n').at(0) || undefined
}

export function getCurrentGitTag(): string | undefined {
  return execCommand('git tag --points-at HEAD') || undefined
}

/**
 * The format of git log.
 *
 * commit_short_hash | subject | author_name | author_email | author_date | body
 *
 * @see {@link https://git-scm.com/docs/pretty-formats | documentation} for details.
 *
 * Note: Make sure that `body` is in last position, as `\n` or `|` in body may breaks subsequent processing.
 *
 * @example stdout
 *
 * ```bash
 * $ git log --format="%h|%s|%an|%ae|%ad|%b[GIT_LOG_COMMIT_END]"
 * 9cfa09f|feat(scope): commit message|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|breaking changes: this is a breaking change
 * Co-authored-by: author2 <test@example.com>[GIT_LOG_COMMIT_END]
 * 0000001|feat(scope): commit message2|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|[GIT_LOG_COMMIT_END]
 * (END)
 * ```
 */
const GIT_LOG_FORMAT = '%h|%s|%an|%ae|%ad|%b[GIT_LOG_COMMIT_END]'

export function getGitLog(from: string | undefined, to = 'HEAD', path?: string): string[] {
  return execCommand(`git --no-pager log "${from ? `${from}...${to}` : to}" --pretty="${GIT_LOG_FORMAT}" ${path ? `-- ${path}` : ''}`)
    .split('[GIT_LOG_COMMIT_END]\n')
    .filter(Boolean)
}
