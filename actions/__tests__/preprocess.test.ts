import {md2text, removeSymbols} from '../src/preprocess';

describe('md2text', () => {
  test('convert markdown to plain text', () => {
    const tests = [
      {
        in: '## This is a h2 tag',
        out: 'This is a h2 tag'
      },
      {
        in: 'this is a inline `code`.',
        out: 'this is a inline code.'
      },
      {
        in: '<h2>this is a h2 tag</h2>',
        out: 'this is a h2 tag'
      }
    ];
    for (const t of tests) {
      expect(md2text(t.in)).toMatch(t.out);
    }
  });
});

describe('removeSymbols', () => {
  test('remove symbols', () => {
    const tests = [
      {
        in: 'this is a "double quotation"',
        out: 'this is a double quotation'
      },
      {
        in: 'this: is: a colon',
        out: 'this is a colon'
      },
      {
        in: 'this is a colon:operator::double',
        out: 'this is a colon:operator::double'
      },
      {
        in: 'this; is; a semicolon',
        out: 'this is a semicolon'
      },
      {
        in: 'this is - a - hyphen',
        out: 'this is a hyphen'
      },
      {
        in: 'this is a pre-processing-method',
        out: 'this is a pre-processing-method'
      },
      {
        in: 'GitHub Actions | GitHub Help | github.com',
        out: 'GitHub Actions GitHub Help github.com'
      },
      {
        in: 'A, B, and C',
        out: 'A B and C'
      },
      {
        in: 'A. B. C.',
        out: 'A B C'
      },
      {
        in: 'first sentence. second sentence. third sentence',
        out: 'first sentence second sentence third sentence'
      },
      {
        in: 'str.replace(); str.split()',
        out: 'str.replace str.split'
      },
      {
        in: 'hello (github) actions, (hello)',
        out: 'hello github actions hello'
      },
      {
        in: '- [x] todo',
        out: 'todo'
      },
      {
        in: '${{ github.sha }}',
        out: 'github.sha'
      },
      {
        in: '${GITHUB_SHA}',
        out: 'GITHUB_SHA'
      },
      {
        in: '<head> <body>',
        out: 'head body'
      },
      {
        in: '(a && b) & (c && d)',
        out: 'a b & c d'
      },
      {
        in: 'c = a == b ? 1 : 0',
        out: 'c a b 1 0'
      },
      {
        in: '[skip ci] [skip cd]',
        out: 'skip ci skip cd'
      },
      {
        in: 'docker.pkg.github.com/ github.repository /action:latest',
        out: 'docker.pkg.github.com github.repository action:latest'
      },
      {
        in: "'github' 'actions'",
        out: 'github actions'
      },
      {
        in: `\`github\` \`actions\``,
        out: 'github actions'
      }
    ];
    for (const t of tests) {
      expect(removeSymbols(t.in)).toMatch(t.out);
    }
  });
});
