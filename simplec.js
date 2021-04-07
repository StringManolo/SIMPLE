import lexer from "./lexer/lexer.mjs";
import parser from "./parser/parser.mjs";

const code = 'x = "hola mundo";';
const lexemas = lexer(code);

const expressions = parser(lexemas); 

console.log(code + JSON.stringify(expressions, null, 2));


