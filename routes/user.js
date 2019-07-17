// var nodemailer = require('nodemailer')
const jwt_decode=require('jwt-decode')
module.exports = (user,knex,jwt)=>{

	user.get('/login',(req,res)=>{
		res.sendFile(__dirname+"/login.html")
	})

	user.get('/signup',(req,res)=>{
		return res.sendFile(__dirname +"/signup.html")
	})

	user.get('/all_get', (req,res)=>{
		console.log(__dirname)
		var users=req.headers.cookie;

		users=users.split(' ')
		console.log(users)
		var username=jwt_decode(users[users.length-1]).email
		console.log(username)

		knex.select("*")
		.from('blogs')
		.where('email',username)
		.then((blogdata)=>{
			console.log(blogdata)
			return res.render(__dirname+ "/all_get.ejs", {data:blogdata})
		})
		.catch((err)=>{
			console.log(err)
			return res.send("there is error somewhere")
		})

	})

	user.get('/login_home',(req,res)=>{
		// console.log(__dirname)
		knex
		.select("*")
		.from("blogs")
		.then((blogdata)=>{
			console.log(blogdata)
			return res.render(__dirname+'/login_home.ejs',{data: blogdata})
		})
		.catch((err)=>{
			return res.send(err);
		})
	})
	user.get('/home', (req,res)=>{
		knex.select("*")
		.from("blogs")
		.then((blogdata)=>{
			console.log("done")
			res.render(__dirname+'/home.ejs', {data: blogdata})
			res.send(data)
		})
		.catch((err)=>{
			res.send(err);
		})
	})

	user.post('/signup',(req,res)=>{
		let {body} = req
		let {name, email, password} = body;

		knex('users').insert({name:name, email:email, password:password})
		.then((data)=>{
			var nodemailer=require("nodemailer")
			var otp=""
			for (var i =0;i<4;i++){
				otp+=Math.floor(Math.random()*10)
			}
			var protocole=nodemailer.createTransport({
				service:"gmail",
				auth:{
					user: "rohit18@navgurukul.org",
					pass: "rohit18@navgurukul"
				}
			})
			var mail={
				from: "rohit18@navgurukul.org", 
				to: email,
				subject:"OTP of your gmail",
				text: "OTP is "+otp
			}
			protocole.sendMail(mail,(err,info)=>{
				if(err){
					console.log("please input correct mail")
				}else{
					console.log("your email sent successfully!")
				}
			}) 
			console.log("inserted data")
			return res.send("inserted data successfully")
		})
		.catch((err)=>{	
			console.log("signup is allready")
			return res.send("signup is allready")
		})
	})	
	
	user.get('/add_blog',(req,res)=>{
		return res.sendFile(__dirname+'/add_blog.html')
	})

	user.post("/login", (req,res)=>{
		var user_email=req.body.email;
		var user_password=req.body.password;
		var data=req.body

		var token=jwt.sign(data,  'khhhhh', {expiresIn:'1hr'});

		res.cookie('qwdsr',token,{overwrite:true})
		var mycookie= req.headers.cookie;

		token=mycookie.slice(6,mycookie.length)
		console.log(token)

		var decodeToken= jwt_decode(token)
		console.log(decodeToken)

		knex
		.select('*').from('users')
		.where('email', user_email)
		.andWhere('password', user_password)
		.then((result) => {
			if (result.length>0){
				return res.render(__dirname+"/home.ejs", {data:result})
			}else{
				res.send("Invalid password")
			}
		})
		.catch((err)=>{
			return res.send(err)
		})
	})
}