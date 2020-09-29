// const mysql = require("mysql2");
  
// const connection = mysql.createConnection({
//   host: "klukvin.zzz.com.ua",
//   user: "klukva",
//   database: "klukvin",
//   password: "2020ragroupZ"
// });

// connection.connect(function(err){
//     if (err) {
//       return console.error("Ошибка: " + err.message);
//     }
//     else{
//       console.log("Подключение к серверу MySQL успешно установлено");
//     }
//  });





// const user = ["Gerakl", "my_gerakl", "geracl2020"];
// const sql = "INSERT INTO users(fullname, password, login) VALUES(?, ?, ?)";
 
// connection.query(sql, user, function(err, results) {
//     if(err) console.log(err);
//     else console.log("Данные добавлены");
// });

// connection.query("SELECT * FROM users",
//   function(err, results, fields) {
//     console.log(err);

//     if (err) {
//         //опрацювуэмо помилку
//     }
//     console.log(results); // собственно данные
//     // console.log(fields); // мета-данные полей 
// });
// connection.end();


////////////////////// Sequelize


// const Sequelize = require("sequelize");

//                                  //name    //
// const sequelize = new Sequelize("klukvin", "klukva", "2020ragroupZ", {
//   dialect: "mysql",  /// пип бази даних
//   host: "klukvin.zzz.com.ua",
//   define: {
//       timestamps: false
//   }
// });


// const User = sequelize.define("user", {
//     id: {
//       type: Sequelize.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//       allowNull: false
//     },
//     fullname: {
//       type: Sequelize.STRING,
//       allowNull: false
//     },
//     login: {
//       type: Sequelize.STRING,
//       allowNull: false
//     },
//     password: {
//         type: Sequelize.STRING,
//         allowNull: false
//       }
//   });

//   User.create({
//     fullname: "Tom Edge",
//     login: "qwerty",
//     password: "qqwweerrtt"
//   }).then(res=>{
//     console.log(res);
//   }).catch(err=>console.log(err));

// User.findAll({raw:true}).then(users=>{
//     console.log(users);
//   }).catch(err=>console.log(err));

//   User.findByPk(1)
// .then(user=>{
//     if(!user) return; // если пользователь не найден
//     console.log(user);
// }).catch(err=>console.log(err));

// User.findOne({where: {fullname: "Tom Ford", login: "tom2020"}})
// .then(user=>{
//     if(!user) return;
//     console.log(user);
// }).catch(err=>console.log(err));

// User.update({ fullname: "nik" }, {
//     where: {
//         id: 1
//     }
//   }).then((res) => {
//     console.log(res);
//   });

//   User.destroy({
//     where: {
//       id: 1
//     }
//   }).then((res) => {
//     console.log(res);
//   });


///////////////Sequelize и Express

const Sequelize = require("sequelize");
const express = require("express");
const bodyParser = require("body-parser");
 
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
 
// определяем объект Sequelize
const sequelize = new Sequelize("klukvin", "klukva", "2020ragroupZ", {
  dialect: "mysql",  /// пип бази даних
  host: "klukvin.zzz.com.ua",
  define: {
      timestamps: false
  }
});
 
// определяем модель User
const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    fullname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    login: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
      }
  });
 
app.set("view engine", "ejs");
 
// синхронизация с бд, после успшной синхронизации запускаем сервер
// sequelize.sync().then(()=>{
//   app.listen(3000, function(){
//     console.log("Сервер ожидает подключения...");
//   });
// }).catch(err=>console.log(err));

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
  });
 
// получение данных
app.get("/", function(req, res){
    User.findAll({raw: true }).then(data=>{
      res.render("index", {
        users: data
      });
    }).catch(err=>console.log(err));
});
 
app.get("/create", function(req, res){
    res.render("create");
});
 
// добавление данных
app.post("/create", urlencodedParser, function (req, res) {
    
    console.log(req.body);


    if(!req.body) return res.sendStatus(400);
         
   let user = {
       fullname: req.body.fullname,
       login: req.body.email,
       password: req.body.password,
   }
    User.create(user).then(()=>{
      res.redirect("/");
    }).catch(err=>console.log(err));
});
 
// получаем объект по id для редактирования
app.get("/edit/:id", function(req, res){
  const userid = req.params.id;
  User.findAll({where:{id: userid}, raw: true })
  .then(data=>{
    res.render("edit", {
      user: data[0]
    });
  })
  .catch(err=>console.log(err));
});
 
// обновление данных в БД
app.post("/edit", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
 
  const username = req.body.name;
  const userage = req.body.age;
  const userid = req.body.id;
  User.update({name:username, age: userage}, {where: {id: userid} }).then(() => {
    res.redirect("/");
  })
  .catch(err=>console.log(err));
});
 
// удаление данных
app.post("/delete/:id", function(req, res){  
  const userid = req.params.id;
  User.destroy({where: {id: userid} }).then(() => {
    res.redirect("/");
  }).catch(err=>console.log(err));
});