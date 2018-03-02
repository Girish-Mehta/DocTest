const path = require('path');
const fs = require('fs');
const natural = require('natural');
const WordPOS = require('wordpos'),
  wordpos = new WordPOS();
const tokenizer = new natural.WordTokenizer();
const stringSimilarity = require('string-similarity');
var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';

var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);

var baseFileAddress = "Learning-HTML-CSS-and-Bootstrap-4-in-an-hour.txt";
var tarFileAddress = "HTML_Basics.txt";
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
  status: "",
  points: 0,
  similarity: 0,
  remarks: "",
};

let oupt=[baseFile, tarFile, result];

let data = {output:oupt};

function start(){
  fileReadPromise(baseFileAddress,"base");

  fileReadPromise(tarFileAddress,"target");

  conclude();
}

// start reading the file
function fileReadPromise(address, owner) {
  var text = fs.readFileSync(address,"utf8");
  var ext = path.extname(address);
  var fname = path.basename(address, ext);
  if(owner == "base"){
    baseFile.ext = ext;
    baseFile.name = fname;
  } else if(owner == "target"){
    tarFile.ext = ext;
    tarFile.name = fname;
  }

  // split words into array
  tokenText = tokenizer.tokenize(text);

  // get tagger pairs from array
  var taggerJSON=tagger.tag(tokenText);

  // save text for global function use
  switch(owner){
    case "base":baseText = text;
                baseFile.wordCount = tokenText.length;
                for(var pair of taggerJSON){
                  if(pair[1] == "NN" || pair[1] == "NNP" || pair[1] == "NNPS"){
                    baseFile.nounCount++;
                  } else if(pair[1] == "VB" || pair[1] == "VBD" || pair[1] == "VBG" || pair[1] == "VBN" || pair[1] == "VBP" || pair[1] == "VBZ"){
                    baseFile.verbCount++;
                  } else if(pair[1] == "JJ" || pair[1] == "JJR" || pair[1] == "JJS"){
                    baseFile.adjCount++;
                  }
                }
                break;
    case "target":targetText = text;
              tarFile.wordCount = tokenText.length;
              for(var pair of taggerJSON){
                if(pair[1] == "NN" || pair[1] == "NNP" || pair[1] == "NNPS"){
                  tarFile.nounCount++;
                } else if(pair[1] == "VB" || pair[1] == "VBD" || pair[1] == "VBG" || pair[1] == "VBN" || pair[1] == "VBP" || pair[1] == "VBZ"){
                  tarFile.verbCount++;
                } else if(pair[1] == "JJ" || pair[1] == "JJR" || pair[1] == "JJS"){
                  tarFile.adjCount++;
                }
              }
              break;
  }
}


//function to collect output
function conclude(){

  console.log(baseFile);
  console.log(tarFile);

  // label of max points
  var points = 100;
  // reject file if the number of words are not within specific range
  if(tarFile.wordCount < 1500 || tarFile.wordCount > 4100){
    result.status = "Rejected";
    result.remarks="Document is not of sufficient words and therefore rejected";
  } else{
    result.status = "Accepted";
    // compare both text and find the similarity
    var similarity = stringSimilarity.compareTwoStrings(baseText, targetText);
    console.log("\nSimilarity: "+(similarity*100)+" %");
    result.similarity = similarity*100;
      // calculate points for nouns
        var baseVal = (5/100)*nounLenBase;
        if(!((nounLenTar <= (nounLenBase+baseVal)) && (nounLenTar >= (nounLenBase-baseVal)))){
          if(nounLenTar >= (nounLenBase-baseVal))
            points -= (nounLenBase-nounLenTar);
          else {
              points += (nounLenBase-nounLenTar);
            }
        }

      // calculate points for adjectives
        baseVal = (5/100)*adjLenBase;
        if(!((adjLenTar <= (adjLenBase+baseVal)) && (adjLenTar >= (adjLenBase-baseVal)))){
          if(adjLenTar >= (adjLenBase-baseVal)){
            points -= (adjLenBase-adjLenTar);
          }
          else{
            points += (adjLenBase-adjLenTar);
          }
        }

      // calculate points for verbs
        baseVal = (5/100)*verbLenBase;
        if(!((verbLenTar < (verbLenBase+baseVal)) && (verbLenTar > (verbLenBase-baseVal)))){
          if(verbLenTar > (verbLenBase-baseVal))
            points += (verbLenBase-verbLenTar);
          else
            points -= (verbLenBase-verbLenTar);
        }

        console.log("Points: "+(points+similarity*100)/4);
	result.points = (points+similarity*100)/4
        // give remarks based on points calculated
        if(((points+similarity*100)/4) > 75 && ((points+similarity*100)/4) < 100){
          result.remarks="Document seems good";
        } else if(((points+similarity*100)/4) < 75){
            result.remarks="You can write a better document";
        } else {
            result.remarks="Document seems to be good but requires some updations to be made";
        }
  }
  console.log(result);
  // data.map(data=> {
  //
  // });
  let json = JSON.stringify(data,null,2);
  fs.writeFile('data.json',json,'utf8',(err) => {
    if(err){
      console.log("error");
    }
    console.log("done");
  })
}


// start the program
(()=>{
  console.log("Program Started");
  console.log("-----------Stats-----------");
  start();
})();
