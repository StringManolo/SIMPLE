# SIMPLE
SIMPLE is a new general purpouse programming language.  
  
Under development.  


SIMPLE is created to be easy to use and easily transpilable to other languages.

The main idea is to write the code in SIMPLE programming language and use the source to source compiler to generate the equivalent code in C++, javascript (node, qjs and browser), python, lua, java ...  

### SIMPLE FRAMEWORK:  
SIMPLE framework is a set of javascript cli tools that make possible to use the language:
+ lexer/lexer.mjs  
ES6 module exporting a function to convert raw code into tokens and language structures.  
lexer.mjs is designed to a more general purpouse like sintax highlighting.  

+ parser/parser.mjs  
ES6 module exporting a function to organice the lexemas into expressions.  

+ transpiler/cpp/simple2cpp.js  
ES6 module exporting a function to generate c++ code from SIMPLE expressions.  

### SIMPLE LANGUAGE:  
SIMPLE is a functional programming language where everything is a function or a function call.  



