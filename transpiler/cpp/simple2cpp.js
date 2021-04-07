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
  cpp = "using namespace std;\n\nint main() {\n",
  functionDefinition = "",
  ids = [];

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
 
  const transpileFunctionDefinition = expression => {
     
  }


  for (let i in expressions) {
    const expr = Object.entries(expressions[i]);
    switch (expr[0][0]) {
      case "asignment":
        transpileAsignment(expr[0].splice(1)[0]);
      break;

      case "functiondefinition":
        transpileFunctionDefinition(expr[0].splice(1)[0]);
      break;
    } 
  }

  cpp += "\nreturn 0;\n}\n";

  return `${listToInclude(includes)}
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


