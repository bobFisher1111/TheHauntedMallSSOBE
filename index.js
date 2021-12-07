/*
    - This will be the Express Server:
        - fill in with notes later
*/
const express = require('express'); // getting express
const app = express(); // initialize express

// creating a get request
app.get('/hello', (req, res) => {
    res.send('hello turtle!....')
})

// start the server on port
app.listen(1337, () => {
    console.log('Server started on port 1337');
})


https://www.youtube.com/watch?v=Ejg7es3ba2k