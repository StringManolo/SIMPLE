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
  const out = `struct Console {

template <typename ...Ts>
static void log(Ts&&... ts) {
  (do_log(ts), ...);
  cout << "\\n";
}

template <typename T>
static void do_log(const T& arg) {
  std::cout << arg;
}

template <typename T>
static void do_log(const std::vector<T>& v) {
  cout << '{';
  const char* sep = "";
  for (const auto& e : v) {
    cout << sep;
    do_log(e);
    sep = ", ";
  }
  cout << '}';
}

/* here */
template <typename T>
static bool try_log_any(const std::any& arg) {
    if (auto* p = std::any_cast<T>(&arg)) {
        do_log(*p);
        return true;
    }
    return false;
}

template <typename... Ts>
static bool try_log_any_from(const std::any& arg) {
    if ((try_log_any<Ts>(arg) || ...)) {
        return true;
    }

    auto t = arg;
    try {
        std::any_cast<std::string>(t);
        std::cout /* ANY */<< std::any_cast<std::string>(t) << std::endl;
      } catch (const std::bad_any_cast& a) {
        //std::cout << a.what() << '\\n';
        try {
          std::any_cast<int>(t);
          std::cout /* ANY */<< std::any_cast<int>(t) << std::endl;
        } catch (const std::bad_any_cast& b) {
          try {
            std::any_cast<bool>(t);
            std::cout /* ANY */<< std::any_cast<bool>(t) << std::endl;
          } catch (const std::bad_any_cast& c) {
            try {
              std::any_cast<short int>(t);
              std::cout /* ANY */<< std::any_cast<short int>(t) << std::endl;
            } catch (const std::bad_any_cast& d) {
              try {
                std::any_cast<unsigned short int>(t);
                std::cout /* ANY */<< std::any_cast<unsigned short int>(t) << std::endl;
              } catch (const std::bad_any_cast& e) {
                try {
                  std::any_cast<unsigned int>(t);
                  std::cout /* ANY */<< std::any_cast<unsigned int>(t) << std::endl;
                } catch (const std::bad_any_cast& f) {
                  try {
                    std::any_cast<long int>(t);
                    std::cout /* ANY */<< std::any_cast<long int>(t) << std::endl;
                  } catch (const std::bad_any_cast& g) {
                    try {
                      std::any_cast<unsigned long int>(t);
                      std::cout /* ANY */<< std::any_cast<unsigned long int>(t) << std::endl;
                    } catch (const std::bad_any_cast& h) {
                      try {
                        std::any_cast<long long int>(t);;
                        std::cout /* ANY */<< std::any_cast<long long int>(t) << std::endl;
                      } catch (const std::bad_any_cast& i) {
                        try {
                          std::any_cast<unsigned long long int>(t);
                          std::cout /* ANY */<< std::any_cast<unsigned long long int>(t) << std::endl;
                        } catch (const std::bad_any_cast& j) {
                          try {
                            std::any_cast<float>(t);
                            std::cout /* ANY */<< std::any_cast<float>(t) << std::endl;
                          } catch (const std::bad_any_cast& k) {
                            try {
                              std::any_cast<double>(t);
                              std::cout /* ANY */<< std::any_cast<double>(t) << std::endl;
                            } catch (const std::bad_any_cast& l) {
                              try {
                                std::any_cast<char>(t);
                                std::cout /* ANY */<< std::any_cast<char>(t) << std::endl;
                              } catch (const std::bad_any_cast& m) {
                                try {
                                  std::any_cast<unsigned char>(t);
                                  std::cout /* ANY */<< std::any_cast<unsigned char>(t) << std::endl;
                                } catch (const std::bad_any_cast& n) {
                                  try {
                                    std::any_cast<wchar_t>(t);
                                    std::cout /* ANY */<< std::any_cast<wchar_t>(t) << std::endl;
                                  } catch (const std::bad_any_cast& o) {
                                    try {
                                      std::any_cast<const char*>(t);
                                      std::cout /* ANY */<< std::any_cast<const char*>(t) << std::endl;

                                    } catch (const std::bad_any_cast& p) {
                                      std::cout << a.what() << '\\n';
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    return false;
}

static void do_log(const std::any& arg) {
    try_log_any_from<std::string, int, unsigned, char, float, double /*..*/>(arg);
}
};

Console console;`;

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
          expression[i].value = `any ${expression[i].value}`;
          addInclude("any");
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
          expression[i].value = `any ${expression[i].value}`;
          addInclude("any");
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
      if (expression[i].type === "id") {
/* KEYWORDS console.log(`The id is: ${expression[i].value}`); */
        switch (expression[i].value) {
          case "out":
            expression[i].value = "console.log";
            globals += `\n${out}\n\n`;
            addInclude("iostream");
            addInclude("vector");
            addInclude("string");
            addInclude("any");
          break;
        }
      }

      actualExpr += expression[i].value + " ";
    }

    if (functionCtx) {

      for (let i in expression) {
        if (expression[i].type === "argument") {
          if (functions[functions.length - 1].args) {
            functions[functions.length - 1].args.push(`any ${expression[i].value}`);
          } else {
            functions[functions.length - 1].args = [ `any ${expression[i].value}` ];
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


