import { describe, expect, it } from 'vitest'
import { parseCommit, parseRawCommit } from '../src/parse'

describe('parseRawCommit', () => {
  it('should parse raw commit', () => {
    const commit = '9cfa09f|feat(scope): commit message|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|breaking changes: this is a breaking change\nCo-authored-by: author2 <test@example.com>'
    expect(parseRawCommit(commit)).toMatchInlineSnapshot(`
      {
        "author": {
          "email": "author1@example.com",
          "name": "author1",
        },
        "body": "breaking changes: this is a breaking change
      Co-authored-by: author2 <test@example.com>",
        "data": "Thu Jan 23 17:42:15 2025 +0800",
        "message": "feat(scope): commit message",
        "shortHash": "9cfa09f",
      }
    `)
  })

  it('should parse raw commit without body', () => {
    const commit = '9cfa09f|feat(scope): commit message|author1|author1@example.com|Thu Jan 23 17:42:15 2025 +0800|'
    expect(parseRawCommit(commit)).toMatchInlineSnapshot(`
      {
        "author": {
          "email": "author1@example.com",
          "name": "author1",
        },
        "body": "",
        "data": "Thu Jan 23 17:42:15 2025 +0800",
        "message": "feat(scope): commit message",
        "shortHash": "9cfa09f",
      }
    `)
  })
})

describe('parseCommit', () => {
  it('should parse conventional commit', () => {
    const commit = {
      author: {
        email: 'author1@example.com',
        name: 'author1',
      },
      body: '',
      data: 'Thu Jan 23 17:42:15 2025 +0800',
      message: 'feat(scope): commit message',
      shortHash: '9cfa09f',
    }

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
    const commit = {
      author: {
        email: 'author1@example.com',
        name: 'author1',
      },
      body: '',
      data: 'Thu Jan 23 17:42:15 2025 +0800',
      message: 'feat: commit message',
      shortHash: '9cfa09f',
    }

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
    const commit = {
      author: {
        email: 'author1@example.com',
        name: 'author1',
      },
      body: '',
      data: 'Thu Jan 23 17:42:15 2025 +0800',
      message: 'feat(scope)!: commit message',
      shortHash: '9cfa09f',
    }
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
        "message": "feat(scope)!: commit message",
        "references": [],
        "scope": "scope",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)
  })

  it('should parse conventional commit with breaking changes in body', () => {
    const commit = {
      author: {
        email: 'author1@example.com',
        name: 'author1',
      },
      body: 'breaking changes: this is a breaking change',
      data: 'Thu Jan 23 17:42:15 2025 +0800',
      message: 'feat(scope): commit message',
      shortHash: '9cfa09f',
    }
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
        "message": "feat(scope): commit message",
        "references": [],
        "scope": "scope",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)
  })

  it('should parse conventional commit with reference pr', () => {
    const commit = {
      author: {
        email: 'author1@example.com',
        name: 'author1',
      },
      body: '',
      data: 'Thu Jan 23 17:42:15 2025 +0800',
      message: 'feat(scope): commit message (#1)',
      shortHash: '9cfa09f',
    }
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
        "message": "feat(scope): commit message (#1)",
        "references": [
          {
            "type": "pull-request",
            "value": "#1",
          },
        ],
        "scope": "scope",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)
  })

  it('should parse conventional commit with reference issue', () => {
    const commit = {
      author: {
        email: 'author1@example.com',
        name: 'author1',
      },
      body: '',
      data: 'Thu Jan 23 17:42:15 2025 +0800',
      message: 'feat(scope): commit message, closes: #1',
      shortHash: '9cfa09f',
    }
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
        "message": "feat(scope): commit message, closes: #1",
        "references": [
          {
            "type": "issue",
            "value": "#1",
          },
        ],
        "scope": "scope",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)
  })

  it('should parse conventional commit with co-author', () => {
    const commit = {
      author: {
        email: 'author1@example.com',
        name: 'author1',
      },
      body: 'Co-authored-by: author2 <test@example.com>',
      data: 'Thu Jan 23 17:42:15 2025 +0800',
      message: 'feat(scope): commit message',
      shortHash: '9cfa09f',
    }
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
    const commit = {
      author: {
        email: 'author1@example.com',
        name: 'author1',
      },
      body: '',
      data: 'Thu Jan 23 17:42:15 2025 +0800',
      message: '✨ feat(scope): commit message',
      shortHash: '9cfa09f',
    }

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
        "message": "✨ feat(scope): commit message",
        "references": [],
        "scope": "scope",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)

    const commit2 = {
      author: {
        email: 'author1@example.com',
        name: 'author1',
      },
      body: '',
      data: 'Thu Jan 23 17:42:15 2025 +0800',
      message: ':bug: feat(scope): commit message',
      shortHash: '9cfa09f',
    }
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
        "description": "commit message",
        "isBreaking": false,
        "isConventional": true,
        "message": ":bug: feat(scope): commit message",
        "references": [],
        "scope": "scope",
        "shortHash": "9cfa09f",
        "type": "feat",
      }
    `)
  })

  it('should parse non-conventional commit', () => {
    const commit = {
      author: {
        email: 'author1@example.com',
        name: 'author1',
      },
      body: '',
      data: 'Thu Jan 23 17:42:15 2025 +0800',
      message: 'init commit message',
      shortHash: '9cfa09f',
    }
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
        "description": "init commit message",
        "isBreaking": false,
        "isConventional": false,
        "message": "init commit message",
        "references": [],
        "scope": "",
        "shortHash": "9cfa09f",
        "type": "",
      }
    `)
  })
})
