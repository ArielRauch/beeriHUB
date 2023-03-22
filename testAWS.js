import * as s3 from "./libs/s3_upload_object.js";
import * as http from "./libs/httpRequests.js";
import * as sf from "./libs/siteflow.js";
import crypto from 'crypto';
import CryptoJS from 'crypto-js';
//import hmacSHA512 from 'crypto-js/hmac-sha512';
//import Base64 from 'crypto-js/enc-base64';





let key = "1007054639462";
let secret = "ce39f5ac2eaadbbfad8128b1cf29e7e3b3d8084254f45d41";
let endpoint = "/api/order";
let headers = createHeaders("POST", endpoint );
headers['Content-Type']= 'application/json';

console.log(headers);
//process.exit();


let body = {
    "destination": {
      "name": "hp.elinirdigital"
    },
    "orderData": {
      "sourceOrderId": "600066685",
      "customerName": "אבי לוי",
      "items": [
        {
          "sku": "Business Cards",
          "quantity": 200,
          "sourceItemId": "947",
          "components": [
            {
              "code": "card",
              "fetch": true,
              "path": "https://www.docdroid.net/file/download/iyQEaqx/1-pdf.pdf",
              "infotech": true,
              "infotechCopies": 1,
              "infotechPadding": 1,
              "infotechExternal": true,
              "infotechImpose": false,
              "infotechTemplateId": "634821be74f5470008deba42",
              "attributes": {
                "lamination": "gloss",
                "roundCorners": "false",
                "substrate": "uncoated",
                "sides": "duplex",
                "assetSize": "90x50",
                "orientation": "landscape",
                "urgency": "Standard",
                "color": "CMYK"
              }
            }
          ]
        },
        {
          "sku": "Business Cards",
          "quantity": 200,
          "sourceItemId": "75",
          "components": [
            {
              "code": "card",
              "fetch": true,
              "path": "https://www.docdroid.net/file/download/tYagaUq/2-pdf.pdf",
              "infotech": true,
              "infotechCopies": 1,
              "infotechPadding": 1,
              "infotechExternal": true,
              "infotechImpose": false,
              "attributes": {
                "lamination": "gloss",
                "roundCorners": "false",
                "substrate": "uncoated",
                "sides": "duplex",
                "assetSize": "90x50",
                "orientation": "landscape",
                "urgency": "Standard",
                "color": "CMYK"
              }
            }
          ]
        }
      ],
      "shipments": [
        {
          "shipTo": {
            "name": "אבי לוי",
            "companyName": "קוקה קולה",
            "address1": "1234 Main St.",
            "town": "באר שבע",
            "postcode": "12345",
            "isoCountry": "IL"
          },
          "carrier": {
            "code": "customer",
            "service": "shipping"
          }
        }
      ]
    }
  };


//let resp = sf.createOrder(body);
//console.log(JSON.stringify(resp));


let url = "https://orders.oneflow.io/api/order";
let aaa = await http.post(headers,body,url);
console.log(aaa);




//postman.setEnvironmentVariable("hmacHeader", headers[0]);
//postman.setEnvironmentVariable("timestamp", headers[1]);

function createHeadersA(method, path) {
    let key = "1007054639462";
    let timestamp = (new Date()).toISOString();
    let secret = "ce39f5ac2eaadbbfad8128b1cf29e7e3b3d8084254f45d41";
    
    let toSign = method.toUpperCase() + " " + path + " " + timestamp;

    let hash = crypto.createHmac("SHA1", secret);
    hash.update(toSign);
    let sig = hash.digest("hex");

  //  let hash = CryptoJS.createHmac(toSign, secret);
  //  let sig = CryptoJS.enc.Hex.stringify(hash);
  var headers ={
    "x-oneflow-authorization": key + ":" + sig,
    "x-oneflow-date": timestamp,
    "x-oneflow-algorithm": "SHA1"
};
    return headers;
}

function createHeaders(method, path) {
    let key = "1007054639462";
    let secret = "ce39f5ac2eaadbbfad8128b1cf29e7e3b3d8084254f45d41";
  
    var timestamp = (new Date()).toISOString();
    
    var toSign = method.toUpperCase() + " " + path + " " + timestamp;
    var hash = CryptoJS.HmacSHA1(toSign, secret);
    var sig = CryptoJS.enc.Hex.stringify(hash);
    var headers ={
        "x-oneflow-authorization": key + ":" + sig,
        "x-oneflow-date": timestamp,
        "x-oneflow-algorithm": "SHA1"
    };
    return headers;

}
//s3.uploadFile("rauch-upload","order_60554_item_001.pdf","/Users/arielrauch/Documents/Development/Customers/Beeri/beeriHUB/testInput/600038451/item_60834/prod_152_1623612041_71.pdf");
