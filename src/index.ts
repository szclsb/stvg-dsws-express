import express from "express";

const port = 8080;
const app = express();

app.get('/', (req, res) => res.send('hello world'));

const server = app.listen(port, () => {
    console.log( `server started at http://localhost:${ port }` );
});

