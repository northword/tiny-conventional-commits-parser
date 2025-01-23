import { execCommand } from './utils'

export function getLastGitTag(): string | undefined {
  try {
    return execCommand('git describe --tags --abbrev=0')?.split('\n').at(0) || undefined
  }
  catch {
    return undefined
  }
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
 * $ git log --format="%H|%an|%ae|%ad|%s|%d|%b[GIT_LOG_COMMIT_END]" --follow docs/pages/en/integrations/index.md
 * 62ef7ed8f54ea1faeacf6f6c574df491814ec1b1|Neko Ayaka|neko@ayaka.moe|Wed Apr 24 14:24:44 2024 +0800|docs: fix english integrations list||Signed-off-by: Neko Ayaka <neko@ayaka.moe>
 * [GIT_LOG_COMMIT_END]
 * 34357cc0956db77d1fc597327ba880d7eebf67ce|Rizumu Ayaka|rizumu@ayaka.moe|Mon Apr 22 22:51:24 2024 +0800|release: pre-release v2.0.0-rc10| (tag: v2.0.0-rc10)|Signed-off-by: Rizumu Ayaka <rizumu@ayaka.moe>
 * [GIT_LOG_COMMIT_END]
 * (END)
 * ```
 */
export const GIT_LOG_FORMAT = '%h|%s|%an|%ae|%ad|%b[GIT_LOG_COMMIT_END]'

export function getGitLog(from: string | undefined, to = 'HEAD'): string[] {
  return execCommand(`git --no-pager log "${from ? `${from}...${to}` : to}" --pretty="${GIT_LOG_FORMAT}"`)
    .split('[GIT_LOG_COMMIT_END]\n')
    .filter(Boolean)
}
