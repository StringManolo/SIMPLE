
const lexer = code => {
  let tokens = [];
  let aux = "";
  let auxPos = 0;

  /*** VALID ID REGEXP */
  const validId = /[a-zA-Z]/;
  const validIdC = /[a-zA-Z0-9]/;
  /* VALID ID REGEXP ***/

  for (let i = 0; i < code.length; ++i) {

    /*** STRING */
    if (/\"/.test(code[i])) {
      auxPos = i++;
      /* Iterate to get the full string */
      for (; i < code.length; ++i) {
        if (/\"/.test(code[i])) {
          if (code[i - 1] !== "\\") {
            break;
          }
        }
        aux += code[i];
      }

      tokens.push({pos: auxPos, type: "string", value: aux});
      aux = "";
      auxPos = 0;
    }
    /* STRING ***/

    /*** VALID ID */
    /* if valid as first id char */
    if (validId.test(code[i])) {
      auxPos = i;
      /* Iterate to get the full id */
      for (; validIdC.test(code[i]) && i < code.length; ++i) {
        aux += code[i];
      }
      tokens.push({pos: auxPos, type: "id", value: aux});
      aux = "";
      auxPos = 0;
    }
    /* VALID ID ***/
    
    /*** L_PARAM */
    if (/\(/.test(code[i])) {
      tokens.push({pos: i, type: "lparam", value: code[i]});
    }
    /* L_PARAM ***/

    /*** R_PARAM */
    else if (/\)/.test(code[i])) {
      tokens.push({pos: i, type: "rparam", value: code[i]});
    }
    /* R_PARAM ***/

    /*** L_BRACE */
    else if (/\{/.test(code[i])) {
      tokens.push({pos: i, type: "lbrace", value: code[i]});
    }
    /* L_BRACE ***/
    
    /*** R_BRACE */
    else if (/\}/.test(code[i])) {
      tokens.push({pos: i, type: "rbrace", value: code[i]});
    }
    /* R_BRACE ***/

    /*** L_BRACKET */
    else if ("[" === code[i]) {
      tokens.push({pos: i, type: "lbracket", value: code[i]});
    }
    /* L_BRACKET ***/

    /*** R_BRACKET */
    else if ("]" === code[i]) {
      tokens.push({pos: i, type: "rbracket", value: code[i]});
    }
    /* R_BRACKET ***/

    /*** VALUE */
    else if (/[0-9]/.test(code[i])) {
      auxPos = i;
      /* Iterate to get the full value */
      for(; (/[0-9]/.test(code[i]) || "." === code[i]) && i < code.length; ++i) {
        aux += code[i];
      }
      tokens.push({pos: auxPos, type: "value", value: aux});
      aux = "";
      auxPos = 0;
      --i;
    }
    /* VALUE ***/

    /*** MATH OPERATOR */
    else if ("*" === code[i] || "/" === code[i] || "+" === code[i] || "-" === code[i] || "%" === code[i]) {
      tokens.push({pos: i, type: "math_operator", value: code[i]});
    }
    /* MATH OPERATOR ***/

    /*** SEMICOLON */
    else if (";" === code[i]) {
      tokens.push({pos: i, type: "semicolon", value: code[i]});
    }
    /* SEMICOLON ***/

    /*** DOT */
    else if ("." === code[i]) {
      tokens.push({pos: i, type: "dot", value: code[i]});
    }
    /* DOT ***/

    /*** COMMA */
    else if ("," === code[i]) { 
      tokens.push({pos: i, type: "comma", value: code[i]});
    }
    /* COMMA ***/

    /*** LINE BREAK */
    else if ("\n" === code[i]) {
      tokens.push({pos: i, type: "linebreak", value: code[i]});
    }
    /* LINE BREAK ***/

    /*** NOT_EQUALS_TO AND NOT */
    else if ("!" === code[i]) {
      if (code[+i + 1] === "=") {
        tokens.push({pos: i++, type: "notequalsto", value: "!="}); 
      } else {
        tokens.push({pos: i, type: "not", value: code[i]});
      }
    }
    /* NOT_EQUALS_TO AND NOT ***/

    /*** EQUALS_TO AND ASSIGN */
    else if ("=" === code[i]) {
      if (code[+i + 1] === "=") {
        tokens.push({pos: i++, type: "equalsto", value: "=="});
      } else {
        tokens.push({pos: i, type: "assign", value: code[i]});
      }
    }
    /* EQUALS_TO AND ASSIGN ***/

    /*** BASH LIKE ARGS */ 
    else if ("$" === code[i]) {
      auxPos = i++;
      /* Iterate to get the full arg */
      for(; /[0-9]/.test(code[i]) && i < code.length; ++i) {
        aux += code[i];
      }
      tokens.push({pos: auxPos, type: "argument", value: aux || "all"});
      aux = "";
      auxPos = 0;
      --i;
    }
    /* BASH LIKE ARGS ***/


  }

  return tokens;
}

/* //debug code
const debug = `console.log("add: ", add(3, 5, 7) );
  console.log("sub: ", sub(10, 3) );
`;
console.log(debug);
console.log(JSON.stringify(lexer(debug), null,2));
*/

export default lexer;
