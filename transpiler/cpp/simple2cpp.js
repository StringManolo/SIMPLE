import lexer from "../../lexer/lexer.mjs";
import parser from "../../parser/parser.mjs";

const code = `x = "Hello World";
showHelloWorld() {
  out($1);
  return 6 * 7;
}

showHelloWorld(x);

x = 8;

`;

const lexemas = lexer(code);
const expressions = parser(lexemas); 


const simple2cpp = expressions => {
  let includes = [],
  globals = "",
  cpp = "\nint main() {\n",
  functionDefinition = "",
  ids = [],
  functions = [];

  const listToInclude = include => {
    let aux = "";
    for (let i in include) {
      aux += `#include <${include[i]}>\n`;
    }
    return aux;
  }

  const addInclude = directive => {
    for(let i in includes) {
      if (includes[i] === directive) {
        return;
      }
    }
    includes.push(directive);
  }

  const addId = id => {
    for(let i in ids) {
      if (ids[i] === id) {
        return false;
      }
    }
    ids.push(id);
    return true;
  }

  const transpileAsignment = expression => {
    let actualExpr = "";
    for(let i in expression) {

      if (expression[i].type === "id") {
        /* Add auto to ids if the id not declared before */
        if (addId(expression[i].value)) {
          expression[i].value = `auto ${expression[i].value}`;
        }
      }

      if (expression[i].type === "string") {
        expression[i].value = `"${expression[i].value}"`;
        addInclude("string"); 
      }
      actualExpr += expression[i].value + " ";

    }
    cpp += actualExpr + "\n";
  }

  let functionCtx = false;
  const transpileFunctionDefinition = expression => {
    let actualExpr = "";

    for (let i in expression) {
      if (expression[i].type === "id") {
        if (addId(expression[i].value)) {
          expression[i].value = `auto ${expression[i].value}`;
        }
        functions.push({ id: expression[i].value });
        actualExpr = "";
        functionCtx = true;
      }
    } 
    /* ASK FOR EXPRESSIONS UNTIL END OF FUNCTION FOUND */
    
  }


  const transpileFunctionCall = expression => {
    let actualExpr = "";
    for (let i in expression) {
      actualExpr += expression[i].value + " ";
    }

    if (functionCtx) {

      for (let i in expression) {
        if (expression[i].type === "argument") {
          if (functions[functions.length - 1].args) {
            functions[functions.length - 1].args.push(expression[i].value);
          } else {
            functions[functions.length - 1].args = [ expression[i].value ];
          }
        } 
      }

      if (functions[functions.length - 1].expr) {
        functions[functions.length - 1].expr.push(actualExpr);
      } else {
        functions[functions.length - 1].expr = [ actualExpr ];
      }
    } else {
      cpp += actualExpr + "\n";
    }
  }

  const transpileReturnExpression = expression => {
    let actualExpr = "";
    for (let i in expression) {
      actualExpr += expression[i].value + " ";
    }
    functions[functions.length -1].returned = actualExpr;
  }

  const transpileFunctionDefinitionEnd = expression => {
    functionCtx = false;
    //console.log(JSON.stringify(functions, null, 2));
  }

  for (let i = 0; i < expressions.length; ++i) {
    const expr = Object.entries(expressions[i]);
    switch (expr[0][0]) {
      case "asignment":
        transpileAsignment(expr[0].splice(1)[0]);
      break;

      case "functiondefinition": 
        transpileFunctionDefinition(expr[0].splice(1)[0]); 
      break;

      case "functioncall":
        transpileFunctionCall(expr[0].splice(1)[0]);
      break;
 
      case "funciondefinitionend":
        transpileFunctionDefinitionEnd(expr[0].splice(1)[0]);
      break;

      case "returnexpression":
        transpileReturnExpression(expr[0].splice(1)[0]);
      break; 
    } 
  }

  for (let i in functions) {
    /* prototype */
    globals += `${functions[i].id}(${functions[i].args || ""});\n`;
   
    /* define */
    functionDefinition += `${functions[i].id}(${functions[i].args || ""}) {\n`;
    for (let j in functions[i].expr) {
      functionDefinition += functions[i].expr[j] + "\n";
    }
    functionDefinition += `${functions[i].returned}\n}\n`;
  }
  

/* define function keywords like out, if, for... */

  cpp += "\nreturn 0;\n}\n";

  return `${listToInclude(includes)}
using namespace std;\n
${globals}
${cpp}
${functionDefinition}`; 
}

const cpp = simple2cpp(expressions);
console.log(`
INPUT:
${code}


OUTPUT:
${cpp}
`);


//console.log(JSON.stringify(expressions, null, 2));


