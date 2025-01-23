import { describe, expect, it } from 'vitest'
import { parseCommit } from '../src/parse'

describe('parseCommit', () => {
  it('should parse conventional commit', () => {
    const commit = '9cfa09f|feat(scope): commit message|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|'
    expect(parseCommit(commit)).toMatchInlineSnapshot(`
      {
        "authors": [
          {
            "email": "author1@example.com",
            "name": "author1",
          },
        ],
        "body": "",
        "data": "Thu Jan 23 17:42:15 2025 +0800",
        "description": "commit message",
        "isBreaking": false,
        "isConventional": true,
        "message": "feat(scope): commit message",
        "references": [],
        "scope": "scope",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)
  })

  it('should parse conventional commit without scape', () => {
    const commit = '9cfa09f|feat: commit message|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|'
    expect(parseCommit(commit)).toMatchInlineSnapshot(`
      {
        "authors": [
          {
            "email": "author1@example.com",
            "name": "author1",
          },
        ],
        "body": "",
        "data": "Thu Jan 23 17:42:15 2025 +0800",
        "description": "commit message",
        "isBreaking": false,
        "isConventional": true,
        "message": "feat: commit message",
        "references": [],
        "scope": "",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)
  })

  it('should parse conventional commit with breaking changes in message', () => {
    const commit = '9cfa09f|feat!: commit message|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|'
    expect(parseCommit(commit)).toMatchInlineSnapshot(`
      {
        "authors": [
          {
            "email": "author1@example.com",
            "name": "author1",
          },
        ],
        "body": "",
        "data": "Thu Jan 23 17:42:15 2025 +0800",
        "description": "commit message",
        "isBreaking": true,
        "isConventional": true,
        "message": "feat!: commit message",
        "references": [],
        "scope": "",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)
  })

  it('should parse conventional commit with breaking changes in body', () => {
    const commit = '9cfa09f|feat: commit message|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|breaking changes: this is a breaking change'
    expect(parseCommit(commit)).toMatchInlineSnapshot(`
      {
        "authors": [
          {
            "email": "author1@example.com",
            "name": "author1",
          },
        ],
        "body": "breaking changes: this is a breaking change",
        "data": "Thu Jan 23 17:42:15 2025 +0800",
        "description": "commit message",
        "isBreaking": true,
        "isConventional": true,
        "message": "feat: commit message",
        "references": [],
        "scope": "",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)
  })

  it('should parse conventional commit with reference pr', () => {
    const commit = '9cfa09f|feat: commit message (#1)|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|'
    expect(parseCommit(commit)).toMatchInlineSnapshot(`
      {
        "authors": [
          {
            "email": "author1@example.com",
            "name": "author1",
          },
        ],
        "body": "",
        "data": "Thu Jan 23 17:42:15 2025 +0800",
        "description": "commit message",
        "isBreaking": false,
        "isConventional": true,
        "message": "feat: commit message (#1)",
        "references": [
          {
            "type": "pull-request",
            "value": "#1",
          },
        ],
        "scope": "",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)
  })

  it('should parse conventional commit with reference issue', () => {
    const commit = '9cfa09f|init commit|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|'
    expect(parseCommit(commit)).toMatchInlineSnapshot(`
      {
        "authors": [
          {
            "email": "author1@example.com",
            "name": "author1",
          },
        ],
        "body": "",
        "data": "Thu Jan 23 17:42:15 2025 +0800",
        "description": "init commit",
        "isBreaking": false,
        "isConventional": false,
        "message": "init commit",
        "references": [],
        "scope": "",
        "shortHash": "9cfa09f",
        "type": "",
      }
    `)
  })

  it('should parse conventional commit with co-author', () => {
    const commit = '9cfa09f|feat(scope): commit message|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|Co-authored-by: author2 <test@example.com>'
    expect(parseCommit(commit)).toMatchInlineSnapshot(`
      {
        "authors": [
          {
            "email": "author1@example.com",
            "name": "author1",
          },
          {
            "email": "test@example.com",
            "name": "author2",
          },
        ],
        "body": "Co-authored-by: author2 <test@example.com>",
        "data": "Thu Jan 23 17:42:15 2025 +0800",
        "description": "commit message",
        "isBreaking": false,
        "isConventional": true,
        "message": "feat(scope): commit message",
        "references": [],
        "scope": "scope",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)
  })

  it('should parse conventional commit with emoji', () => {
    const commit = '9cfa09f|✨ feat(scope): commit|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|'
    expect(parseCommit(commit)).toMatchInlineSnapshot(`
      {
        "authors": [
          {
            "email": "author1@example.com",
            "name": "author1",
          },
        ],
        "body": "",
        "data": "Thu Jan 23 17:42:15 2025 +0800",
        "description": "commit",
        "isBreaking": false,
        "isConventional": true,
        "message": "✨ feat(scope): commit",
        "references": [],
        "scope": "scope",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)

    const commit2 = '9cfa09f|:bug: fix: this is a text emoji|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|'
    expect(parseCommit(commit2)).toMatchInlineSnapshot(`
      {
        "authors": [
          {
            "email": "author1@example.com",
            "name": "author1",
          },
        ],
        "body": "",
        "data": "Thu Jan 23 17:42:15 2025 +0800",
        "description": "this is a text emoji",
        "isBreaking": false,
        "isConventional": true,
        "message": ":bug: fix: this is a text emoji",
        "references": [],
        "scope": "",
        "shortHash": "9cfa09f",
        "type": "fix",
      }
    `)
  })

  it('should parse non-conventional commit', () => {
    const commit = '9cfa09f|feat: commit message, closes: #1|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|'
    expect(parseCommit(commit)).toMatchInlineSnapshot(`
      {
        "authors": [
          {
            "email": "author1@example.com",
            "name": "author1",
          },
        ],
        "body": "",
        "data": "Thu Jan 23 17:42:15 2025 +0800",
        "description": "commit message, closes: #1",
        "isBreaking": false,
        "isConventional": true,
        "message": "feat: commit message, closes: #1",
        "references": [
          {
            "type": "issue",
            "value": "#1",
          },
        ],
        "scope": "",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)
  })
})
