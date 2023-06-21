// Import required AWS SDK clients and commands for Node.js.
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";

//import { s3Client } from "./s3Client.js"; // Helper function that creates an Amazon S3 service client module.
import * as path from 'path'
import * as fs from 'fs'
//const file = "/Users/arielrauch/Documents/Development/Customers/Beeri/beeriHUB/testInput/600038451/item_60834/prod_152_1623612041_71.pdf"; // Path to and name of object. For example '../myFiles/index.js'.
//const fileStream = fs.createReadStream(file);
//console.log(path.basename(file));
// Set the parameters

export const uploadFile = (bucketName,fileName,filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const REGION = "eu-west-1";
  const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  };
  const uploadPRMS = {
      Bucket: bucketName,
      // Add the required 'Key' parameter using the 'path' module.
      Key: fileName,
      // Add the required 'Body' parameter
      Body: fileStream,
  };
  run(REGION,credentials,uploadPRMS);
}


// Upload file to specified bucket.
  const REGION = "eu-west-1";
  export const run = async (REGION,credentials,def) => {
    try {
      console.log("CRED: " + JSON.stringify(credentials));
      const s3Client = new S3Client({ region: REGION,credentials, });

      const data = await s3Client.send(new PutObjectCommand(def));
      console.log("Success", data);
      return data; // For unit tests.
    } catch (err) {
      console.log("runError: ", err);
    }
  };
  /*
  export const uploadParams = {
  Bucket: "rauch-upload",
  // Add the required 'Key' parameter using the 'path' module.
  Key: path.basename(file),
  // Add the required 'Body' parameter
  Body: fileStream,
};

  export  const s3Upload = async () => {
    try {
      const data = await s3Client.send(new PutObjectCommand(uploadParams));
      console.log("Success", data);
      return data; // For unit tests.
    } catch (err) {
      console.log("Error", err);
    }
  };*/