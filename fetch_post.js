const https = require('https');

https.get('https://admin.nugrahalabib.com/items/posts?limit=1', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print it out.
    resp.on('end', () => {
        console.log(JSON.stringify(JSON.parse(data), null, 2));
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
