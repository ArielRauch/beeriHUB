//const fs = require('fs');
import * as fs from 'fs'

//const Iconv = require('iconv').Iconv;
//const  iconv = require('iconv-lite');
import iconv from 'iconv-lite';
//const Buffer = require('buffer/').Buffer
import * as Buffer from 'buffer';


let orderFile = "/Users/arielrauch/Documents/Development/Customers/Beeri/beeriHUB/testInput/600038402/700_600038402.txt";


let attributeFile = "./lookupFiles/attributesLookup.csv";
let skuFile = "./lookupFiles/skus.csv";
let pixDefFile = "./lookupFiles/pixDefinitions.csv";
let attributeHash = prepareCSV2Hash(attributeFile,1,3);
//console.log(JSON.stringify(attributeHash));
//return;
let skuHash =  prepareCSV2Hash(skuFile,0,-1);
//console.log(skuHash);
let pixDefHash =  prepareCSV2Hash(pixDefFile,0,-1);
//console.log(pixDefHash);
let content = fs.readFileSync(orderFile);
let original_charset = "iso-8859-8";
let  allFileContents = iconv.decode(content, original_charset.toString());



let orderFileParsed = {};
let currItem = [];
let sku = "NoVal";
let bucketName = "rauch-upload";
let itemNum = 0;
allFileContents.split(/\r?\n/).forEach(line =>  {
  //console.log(line);
  let tags = line.split("\t");
  let tag = tags[0];
  let val = tags[1];
  let currTagObj = {};
  currTagObj[tag] = val;
  currItem.push(currTagObj);
 // console.log(currItem);
  switch(tag) {
    case "M.1":
      currItem = [];
      sku = "NoVal";
      break;
    case "M.1.3":
      let skuInd = val.substring(0,3);
      console.log("skuInd: " + skuInd);
      if (skuInd in skuHash &&  skuHash[skuInd]["Implemented"]) {
        sku = skuHash[skuInd]["SFProduct"];
      }
    //  console.log("SKUIND: " + skuInd);
    //  console.log("SKU: " + sku);
      break;
   case "Z.1":
    //  console.log("Z.1 sku: " + sku)
      if (sku != "NoVal") {
        console.log("index: " + itemNum);
        orderFileParsed[itemNum] = {};
        orderFileParsed[itemNum]["sku"] = sku;
        orderFileParsed[itemNum]["details"] = currItem;
      } 
      itemNum += 1;
      break;
  }

});


//console.log(JSON.stringify(orderFileParsed));
//process.exit();

let siteFlowObj = {};
let params = {};
params["itemNum"] = -1;

for (let itemNo in orderFileParsed) {
  let tags = orderFileParsed[itemNo]["details"];
  let sku = orderFileParsed[itemNo]["sku"];
  params["itemNum"] += 1;
  console.log("params: " + params["itemNum"]);
  let componentID = 0
  let orderID = "";
  let itemID = "";
  for (let i=0;i<tags.length; i++) {
    //let tags = line.split("\t");
    let tag = Object.keys(tags[i])[0];
    let val = tags[i][tag];
    let path = "";
    console.log("tag: " + tag + " val: "+ val);
    switch(tag) {
        //case "M.1.4":
        case "M.1.4":
          console.log("itemNum: " + params["itemNum"])
          siteFlowObj["orderData"]["items"][params["itemNum"]]["sku"] = sku; //skuHash[val]["Implemented"];
          break;
        case "PK.3.1": // pdf name
          let fileName = "order_" + orderID + "_item_" + itemID + ".pdf";
          let fileURL = "http://" + bucketName +".s3.amazonaws.com/" + fileName;
          siteFlowObj["orderData"]["items"][params["itemNum"]]["components"][componentID]["path"] = fileURL; 
          break;        
                          
        case tag.match(/PIXATT/)?.input:
          if (!("components" in  siteFlowObj["orderData"]["items"][params["itemNum"]])) {
            siteFlowObj["orderData"]["items"][params["itemNum"]]["components"] = [];
            siteFlowObj["orderData"]["items"][params["itemNum"]]["components"][componentID]= {}
            siteFlowObj["orderData"]["items"][params["itemNum"]]["components"][componentID]["code"] = sku; 
            siteFlowObj["orderData"]["items"][params["itemNum"]]["components"][componentID]["attributes"] = {};
            //console.log("SiteFlowVal " + val);
            //console.log("SiteFlowAttribute " + JSON.stringify(attributeHash[tag][val]));
          } 
          let attrArr = attributeHash[tag][val];
          for (let i=0;i<attrArr.length;i++) {
            if (attrArr[i]["Implemented"]) siteFlowObj["orderData"]["items"][params["itemNum"]]["components"][componentID]["attributes"][attrArr[i]["SiteFlowAttribute"]] = attrArr[i]["SiteFlowVal"];
          }
        break;
        case "M.2":
           orderID = val;      
        case "HZ.9":
           itemID = val;
       default:
        if (tag in pixDefHash) {
          if (pixDefHash[tag]["path"] && pixDefHash[tag]["path"] != "")
            path = pixDefHash[tag]["path"];
            console.log(path + " value: " + val);
            if (path) {
              siteFlowObj = testVal(siteFlowObj,path,val,params);
              if ("orderData" in siteFlowObj && "items" in siteFlowObj["orderData"]) console.log(JSON.stringify(siteFlowObj["orderData"]["items"]));  
            }
        }
    }
    //console.log(`Line from file: ${tags[0]}`);
    console.log(JSON.stringify(siteFlowObj));
  }
};
const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

console.log(JSON.stringify(siteFlowObj));


function testVal(targetObj,path,val,paramsObj) {
  let components = path.split("/");
  let tag = components.shift();
  //console.log("Working on " + tag);
  //console.log("Working on " + JSON.stringify(targetObj));
  if (components.length > 0) {
    path = components.join("\/");

    if (/^.*\[.*$/.test(tag)) { // array
      let arrayName = tag.match(/(.*)\[.*/)[1];
      //console.log("arrayName: " +arrayName);
      if (!(arrayName in targetObj)) targetObj[arrayName] = [];
      let indexName = tag.match(/.*\{\{(.*)\}\}.*/)[1];
      //console.log("indexName: " + indexName);
      let index = eval("paramsObj['" + indexName + "']");
      if (targetObj[arrayName].length <= index) targetObj[arrayName][index] = {};
      targetObj[arrayName][index] =  testVal(targetObj[arrayName][index],path,val,paramsObj);
    } else {
      if (!(tag in targetObj)) targetObj[tag] = {};
      //console.log(tag + " " + JSON.stringify(targetObj));
      targetObj[tag] =  testVal(targetObj[tag],path,val,paramsObj);
    }

    
  } else {
    if (!(tag in targetObj)) targetObj[tag] = val;
  }
  return targetObj;
}


function assignValue(targetObj,path,val,paramsObj) {
  let components = path.split("\/");
  for (let i=0; i<components.length; i++) {
    let component = components[i];
    if (/^.*\{\{.*$/.test(components[i])) {
      let indexName = components[i].replace(/(.*)\{\{(.*)\}\}/,"$1[paramsObj['$2']]");
      indexVal = eval(indexName);
      console.log("indexName: " + indexName + " indexVal: " + indexVal);
    } else {
    }
//    console.log(/^.*\{\{.*$/.test(components[i]));
  }
 
}

function decode(content) {
  var iconv = new Iconv('ISO-8859-8', 'UTF-8//TRANSLIT//IGNORE');
  var buffer = iconv.convert(content);
  return buffer.toString('utf8');
};


/*
function prepareAttributes(fileName,hashColumn,valueCodeColumn) {
  let lookupContentRAW = fs.readFileSync(fileName);
  //let original_charset = "iso-8859-8";
  let original_charset = "utf-8";
  let  lookupContent= iconv.decode(lookupContentRAW, original_charset.toString());

  let lineNumber = 1;
  let headers = [];
  let lookupObj = {};
  lookupContent.split(/\r?\n/).forEach(line =>  {
    if (lineNumber == 1) {
      headers = line.split(","); 
      console.log("Headers: "+headers[0]);
    } else  {
      if (line.trim() && line.trim() != "") {
        let values = line.split(",");
        let hashColumnValue = values[hashColumn];
        hashColumnValue = hashColumnValue.replace(/"/g, '').trim();
        console.log("HasColumnValue: "+hashColumnValue);
        if (!(hashColumnValue in lookupObj)) {
          console.log("Was not defined");
          lookupObj[hashColumnValue] = {};
        }
        let valueCodeValue = values[valueCodeColumn]; 
        valueCodeValue = valueCodeValue.replace(/"/g, '').trim();
        console.log("valueCodeValue: " + valueCodeValue);
        if (!(valueCodeValue in lookupObj[hashColumnValue])) {
          lookupObj[hashColumnValue][valueCodeValue] = {};
        }
        for (let i=0; i<values.length; i++) {
          lookupObj[hashColumnValue][valueCodeValue][headers[i]] = values[i].replace(/"/g, '').trim();
        }
      }
    }
    lineNumber = lineNumber +  1;
    console.log("We are at line " + lineNumber);
  });
  return lookupObj;

};

*/

function prepareCSV2Hash(fileName,hashColumn,valueCodeColumn) {
  let lookupContentRAW = fs.readFileSync(fileName);
  //let original_charset = "iso-8859-8";
  let original_charset = "utf-8";
  let  lookupContent= iconv.decode(lookupContentRAW, original_charset.toString());

  let lineNumber = 1;
  let headers = [];
  let lookupObj = {};
  lookupContent.split(/\r?\n/).forEach(line =>  {
    if (lineNumber == 1) {
      //trewat header line
      headers = line.split(","); 
      //console.log("Headers: "+headers[0]);
    } else  {
      if (line.trim() && line.trim() != "") {
        let values = line.split(",");
        let hashColumnValue = values[hashColumn];
        hashColumnValue = hashColumnValue.replace(/"/g, '').trim();
        //console.log("HasColumnValue: "+hashColumnValue);
        if (!(hashColumnValue in lookupObj)) {
         // console.log("Was not defined");
          lookupObj[hashColumnValue] = {};
        }
        if (valueCodeColumn > -1) {
          let valueCodeValue = values[valueCodeColumn]; 
          valueCodeValue = valueCodeValue.replace(/"/g, '').trim();
          //console.log("valueCodeValue: " + valueCodeValue);
          if (!(valueCodeValue in lookupObj[hashColumnValue])) {
            lookupObj[hashColumnValue][valueCodeValue] = [];
          }
          let valueCodeObj = {}
          for (let i=0; i<values.length; i++) {
            //lookupObj[hashColumnValue][valueCodeValue][headers[i]] = values[i].replace(/"/g, '').trim();
            valueCodeObj[headers[i]] = values[i].replace(/"/g, '').trim();
          }
          lookupObj[hashColumnValue][valueCodeValue].push(valueCodeObj);
  
        } else {
            for (let i=0; i<values.length; i++) {
              lookupObj[hashColumnValue][headers[i]] = values[i].replace(/"/g, '').trim();
            }
            
        }
      }
    }
    lineNumber = lineNumber +  1;
   // console.log("We are at line " + lineNumber);
  });
  return lookupObj;

};

