// COPYRIGHT OF PATRICK MOORE AND NORTHRIDGE PREP
// Author: Patrick Moore
// Version: 1.1
// Date: 6/28/2019
//
// The below code is a convertion tool developed to aid viewing
// RE-Integration change logs by converting the respective .txt
// file to a .csv.
// Please enter the FULL .txt file name below on line 26.
//
// Example of changelog.txt input:
// 123:
//     { "first": "John, D", "middle": undefined } => { "first": "John", "middle": "D" }
// 456:
//     { "first": "Will", "middle": "S" }
//
// Example of changelog.csv output:
// lookup ID,old "first",old "middle",new "first",new "middle"
// 123,"John, D",undefined,"John","D"
// 456,"Will","S"


// Require application dependencies
var fs = require('fs');
// ENTER FILE NAME BELOW
fileNameFrom = 'exampleChangelog.txt';
// Calculates file output name
fileNameTo = fileNameFrom.substr(0, fileNameFrom.length - 4) + '.csv';
// Opens file to read
fs.readFile(fileNameFrom, (err, fd) => {
  // Checks for failure
  if (err) throw err;
  // Initialize recursive semi-global variables
  var tempVar;
  var entry;
  var i = 0;
  var j = 0;
  var k = 0;
  // Splits the file by line
  var array = fd.toString().split("\n");
  // Finds the first line with full convertion parameters
  while((!array[i].includes("\t")) && (!array[i].includes("=>"))){
    ++i;
  }
  // Sets each parameter of interest at front of string in array
  var params = array[i].split("=>");
  var split0 = params[1].split("{ ");
  var split1 = split0[1].split("\", ");
  // Recursive print to file that forces SYNCHRONOUS runtime
  // Prints the header parameters
  function recursiveHead(label){
    // Extracts variable by array of strings
    var split2 = split1[j].split(": ")
    // Prints to file
    fs.appendFile(fileNameTo, ',' + label + ' ' + split2[0], (err) => {
      // Checks for failure
      if (err) console.log(err);
      console.log('Added Param!\n');
      // Increment
      ++j;
      // Checks for line continue condition
      if(j < split1.length){
        setTimeout(function(){
          recursiveHead(label);
        }, 200);
      }
      return;
    });
  }
  // Initialize file that is being created with first param
  fs.writeFile(fileNameTo, '\"lookup id\"', (err) => {
    // Checks for failure
    if (err) console.log(err);
    console.log('Started new file!\n');
    // Staggered calls to print header forces SYNCHRONOUS runtime
    j = 0;
    recursiveHead('old');
    setTimeout(function(){
      j = 0;
      recursiveHead('new');
    }, 2000);
  });
  // Resets temporary variables
  i = 0;
  j = 0;
  k = 0;
  // Initialize empty array
  var vals = [];
  // Recursive print to file that forces SYNCHRONOUS runtime
  // Prints the parammeter values to each line
  function recursiveParam(){
    // Add to file
    fs.appendFile(fileNameTo, ',' + vals[k], (err) => {
      // Check for failure
      if (err) console.log(err);
      // Increment line parse
      ++k;
      // Check for line end condition
      if(k == params.length - 1){
        // Check for file continue condition
        if(i < array.length){
          // Increment file parse
          ++i;
          // Next line
          recursiveArray();
          return;
        }
      } else {
        // Next value
        recursiveParam();
        return;
      }
    });
  }
  // Recursive print to file that forces SYNCHRONOUS runtime
  // Determines how to interpret line of data
  function recursiveArray(){
    // ensures that line/array entry is not empty
    if(array[i] == undefined){
      return;
    } else if(array[i][0] == '\t'){
      // Determines that it is a data line
      // Removes tab
      entry = array[i].toString().substr(1, array[i].length);
      // Splits string for parsing
      params = entry.split(": ");
      j = 1;
      // Finds all values to print via split sting method
      while( j < params.length ){
        if(params[j].charAt(0) == '\"'){
          // Checks if value is in quotes
          vals[j - 1] = params[j].substr(0, params[j].substr(1, params[j].length).indexOf('\"') + 2)
        } else {
          // Value is undefined
          vals[j - 1] = params[j].substr(0, params[j].indexOf(' '));
          // Removes comma from value if not last parameter
          if(vals[j - 1].includes(',')){
            vals[j - 1] = vals[j - 1].substr(0, vals[j - 1].length - 1);
          }
        }
        // Increment value parser
        ++j;
      }
      // Resets temp variable
      k = 0;
      // Prints to file all parameters recursively
      recursiveParam();
      return;
    } else {
      // Determines that it is a ID line and prints to file
      fs.appendFile(fileNameTo, '\n' + array[i].substr(0, (array[i].length - 1)), (err) => {
        // Checks for failure
        if (err) console.log(err);
        console.log('Started new line! ' + i + '\n');
        // Checks continue condition
        if(i < array.length){
          // Increment file parse
          ++i;
          // Next Line
          recursiveArray();
          return;
        }
      });
    }
  }
  // Begins operation after headers are set
  setTimeout(function(){
    // Initial call to recursiveArray
    recursiveArray();
  }, 5000);
});
