import lexer from "./../lexer/lexer.mjs"

const parser = lexemas => {
  const getExpressions = lex => {
    let expressions = [];
    let actualExpression = [];
    for(let i in lex) {
      if (lex[i].type === "linebreak") {
        // ignore line breaks
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
    return namedExpr;
  }

  return nameExpressions(getExpressions(lexemas));
}

export default parser;
