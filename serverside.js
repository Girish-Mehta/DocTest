const path = require('path');
const fs = require('fs');
var textract = require('textract');
var count = require('word-count');
var natural = require('natural');
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
var verbLentar = 0;
var isReady = false;

console.log("Program Started");
console.log("Reading Base File");
console.log("-----------Stats-----------");
var ext = path.extname('Learning-HTML-CSS-and-Bootstrap-4-in-an-hour.docx');
var fname = path.basename('Learning-HTML-CSS-and-Bootstrap-4-in-an-hour.docx', ext);
console.log("File Name: "+fname+"\nFile Ext: "+ext);

textract.fromFileWithPath('./Learning-HTML-CSS-and-Bootstrap-4-in-an-hour.docx', {preserveLineBreaks:true},function( error, text ) {
  if(error) {
      console.log("Cannot work with Base File");
  } else {
    // console.log(text);
    wordCountBase = count(text);
    // console.log("Word Count: "+wordCount);
    wordpos.getNouns(text,function(result){
      nounLenBase = result.length;
    });
		wordpos.getVerbs(text, function(result){
      verbLenBase = result.length;
    });
		wordpos.getAdjectives(text, function(result){
      adjLenBase = result.length;
      // nounPerc();
      // adjPerc();
      // verbPerc();
      console.log("Completed scanning base file");
    });
    baseText = text;
  }
})
// console.log("Working...");


console.log("Reading Target File");
console.log("-----------Stats-----------");
var ext = path.extname('Learning-HTML-CSS-and-Bootstrap-4-in-an-hour.docx');
var fname = path.basename('Learning-HTML-CSS-and-Bootstrap-4-in-an-hour.docx', ext);
console.log("File Name: "+fname+"\nFile Ext: "+ext);

textract.fromFileWithPath('./HTML_Basics.docx', {preserveLineBreaks:true},function( error, text ) {
  if(error) {
      console.log("Cannot work with Target File");
  } else {
    wordCount = count(text);
    wordpos.getNouns(text,function(result){
      nounLenTar = result.length;
    });
		wordpos.getVerbs(text, function(result){
      verbLenTar = result.length;
    });
		wordpos.getAdjectives(text, function(result){
      adjLenTar = result.length;
      console.log("Completed scanning Target file");
      var similarity = stringSimilarity.compareTwoStrings(baseText, targetText);
      console.log("similarity: "+similarity+" %");
    });

    targetText = text;
  }
})
// console.log("Working...");


// function conclude(){
//     var similarity = stringSimilarity.compareTwoStrings(baseText, targetText);
//     console.log(similarity);
// }






// var fs = require('fs');
// var natural = require('natural');
// var path = require('path');
// var textract = require('textract');
// var stringSimilarity = require('string-similarity');
// var WordPOS = require('wordpos'),
//     wordpos = new WordPOS();
// //var string;
// //console.log(content);
// var bestDoc = fs.readFileSync('html-tags.txt','utf8');
//
// var address = '/home/sapient/Desktop/HTML_Basics.docx';
// var wordcount;
// var abc = path.basename(address);
// var fname = abc.split('.');
// var fext = path.extname(address);
// console.log("Filename : "+fname[0]);
// console.log("FileExtension : "+fext);
//
// textract.fromFileWithPath(address,{preserveLineBreaks:true}, function( error, text ) {
// 	if(error)
// 		console.log(error);
// 	else{
// 		//console.log(text);
// 		wordcount = text.match(/\w+/g).length;
// 		console.log("Wordcount : " +wordcount);
// 		if(wordcount>=1500 && wordcount<=4000){
// 		wordpos.getNouns(text, getNouns);
// 		wordpos.getVerbs(text, getVerbs);
// 		wordpos.getAdjectives(text, getAdjectives);
// 		var similarity = stringSimilarity.compareTwoStrings(bestDoc,text);
// 		console.log(similarity);
// 		}
// 		else{
// 			console.log("Document rejected as wordcount not under permissible limits.");
// 			console.log("Permissible limit : [1500-3000]");
// 		}
// 	}
//
// })
//
// function getNouns(result)
// {
// 	var NounPerc = (result.length/wordcount) * 500;
// 	console.log("NounCount : "+NounPerc +"%");
// }
//
// function getVerbs(result)
// {
// 	var VerbPerc = (result.length/wordcount) * 500;
// 	console.log("VerbCount : "+VerbPerc +"%");
// }
//
// function getAdjectives(result)
// {
// 	var AdjectivePerc = (result.length/wordcount) * 500;
// 	console.log("AdjectiveCount : "+AdjectivePerc +"%");
// }
//

// function nounPerc(){
//   	var nounPerc = (nounLen/wordCount) * 500;
//   	console.log("Noun Count : "+nounPerc +" %");
// }
//
// function adjPerc(){
//   	var adjPerc = (adjLen/wordCount) * 500;
//   	console.log("Adjective Count : "+adjPerc +" %");
// }
//
// function verbPerc(){
//   	var verbPerc = (verbLen/wordCount) * 500;
//   	console.log("Verb Count : "+verbPerc +" %");
// }


// var cont = tokenizer.tokenize("contenttext")
// textract.fromFileWithPath('./en-US.dic', {preserveLineBreaks:true},function( error, text ) {
//   if(error) {
//       console.log("error");
//   } else {
//       var spellcheck = new natural.Spellcheck(text);
//       console.log(spellcheck.isCorrect(cont));
//   }
// })
