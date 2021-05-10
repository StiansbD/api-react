const express = require('express');
const app = express();
const mysql = require('mysql');
const config = require('./config.json');
const db = mysql.createConnection({
    host: config[0].host,
    user: config[0].user,
    password: config[0].password,
    database: config[0].database
});
const cors = require('cors');

app.use(cors());

db.connect(function(err) {
    if (err) throw err;
    console.log("connected !");
});

function MakeQuery(sql) {
    return new Promise((resolve, reject) => {
        db.query(sql, function(err, res, fields) {
            if (err) reject(err);
            resolve(res);
        });
    });
}

// middleware
app.use(express.json());

// get *
app.get('/api', (req, res) => {
    MakeQuery("SELECT * FROM `unit`").then(
        function(val) {
            res.status(200).json(val);
        }
    ).catch(
        function(err) {
            throw err;
        }
    );
});

// get id
app.get('/api/:id', (req, res) => {
    MakeQuery("SELECT * FROM `unit`").then(
        function(val) {
            const id = parseInt(req.params.id);
            const d = val.find(d => d.id === id);
            res.status(200).json(d);
        }
    ).catch(
        function(err) {
            throw err;
        }
    );
});

// post
app.post('/api', (req, res) => {
    MakeQuery(
        "INSERT INTO unit (`id`, `name`, `side`) VALUE (NULL, '" + req.body.name + "', '" + req.body.side + "')"
    ).then(
        function(val) {
            res.status(200).json(val);
        }
    ).catch(
        function(err) {
            throw err;
        }
    );    
});

// put
app.put('/api/:id', (req, res) => {
    const id = parseInt(req.params.id);
    MakeQuery(
        "UPDATE unit SET `name` = '" + req.body.name + "', `side` = '" + req.body.side + "' WHERE unit.id = " + id
    ).then(
        function(val) {
            res.status(200).json(val);
        }
    ).catch(
        function(err) {
            throw err;
        }
    );
});

// delete
app.delete('/api/:id', (req, res) => {
    const id = parseInt(req.params.id);
    MakeQuery(
        "DELETE FROM unit WHERE unit.id = " + id
    ).then(
        function(val) {
            res.status(200).json(val);
        }
    ).catch(
        function(err) {
            throw err;
        }
    );
});

app.listen(8080, () => {
    console.log("server listening");
});

// spinner
var spinner = (function() {
    var P = ["\\", "|", "/", "-"];
    var x = 0;
    return setInterval(function() {
      process.stdout.write("\r" + P[x++]);
      x &= 3;
    }, 100);
})();
