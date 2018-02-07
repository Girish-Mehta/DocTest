const path = require('path');
const fs = require('fs');
var textract = require('textract');
var count = require('word-count');
var natural = require('natural');
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
var stringSimilarity = require('string-similarity');
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

// start the program
console.log("Program Started");
console.log("\n\nReading Base File");
console.log("-----------Stats-----------");

// print file name and extension of base file
var ext = path.extname('Learning-HTML-CSS-and-Grid-960-in-an-hour.docx');
var fname = path.basename('Learning-HTML-CSS-and-Grid-960-in-an-hour.docx', ext);
console.log("File Name: "+fname+"\nFile Ext: "+ext);

// start reading the file
textract.fromFileWithPath('./Learning-HTML-CSS-and-Grid-960-in-an-hour.docx', {preserveLineBreaks:true},function( error, text ) {
  if(error) {
      console.log("\nCannot work with Base File");
  } else {
    // save text for global function use
    baseText = text;
    // count words in file
    wordCountBase = count(text);
    // get count of nouns in file
    getNouns(text,"base");
    // get count of verbs in file
    getVerbs(text,"base");
    // get count of adjectives in file
    getAdj(text,"base");
    console.log("\nCompleted scanning base file");
  }
})


console.log("\n\nReading Target File");
console.log("-----------Stats-----------");

// print file name and extension of targer file
var ext = path.extname('html.docx');
var fname = path.basename('html.docx', ext);
console.log("File Name: "+fname+"\nFile Ext: "+ext);

// start reading file
textract.fromFileWithPath('./html.docx', {preserveLineBreaks:true},function( error, text ) {
  if(error) {
      console.log("\nCannot work with Target File");
  } else {
    // save text for global function use
    targetText = text;
    // count words in file
    wordCountTar = count(text);
    // get count of nouns in file
    getNouns(text,"target");
    // get count of verbs in file
    getVerbs(text,"target");
    // get count of adjectives in file
    getAdj(text,"target");
    console.log("\nCompleted scanning Target file");
    conclude();
  }
});

function conclude(){
  // label of max points
  var points = 300;
  // reject file if the number of words are not within specific range
  if(wordCountTar < 1500 || wordCountTar > 4100){
    console.log("Document is not of sufficient words and therefore rejected. \nProgram exited");
  } else{
    // compare both text and find the similarity
    var similarity = stringSimilarity.compareTwoStrings(baseText, targetText);
    console.log("\nSimilarity: "+(similarity*100)+" %");
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
}

// function to calculate the number of nouns in a text
function getNouns(text, type) {
  if(type == "base"){
    wordpos.getNouns(text,function(result){
      nounLenBase = result.length;
    });
  } else if(type == "target"){
    wordpos.getNouns(text,function(result){
      nounLenTar = result.length;
    });
  }
}

// function to calculate the number of verbs in a text
function getVerbs(text, type) {
  if(type == "base"){
    wordpos.getVerbs(text, function(result){
      verbLenBase = result.length;
    });
  } else if(type == "target"){
    wordpos.getVerbs(text, function(result){
      verbLenTar = result.length;
    });
  }
}

// function to calculate the number of adjectives in a text
function getAdj(text, type) {
  if(type == "base"){
    wordpos.getAdjectives(text, function(result){
      adjLenBase = result.length;
    });
  } else if(type == "target"){
    wordpos.getAdjectives(text, function(result){
      adjLenTar = result.length;
    });
  }
}
