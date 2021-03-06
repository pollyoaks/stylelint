import {
  messages,
  ruleName,
} from ".."
import rules from "../../../rules"
import { testRule } from "../../../testUtils"

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "a::before { content: \"func(foo ,bar ,baz)\"; }",
  }, {
    code: "a::before { background: url('func(foo,bar,baz)'); }",
  }, {
    code: "a { background-size: 0\n, 0\n, 0; }",
  }, {
    code: "a { transform: translate(1\n,1); }",
  }, {
    code: "a { transform: translate(1\r\n, 1); }",
    description: "CRLF",
  }, {
    code: "a { transform: translate(1\n\n,1); }",
  }, {
    code: "a { transform: translate(1\r\n\r\n, 1); }",
    description: "CRLF",
  }, {
    code: "a { transform: color(rgb(0\n\t, 0\n\t,0) lightness(50%)); }",
  }, {
    code: "a { transform: color(rgb(0\n  , 0\n  ,0) lightness(50%)); }",
  }, {
    code: `
      a {
        transform: translate(
          1px /* comment */
          ,1px
        );
      }
    `,
    description: "eol comments",
  } ],

  reject: [ {
    code: "a { transform: translate(1,1); }",
    message: messages.expectedBefore(),
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate(1  ,1); }",
    message: messages.expectedBefore(),
    line: 1,
    column: 29,
  }, {
    code: "a { transform: translate(1 ,1); }",
    message: messages.expectedBefore(),
    line: 1,
    column: 28,
  }, {
    code: "a { transform: translate(1\t,1); }",
    message: messages.expectedBefore(),
    line: 1,
    column: 28,
  }, {
    code: "a { transform: color(rgb(0 , 0 \n,0) lightness(50%)); }",
    message: messages.expectedBefore(),
    line: 1,
    column: 28,
  }, {
    code: "a { transform: color(lightness(50%) rgb(0\n, 0,0)); }",
    message: messages.expectedBefore(),
    line: 2,
    column: 4,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",

  accept: [ {
    code: "$map: (key: value, key2: value2)",
    description: "Sass map ignored",
  }, {
    code: "$list: (value, value2)",
    description: "Sass list ignored",
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],

  accept: [ {
    code: "a::before { content: \"func(foo ,bar ,baz)\"; }",
  }, {
    code: "a::before { background: url('func(foo,bar,baz)'); }",
  }, {
    code: "a { background-size: 0\n, 0\n, 0; }",
  }, {
    code: "a { transform: translate(1\n,1); }",
  }, {
    code: "a { transform: translate(1\r\n, 1); }",
    description: "CRLF",
  }, {
    code: "a { transform: color(rgb(0\n\t, 0\n\t,0) lightness(50%)); }",
  }, {
    code: "a { transform: color(rgb(0\n  , 0\n  ,0) lightness(50%)); }",
  }, {
    code: "a { transform: translate(1,1); }",
  }, {
    code: "a { transform: translate(1  ,1); }",
  }, {
    code: "a { transform: translate(1 , 1); }",
  }, {
    code: "a { transform: translate(1\t,1); }",
  }, {
    code: "a { background: linear-gradient(45deg\n, rgba(0, 0, 0, 1)\n, red); }",
  }, {
    code: `
      a {
        transform: translate(
          1px /* comment */
          ,1px
        );
      }
    `,
    description: "eol comments",
  } ],

  reject: [ {
    code: "a { transform: color(rgb(0\n, 0, 0) lightness(50%)); }",
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 4,
  }, {
    code: "a { transform: color(lightness(50%) rgb(0,0\n,0)); }",
    message: messages.expectedBeforeMultiLine(),
    line: 1,
    column: 42,
  }, {
    code: "a { background: linear-gradient(45deg\n, rgba(0\n, 0, 0\n, 1)\n, red); }",
    message: messages.expectedBeforeMultiLine(),
    line: 3,
    column: 4,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],
  syntax: "scss",

  accept: [{
    code: "$map: (key: value,\nkey2: value2)",
    description: "SCSS map",
  }],
})

testRule(rule, {
  ruleName,
  config: ["never-multi-line"],

  accept: [ {
    code: "a::before { content: \"func(foo\n,bar\n,baz)\"; }",
  }, {
    code: "a::before { background: url('func(foo\n,bar,baz)'); }",
  }, {
    code: "a { transform: translate(1,1); }",
  }, {
    code: "a { transform: translate(1  ,1); }",
  }, {
    code: "a { transform: translate(1 , 1); }",
  }, {
    code: "a { transform: translate(1\t,1); }",
  } ],

  reject: [ {
    code: "a { transform: color(rgb(0,0\n,0) lightness(50%)); }",
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 1,
  }, {
    code: "a { transform: color(lightness(50%) rgb(0\n, 0, 0)); }",
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 1,
  }, {
    code: "a { transform: color(rgb(0\n,0,\n0) lightness(50%)); }",
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 1,
  }, {
    code: "a { transform: color(lightness(50%) rgb(0,\n 0\n,0)); }",
    message: messages.rejectedBeforeMultiLine(),
    line: 3,
    column: 1,
  }, {
    code: `
      a {
        transform: translate(
          1px /* comment */
          , 1px
        );
      }
    `,
    description: "eol comments",
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never-multi-line"],
  syntax: "scss",

  accept: [{
    code: "$map: (key: value\n,key2: value2)",
    description: "SCSS map",
  }],
})
