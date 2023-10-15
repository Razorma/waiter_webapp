import bcrypt from "bcrypt";
import express from "express";
import session from "express-session";
let app = express();

app.use(session({
  secret: 'Razorma',
  resave: false,
  saveUninitialized: true,
}));


const saltRounds = 10;

export default function userCredentialRoutes(waiterSchedule) {

  //get the home page
  function root(req, res) {
    res.render('Welcome', { signUpCode: req.session.signUpCode });
  }

  function setSignupCode(req, res) {
    res.redirect('/');
  }
  //Render to the login page
  function getLogin(req, res) {
    res.render('login');
  }
  //get the sign up page
  function getSignUp(req, res) {
    res.render('signUp');
  }

  function getSignUpCode(req, res) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      if(req.session.signUpCode===undefined){
        req.session.signUpCode=""
      }else{
        req.session.signUpCode += characters.charAt(randomIndex);
      }
      
    }
    res.redirect('/Welcome');
  }

  //add user to the database
  async function addUser(req, res) {
    const { users, password, code, surname, email } = req.body;
    const type = "waiter"


    if (code === req.session.signUpCode) {

      try {

        //hash the password 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await waiterSchedule.addWeiter(users, hashedPassword, type, surname, email);
        req.flash('success', "User Successfully Added")
        res.render('signUp');

      } catch (error) {

        //Send error using reqplesh if the acount already exists
        if (error.message.includes("duplicate")) {
          error.message = "User already exists"
          req.flash('error', error.message)
        }
        console.log('error', error.message)
        res.redirect('/signUp')
      }
    } else {
      req.flash('error', 'Wrong code')
      res.redirect('/signUp')
    }

  }

  return {
    root,
    getLogin,
    addUser,
    getSignUp,
    getSignUpCode,
    setSignupCode
  }
}