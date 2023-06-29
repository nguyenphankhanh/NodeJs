// var http = require('http');
const express = require('express');
const jwt = require('jsonwebtoken');
var mysql = require('mysql2');
var bodyParser = require('body-parser')
const app = express();
const port = 3000;


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@khanhdeptrai2002",
  database : "example_nodejs"
});


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "INSERT INTO user (username, password) VALUES ('Company Inc', 'Highway 37')";
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//     });
//   });
app.delete('/delete/:id',(req, res)=>{
  const params = req.params;
  res.send(params);
  var sql = `DELETE FROM example_nodejs.user WHERE (id = '${req.params.id}')`;
        con.query(sql, function (err, result) {

          if (err) throw err;
          console.log("1 record delete");
          res.send(result);
        });
});  
app.put('/update/:id',(req, res) => {
    const params = req.params;
    res.send(params);
    const body = req.body;
    var sql = `UPDATE example_nodejs.user SET username = '${body.username}', password = '${body.password}' WHERE (id = '${params.id}');`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record update");
        });
    res.send(body)


});
app.get('/list', (req, res) => {
    var sql = `SELECT * FROM example_nodejs.user`;
        con.query(sql, function (err, result) {

          if (err) throw err;
          console.log("1 record inserted");
          res.send(result);
        });
});

app.post('/create',(req,res)=>{
    const body = req.body;
    var sql = `INSERT INTO user (username, password) VALUES ('${body.username}', '${body.password}')`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
    res.send(body)
})

app.listen(port, () =>{
    console.log(`listening on http://localhost:${port}`);
});


app.get('/login', (req, res, next) =>{
  res.sendFile(path.join(__dirname, 'login.html'))

});



app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra thông tin đăng nhập trong CSDL
  con.query(`SELECT * FROM user WHERE username = ? AND password = ?`, [username, password], (err, result) => {
    if (err) throw err;

    // Nếu thông tin đăng nhập không chính xác
    if (!result.length) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Tạo JWT token
    const token = jwt.sign({ id: result[0].id }, 'secret-key', { expiresIn: '1h' });

    // Trả về token cho client
    res.json({ token });
  });
});

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.end('Hello World!');
// }).listen(8080);