const jwt = require('jsonwebtoken')
const express = require('express');
var mysql = require('mysql')
var app = express()
var bodyParser = require('body-parser')
const jwt_decode = require('jwt-decode')
var cookie = require('cookie-parser')


app.set('view engine', 'ejs')
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
var conn = {
   host:'localhost',
   user:'root',
   password:'11111111',
   database:'blogs'
}
var knex = require('knex')({client:'mysql',connection:conn});

	knex.schema.hasTable('users').then(function(exists) {
	  if (!exists) {
	    knex.schema.createTable('users', function(t) {
	      t.increments('id').primary();
		  t.string('name').notNullable();
	      t.string('email').unique().notNullable();
	      t.string('password')
	    //   return res.send('table has been created')
	    })
	    .catch((err)=>{console.log(err.message)})
	  }
	  else{
	  	console.log('This table is already exists!')
	  }

	});


	knex.schema.hasTable('blogs').then(function(exists){
		if (!exists){
			knex.schema.createTable('blogs', function(m){
				m.increments('id').primary();
				m.string('email').notNullable();
				m.string('title').notNullable();
				m.string('blog_text').notNullable();
				m.string('description').notNullable();
				console.log('table has been created')
			})
			.catch((err)=>{return res.send(err.message)})
		}
		else{
			console.log("This table is already exists!")
		}
	});

app.use(express.json())
const user = express.Router();
app.use('',user)
require('./routes/user')(user,knex,jwt)

app.use(express.json())
const blog = express.Router();
app.use('/', blog)
require('./routes/blog')(blog,knex)


app.listen(2080,()=>{
	console.log('your app is listening')
})
