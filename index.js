import express  from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import WaiterSchedule from "./Services/waiter.js";
import Handlebars from 'handlebars'
import pgPromise from "pg-promise";
import flash from "express-flash";
import session from "express-session";
import bcrypt from "bcrypt";

let app = express();
const pgp = pgPromise();
const saltRounds = 10;
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

// Handlebars.registerHelper('sliceArray', function (array, start, end, options) {
//   const slicedArray = array.slice(start, end);
//   let result = '';
//   for (let i = 0; i < slicedArray.length; i++) {
//     result += options.fn(slicedArray[i]);
//   }
//   return result;
// });


// Register a custom Handlebars helper for equality comparison
Handlebars.registerHelper('eq', function(a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});



app.use(session({ 
  secret: 'Razorma', 
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

const waiterSchedule = WaiterSchedule(db,bcrypt);
// await waiterSchedule.addWeiter('bheka','ilovescripts');




    
    



// Setup the Handlebars view engine
app.engine('handlebars', engine({
  // Define a custom Handlebars helper
  helpers: {
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse URL-encoded and JSON request bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())








let currentUser = "" 
app.get("/", function(req, res){
    res.render('login');
});
app.post("/waiter", async function(req, res){

  try{

    const role = await waiterSchedule.login(req.body.users, req.body.password);
    currentUser = req.body.users
        if (role === 'admin') {

            res.redirect('/home');
        } else if (role === 'waiter') {
          const groupedDays = (await waiterSchedule.getEachDay()).Days
          const overGroupedDaysClass = (await waiterSchedule.getEachDay()).overDaysObject

          res.render('waiters', {
            name:req.body.users,
            groupedDays,
            overGroupedDaysClass
          });

        }
  }catch(error){
    req.flash('error', error.message)
    res.redirect('/login')
  }

});
app.post("/waiter/:username",async function(req, res){
  const username = req.params.username;
  currentUser = username

  let selectedDays = req.body.day; 
    
  if (typeof selectedDays === 'string') {
    selectedDays= [selectedDays];
  }
  if(selectedDays){
  
  try{
    await waiterSchedule.addWaiterWorkingDate(username, selectedDays)
    currentUser = username
    const groupedDays = (await waiterSchedule.getEachDay()).Days
    const overGroupedDaysClass = (await waiterSchedule.getEachDay()).overDaysObject
    req.flash('success', "Successfully booked")
    res.render('waiters',{
      name:username,
      groupedDays,
      overGroupedDaysClass
    });
  }catch(error){
    const groupedDays = (await waiterSchedule.getEachDay()).Days
    const overGroupedDaysClass = (await waiterSchedule.getEachDay()).overDaysObject
    req.flash('error', error.message)
    res.render('waiters',{
      name:username,
      groupedDays,
      overGroupedDaysClass
    });
  }

}else{
  req.flash('error', "please select Day")
}
 
});

app.get("/waiter/:username",async function(req, res){


  try{

    const groupedDays =  (await waiterSchedule.getEachDay()).Days
    const overGroupedDaysClass = (await waiterSchedule.getEachDay()).overDaysObject
  
    res.render('waiters',{
    name:currentUser,
    groupedDays,
    overGroupedDaysClass,
  });
  }catch(error){
    req.flash('error', error.message)
  }
});
app.get("/schedule",async function(req, res){

  try{

    const groupedDays = (await waiterSchedule.getEachDay()).Days
    const overGroupedDaysClass = (await waiterSchedule.getEachDay()).overDaysObject

    res.render('schedule',{
      schedule:await waiterSchedule.getWaiterWorkingDate(currentUser),
      groupedDays,
      overGroupedDaysClass,
      currentUser
    });
  }catch(error){
    req.flash('error', error.message)
    res.redirect("/waiter/currentUser")
  }
  
});
app.post("/schedule/:username",async  function(req, res){
  const username = req.params.username;
  currentUser = username
  const day = req.body.day;
  try{
    await waiterSchedule.deletWaiterWorkingDate(username,day)
  }catch(error){
    req.flash('error', error.message)
  }
  

    res.redirect('/schedule');
});


app.get("/home", async function(req, res){

try{
  const groupedDays = (await waiterSchedule.getEachDay()).Days
  const overGroupedDaysClass = (await waiterSchedule.getEachDay()).overDaysObject
  

   res.render('home',{groupedDays,overGroupedDaysClass});
}catch(error){
  req.flash('error', error.message)
}
  
});
app.post("/signUp", async function(req, res){
  const { users, password ,type} = req.body;
  currentUser = users
  try{
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await waiterSchedule.addWeiter(users,hashedPassword,type);
    req.flash('success', "User Successfully Added")

  }catch(error){
    if(error.message.includes("duplicate")){
      error.message = "User already exists"
      req.flash('error', error.message)
    }
    console.log('error', error.message)
    res.redirect('/signUp')
  }
  
  res.render('signUp');
});


app.get("/list",async function(req, res){

  try{
    const allDays = (await waiterSchedule.getEachDay()).allDays

     res.render('list',{allDays});
  }catch(error){
    req.flash('error', error.message)
  }
 
});
app.post("/list/:username",async  function(req, res){
  const username = req.params.username;
  const day = req.body.day;
  try{
    await waiterSchedule.deletWaiterWorkingDate(username,day)
  }catch(error){
    req.flash('error', error.message)
  }
   res.redirect('/list');
});

app.get("/waiter", function(req, res){
  res.redirect('/waiter');
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