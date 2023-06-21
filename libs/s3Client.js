// Create service client module using ES6 syntax.
import { S3Client } from "@aws-sdk/client-s3";
// Set the AWS Region.
const REGION = "eu-west-1";
/*const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};
*/
//console.log("CRED: " + JSON.stringify(credentials));
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION,credentials, });
export { s3Client };