import * as s3 from "./libs/s3_upload_object.js";
import * as http from "./libs/httpRequests.js";
import * as sf from "./libs/siteflow.js";
import crypto from 'crypto';
import CryptoJS from 'crypto-js';


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


let resp = await sf.createOrder(body);
console.log(JSON.stringify(resp));
