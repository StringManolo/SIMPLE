import lexer from "./lexer/lexer.mjs";

const code = `add() {
  7 * 7;
  n = 1 + 2;
  n == 3;
  n != 4;
}`;

const lexemas = lexer(code);

console.log(code + JSON.stringify(lexemas, null, 2));





