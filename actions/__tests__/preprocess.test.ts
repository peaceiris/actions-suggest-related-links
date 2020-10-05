import {md2text} from '../src/preprocess';

describe('md2text', () => {
  const tests = [
    {
      name: 'heading',
      in: '## This is a h2 tag',
      out: 'This is a h2 tag'
    },
    {
      name: 'inline code',
      in: 'this is a inline `code`.',
      out: 'this is a inline code'
    },
    {
      name: 'HTML heading',
      in: '<h2>this is a h2 tag</h2>',
      out: 'this is a h2 tag'
    },
    {
      name: 'HTML tag',
      in: '<head> <body>',
      out: 'head body'
    },
    {
      name: 'HTML comment',
      in: '<!-- comment line -->',
      out: ''
    },
    {
      name: 'double quotation',
      in: 'this is a "double quotation"',
      out: 'this is a double quotation'
    },
    {
      name: 'single quotation',
      in: "'github' 'actions'",
      out: 'github actions'
    },
    {
      name: 'colon',
      in: 'this: is: a colon',
      out: 'this is a colon'
    },
    {
      name: 'colon operator',
      in: 'this is a colon:operator::double',
      out: 'this is a colon:operator::double'
    },
    {
      name: 'semicolon',
      in: 'this; is; a semicolon',
      out: 'this is a semicolon'
    },
    {
      name: 'hyphen',
      in: 'this is - a - hyphen',
      out: 'this is a hyphen'
    },
    {
      name: 'hyphenation',
      in: 'this is a pre-processing-method',
      out: 'this is a pre-processing-method'
    },
    {
      name: 'table',
      in: '| a | b | c | | :--- | :---: | ---: | | d | e | f |',
      out: 'a b c d e f'
    },
    {
      name: 'pipe',
      in: 'GitHub Actions | GitHub Help | github.com',
      out: 'GitHub Actions GitHub Help github.com'
    },
    {
      name: 'comma',
      in: 'A, B, and C',
      out: 'A B and C'
    },
    {
      name: 'period',
      in: 'A. B. C.',
      out: 'A B C'
    },
    {
      name: 'round brackets of function',
      in: 'str.replace(); str.split()',
      out: 'str.replace str.split'
    },
    {
      name: 'round brackets',
      in: 'hello (github) actions, (hello)',
      out: 'hello github actions hello'
    },
    {
      name: 'task list (checkbox)',
      in: '- [x] todo',
      out: 'todo'
    },
    {
      name: 'GitHub Actions workflow syntax',
      in: '${{ github.sha }}',
      out: 'github.sha'
    },
    {
      name: 'shell syntax',
      in: '${GITHUB_SHA}',
      out: 'GITHUB_SHA'
    },
    {
      name: 'AND OR',
      in: '(a && b) || (c && d)',
      out: 'a b c d'
    },
    {
      name: 'ternary operator',
      in: 'c = a == b ? 1 : 0',
      out: 'c a b 1 0'
    },
    {
      name: 'commit message',
      in: 'ci: change workflow name [skip ci]',
      out: 'ci change workflow name skip ci'
    },
    {
      name: 'URL',
      in: 'docker.pkg.github.com/ github.repository /action:latest',
      out: 'docker.pkg.github.com github.repository action:latest'
    },
    {
      name: 'backquote',
      in: `\`github\` \`actions\``,
      out: 'github actions'
    }
  ];

  for (const t of tests) {
    test(`convert markdown to plain text: ${t.name}`, () => {
      expect(md2text(t.in)).toMatch(t.out);
    });
  }
});
