const path = require('path');
const fs = require('fs');
const textract = require('textract');
const count = require('word-count');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const WordPOS = require('wordpos'),
    wordpos = new WordPOS();
const stringSimilarity = require('string-similarity');

var baseFileAddress = "Learning-HTML-CSS-and-Bootstrap-4-in-an-hour.docx";
var tarFileAddress = "Learning-HTML-CSS-and-Grid-960-in-an-hour.docx";
var baseText;
var targetText;
var wordCountBase = 0;
var nounLenBase = 0;
var adjLenBase = 0;
var verbLenBase = 0;
var wordCountTar = 0;
var nounLenTar = 0;
var adjLenTar = 0;
var verbLenTar = 0;
var isReady = false;
var taskCount = 0;
var status = 0;

var baseFile = {
  name:"",
  ext: "",
  wordCount: 0,
  nounCount: 0,
  verbCount: 0,
  adjCount: 0,
};

var tarFile = {
  name:"",
  ext: "",
  wordCount: 0,
  nounCount: 0,
  verbCount: 0,
  adjCount: 0,
};


var result = {
  similarity: 0,
  spellMistakeCount: 0,
}

function start(){
  fileReadPromise(baseFileAddress,"base").then((message) => {
    console.log(message);
    completed();
  })
  .catch((message) => {
    console.log(message);
  });

  fileReadPromise(tarFileAddress,"target").then((message) => {
    console.log(message);
    completed();
  })
  .catch((message) => {
    console.log(message);
  });
}

function completed() {
  status++;
  if(status == 2)
    conclude();
}


// start reading the file
function fileReadPromise(address, owner) {
  var checkCount = 0;

  return new Promise(function(resolve,reject){
    textract.fromFileWithPath(address, {preserveLineBreaks:true},function( error, text ) {
      function check(){
        checkCount++;
        if(checkCount % 3 == 0)
          resolve("Completed scanning file: \'"+fname+ext+"\'")
      }

      var ext = path.extname(address);
      var fname = path.basename(address, ext);
      if(owner == "base"){
        baseFile.ext = ext;
        baseFile.name = fname;
      } else if(owner == "target"){
        tarFile.ext = ext;
        tarFile.name = fname;
      }

      if(error) {
          reject("\nCannot work with File: "+fname+ext);
      } else {
        // split words into array
        tokenText = tokenizer.tokenize(text);

        // save text for global function use
        switch(owner){
          case "base":baseText = text;
                      baseFile.wordCount = tokenText.length;
          // wordCountBase = tokenText.length;
                      wordpos.getNouns(text,function(result){
                        baseFile.nounCount = result.length;
                        check();
                      });
                      wordpos.getAdjectives(text, function(result){
                        baseFile.adjCount = result.length;
                        check();
                      });
                      wordpos.getVerbs(text, function(result){
                        baseFile.verbCount = result.length;
                        check();
                      });
                      break;
          case "target":targetText = text;
                      // wordCountTar = tokenText.length;
                      tarFile.wordCount = tokenText.length;
                      wordpos.getNouns(text,function(result){
                        tarFile.nounCount = result.length;
                        check();
                      });
                      wordpos.getAdjectives(text, function(result){
                        tarFile.adjCount = result.length;
                        check();
                      });
                      wordpos.getVerbs(text, function(result){
                        tarFile.verbCount = result.length;
                        check();
                      });
                      break;
          }
        }
    })
  })
}


//function to collect output
function conclude(){

  console.log(baseFile);
  console.log(tarFile);

  //display word count
  console.log("\n"+wordCountTar);
  console.log(wordCountBase);


  // label of max points
  var points = 300;
  // reject file if the number of words are not within specific range
  if(tarFile.wordCount < 1500 || tarFile.wordCount > 4100){
    console.log("Document is not of sufficient words and therefore rejected. \nProgram exited");
  } else{
    // compare both text and find the similarity
    var similarity = stringSimilarity.compareTwoStrings(baseText, targetText);
    console.log("\nSimilarity: "+(similarity*100)+" %");
    result.similarity = similarity*100;
    if(similarity*100 <= 64 || similarity*100 >= 76){
      if(similarity*100 <= 64){
        console.log("Document Rejected as it does not have 100% relevant content");
      } else if(similarity*100 >= 76){
        console.log("Document rejected as too much of same content in the documents");
      }
    } else{
      // calculate points for nouns
        var baseVal = (5/100)*nounLenBase;
        if(!((nounLenTar <= (nounLenBase+baseVal)) && (nounLenTar >= (nounLenBase-baseVal)))){
          points += (nounLenBase-nounLenTar);
        }

      // calculate points for adjectives
        baseVal = (5/100)*adjLenBase;
        if(!((adjLenTar < (adjLenBase+baseVal)) && (adjLenTar > (adjLenBase-baseVal)))){
          points += (adjLenBase-adjLenTar);
        }

      // calculate points for verbs
        baseVal = (5/100)*verbLenBase;
        if(!((verbLenTar < (verbLenBase+baseVal)) && (verbLenTar > (verbLenBase-baseVal)))){
          points += (verbLenBase-verbLenTar);
        }

        console.log("Points(Out of 300): "+(points+similarity*100)/4);
        // give remarks based on points calculated
        if(((points+similarity*100)/4) < 250 || ((points+similarity*100)/4) > 300){
          console.log("Remarks: You can write a better document");
        } else{
          if(((points+similarity*100)/4) > 275){
            console.log("Remarks: Document seems good");
          } else if(((points+similarity*100)/4) < 275){
            console.log("Remarks: Document seems to be good but requires some updations to be made");
          }
        }
    }
  }
  console.log(result);
}


// start the program
(()=>{
  console.log("Program Started");
  console.log("-----------Stats-----------");
  start();
})();
