// commitlint.config.cjs
module.exports = {
    extends: ['@commitlint/config-conventional'],
  
    rules: {
      'type-enum': [
        2, // Level 2 = Error
        'always', // Muss immer einer dieser Typen sein
        [ // Liste der erlaubten Typen:
          'feat',
          'fix',
          'docs',
          'chore',
          'refactor',
          'test',
          'ci',
          'revert',
          // 'style', 'perf', 'build' wären hier z.B. nicht mehr erlaubt
        ]
      ],
      'scope-empty': [2, 'never'], // Diese Regel gibt es standardmäßig nicht in config-conventional, man könnte sie hinzufügen
      'subject-case': [
        1, 
        'always',
        'lower-case' // oder 'sentence-case', etc.
      ],
  
      'subject-max-length': [
          2, 
          'always',
          72 
      ],
      'body-leading-blank': [2, 'always'],
      'footer-leading-blank': [2, 'always'],
    }
  };