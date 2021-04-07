

import lexer from "./../lexer/lexer.mjs";
const code = `x = "Hello World";
showHelloWorld() {
  out($1);
  return 6 * 7;
}

showHelloWorld(x);

`;
const lexemas = lexer(code);
 

const parser = lexemas => {

  const getExpressions = lex => {
    let expressions = [];
    let actualExpression = [];
    for(let i in lex) {
      if (lex[i].type === "linebreak") {

      } else {
        actualExpression.push(lex[i]);
        if (lex[i].type === "lbrace" || lex[i].type === "rbrace" || lex[i].type === "semicolon") {
          expressions.push(actualExpression);
          actualExpression = [];
        }
      }
    }
    return expressions;
  }

  console.log(`CODE TO PARSE:\n${code}\n\n\nTOKENS:`);

  const nameExpressions = expressions => {
    let namedExpr = [];
    for(let i in expressions) {
      let actual = [];
      let aux = [];
      let pos = [];
      for(let j in expressions[i]) {
        actual.push(expressions[i][j].type);
        aux.push(expressions[i][j].value);
      }
      console.log(actual + "\n")

      if (actual[0] === "id" && actual[1] === "assign" 
      && actual[actual.length - 1] === "semicolon" ) {
        namedExpr.push({"asignment": expressions[i]});
      } else if (actual[0] === "id" && actual[1] === "lparam" &&
      actual[2] === "rparam" && actual[3] === "lbrace") {
        namedExpr.push({"functiondefinition": expressions[i]});
      } else if (actual[0] === "id" && actual[1] === "lparam" &&
      actual[actual.length-2] === "rparam" && actual[actual.length-1] === "semicolon") {
        namedExpr.push({"functioncall": expressions[i]});
      } else if (actual[0] === "rbrace") {
        namedExpr.push({"funciondefinitionend": expressions[i]});
      } else if (actual[0] === "id" && aux[0] === "return") {
        namedExpr.push({"returnexpression": expressions[i]});
      }

      actual = [];
    }
    console.log("\n\n\nEXPRESSIONS:");
    console.log(JSON.stringify(namedExpr, null, 2));
  }

  nameExpressions(getExpressions(lexemas));
  

}


parser(lexemas);

//export default parser;
