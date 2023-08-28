

const saltRounds = 10;
export default function userCredentialRoutes(waiterSchedule){

    //get the login page
    function root(req, res){
        res.render('login');
    }

    //Redirect to the login page
    function getLogin(req, res){  
        res.redirect('/');
    }
    //get the sign up page
    function getSignUp(req, res){
        res.render('signUp');
    }
    
    //add user to the database
    async function addUser(req, res){
        const { users, password ,type} = req.body;
        currentUser = users
        try{

    //hash the password 
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          await waiterSchedule.addWeiter(users,hashedPassword,type);
          req.flash('success', "User Successfully Added")
      
        }catch(error){

    //Send error using reqplesh if the acount already exists
          if(error.message.includes("duplicate")){
            error.message = "User already exists"
            req.flash('error', error.message)
          }
          console.log('error', error.message)
          res.redirect('/signUp')
        }
        
        res.render('signUp');
      }

    return{
        root,
        getLogin,
        addUser,
        getSignUp
    }
}