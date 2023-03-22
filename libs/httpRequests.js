import fetch from 'node-fetch';

export const post = async(headers,body,url) => {

    console.log(headers);
    const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: headers
    });
    const data = await response.json();

    console.log(data);
    return data;
}






