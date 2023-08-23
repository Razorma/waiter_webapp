import express  from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import WaiterSchedule from "./Services/waiter.js";
import Handlebars from 'handlebars'
import pgPromise from "pg-promise";

const pgp = pgPromise();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:jayson@2001@localhost:5432/waiter_schedule';
// const ssl = { rejectUnauthorized: false }
//, ssl 

const db = pgp({ connectionString});

Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

const waiterSchedule = WaiterSchedule(db);



let app = express();

// Setup the Handlebars view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse URL-encoded and JSON request bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())









app.get("/", function(req, res){
    res.render('login');
});
app.post("/waiter", function(req, res){
  // waiterSchedule.login(req.body.users,req.body.password)

  console.log(req.body.password)
  res.render('waiters',{name:req.body.users});
});
app.post("/waiter/:username", function(req, res){
  const username = req.params.username;
  const selectedDays = req.body.day; 
  
  
  
  console.log();
  console.log("Selected Days:", selectedDays);
//{name:username}
  res.redirect('/home'); 
});

app.get("/waiter", function(req, res){
  res.redirect('/waiter');
});
app.get("/home", function(req, res){
//   waiterSchedule.getWaiterSchedules()
 let groupedDays = waiterSchedule.getEachDay();
  res.render('home',{groupedDays});
});
app.post("/signUp", function(req, res){
  console.log(req.body.users)
  console.log(req.body.password)
  // waiterSchedule.addWeiter('req.body.users','req.body.password');
  res.redirect('/');
});
app.get("/signUp", function(req, res){

  res.render('signUp');
});
app.get("/login", function(req, res){
  
  res.redirect('/');
});
let PORT = process.env.PORT || 3003;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});