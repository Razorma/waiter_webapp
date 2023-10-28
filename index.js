import express  from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import WaiterSchedule from "./Services/waiter.js";
import pgPromise from "pg-promise";
import flash from "express-flash";
import session from "express-session";
import bcrypt from "bcrypt";
import helpers from "./handlebarsHelpers.js"; 
import WaiterRoutes from "./routes/waiters.js";
import userCredentialRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import authenticateToken from "./middleware/authorize.js";
dotenv.config();

let app = express();
const pgp = pgPromise();

const connectionString = process.env.DATABASE_URL 

const db = pgp({ connectionString});



app.use(session({ 
  secret: 'Razorma', 
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

const waiterSchedule = WaiterSchedule(db,bcrypt);
const waiterRoutes = WaiterRoutes(waiterSchedule)
const AdminRoutes = adminRoutes(waiterSchedule)
const userCreds = userCredentialRoutes(waiterSchedule)




const handlebarsHelpers = helpers()

// Setup the Handlebars view engine
app.engine('handlebars', engine({
  // Define a custom Handlebars helper
  helpers: handlebarsHelpers
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse URL-encoded and JSON request bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

// Define a route to handle requests to Home page
app.get("/Welcome",userCreds.setSignupCode);
app.post("/code",userCreds.getSignUpCode);

// Define a route to handle GET requests to login page
app.get("/",userCreds.root);
app.get("/login", userCreds.getLogin);

//Define get and post routes to the signup page 
app.get("/signUp",userCreds.getSignUp);
app.post("/signUp", userCreds.addUser);


//Define get and post routes for the waiters pages
app.post("/waiter", waiterRoutes.login);
app.get("/waiter",authenticateToken, waiterRoutes.getWaiter);
app.post("/waiter/:username",authenticateToken,waiterRoutes.addSchedule);
app.get("/waiter/:username",authenticateToken,waiterRoutes.updateShedule);
app.get("/schedule",authenticateToken,waiterRoutes.getShedule);
app.post("/schedule/:username",authenticateToken,waiterRoutes.getUsernameSchedule);


//Define get and post routes for the Admin pages
app.get("/home",authenticateToken,AdminRoutes.getUsers);
app.get("/list",authenticateToken,AdminRoutes.getListUsers);
app.post("/list/:username",authenticateToken,AdminRoutes.removeWaiters);





let PORT = process.env.PORT || 3003;

app.listen(PORT, function(){
  console.log(`App listening on localhost:${PORT}`);
});