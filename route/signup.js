const express=require('express');
const insert=require('../Database/insert_user')


const router=express.Router();

router.post('/signup',async(req,res)=>{

 const role=req.body.role;
 const firstname=req.body.firstname;
 const lastname=req.body.lastname;
 const username=req.body.username;
 const email=req.body.email;
 const phonenumber=req.body.phonenumber;
 const pass=req.body.pass;
 const conpass=req.body.conpass;
 let errors=[],result=[]
 if(pass!=conpass)
 {
    errors.push("Passwords do not match")
 }

  if (errors.length != 0) {
    res.render("signup", {
      user: null,
      errors: errors,
      form: {
        role: req.body.role,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        phonenumber: req.body,phonenumber,
        pass: req.body.password,
        conpass: req.body.confirmpassword,
      },
    });
  } else {
    result = await insert.getUserByuserName(username);
    if (result == undefined) {
      //result=await insert.getUserByemail(email);
      //const sql='INSERT INTO USERS(EMAIL,USERNAME,PASSWORD,FIRST_NAME,LAST_NAME,WEIGHT,HEIGHT,DATE_OF_BIRTH,GENDER,BMI,DESIRE,INITIAL_WEIGHT) VALUES(:email,:username,:password, :firstname, :lastname, :weight, :height, :birthdate, :gender, :bmi, :desire, :weight)';
      const sql='INSERT INTO USERS(USERNAME,PASSWORD,FIRST_NAME,LAST_NAME,EMAIL,ROLE,PHONE_NO) VALUES(:username,:pass,:firstname,:lastname,:email,:role, :phonenumber)'
    binds={
         
         email:email,
         username:username,
         pass:pass,
         firstname: firstname,
         lastname: lastname,
         role: role,
         phonenumber: phonenumber
    }

    insert.create_user(sql,binds);
    res.redirect('/');
      
    } else {
      errors.push("Username already exists");
      res.render("signup", {
        user: null,
        errors: errors,
        form: {
          role: req.body.role,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          email: req.body.email,
          phonenumber: req.body,phonenumber,
          pass: req.body.password,
          conpass: req.body.confirmpassword,
        },
      });
    }
  }
})

router.get('/signup',(req,res)=>{
    res.render('signup',{
        errors:[]
    })
})

module.exports=router;
