const jwt_decode = require('jwt-decode')
module.exports = (blog,knex)=>{
	
	blog.post('/add_blog',(req, res)=>{
		var title = req.body.title;
		var blog_text = req.body.blog_text;
		var description = req.body.description;
		var token = req.headers.cookie;
		
		var email  = jwt_decode(token).email
		knex('blogs').insert({id:null, email:email, title:title, blog_text: blog_text, description:description})
		.then((data)=>{
			// return res.send(data)})
			knex.select("*")
			.from("blogs")
			.then((select_data)=>{
				res.render(__dirname+"/home.ejs", {data: select_data});
			})
			.catch((err)=>
			{
				console.log(err)
			})
		.catch((err)=>{
			console.log("done");
			return res.send("data is allready exitss")
		})

		})
		
	})

		
	blog.get('/get_course/:id', (req, res)=>{
		knex.select('blog_text').from('blogs').where('id', req.params.id)
		.then((data)=>{
			return res.send(data)
		})
		.catch((err)=>{
			return res.send("there is some thing getting error!")
		})
	})

	blog.put('/update/:id',(req, res)=>{
		var id= req.params.id;
		var title= req.body.title;
		var blog_text= req.body.blog_text;
		knex('blogs').where('id',id).update({title: title, blog_text: blog_text})
		.then((data)=>{
			return res.send(data)
		})
		.catch((err)=>{
			return res.send("please choose correct id... ");
		})
		return res.send("data updated successfully!")
		})


	blog.delete('/remove/:id',(req, res)=>{
		knex('blogs').where('id', req.params.id).del()
		.then((data)=>{
			return res.send(data)
		})
		.catch((err)=>{
			return res.send(err.message)
		})
		return res.send('deleted successfully!')
	})
}