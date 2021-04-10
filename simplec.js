import * as std from "std";

import lexer from "./lexer/lexer.mjs";
import parser from "./parser/parser.mjs";
import simple2cpp from "./transpiler/cpp/simple2cpp.mjs";

/* Parse cli arguments */
const cli = {};
for(let i in scriptArgs) {
  const value = scriptArgs[+i + 1];
  switch (scriptArgs[i]) {
    case "-f":
      cli.file = std.loadFile(value);
    break;
   
    case "-o":
      cli.output = value;
    break;
  }
}

if (!cli.file) {
  console.log("You need to provide -f argument.");
}


const lexemas = lexer(cli.file);
const expressions = parser(lexemas); 
const cpp = simple2cpp(expressions);

if (!cli.output) {
  console.log(cpp);
} else {
  const fd = std.open(`${cli.output}.cpp`, "w+");
  fd.puts(cpp);
  fd.close();
}


