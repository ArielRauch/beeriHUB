import CryptoJS from 'crypto-js';
import * as http from "./httpRequests.js";

const key = "1007054639462";
const secret = "ce39f5ac2eaadbbfad8128b1cf29e7e3b3d8084254f45d41";

const sfEndpoints = {"createOrder": "/api/order"};
const baseURL =  "https://orders.oneflow.io";

export const createOrder = async(orderObj) => {
    let endpoint = sfEndpoints["createOrder"];
    let headers = createHeaders("POST",endpoint) ;
    headers['Content-Type']= "application/json";
    let url = baseURL + endpoint;
    console.log(url);
    let resp = await http.post(headers,orderObj,url);
    return resp;
};

function createHeaders(method, path) { 
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