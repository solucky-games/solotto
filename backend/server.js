
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log('here');
    res.status(200).send('Hi');
});

app.listen(3000);