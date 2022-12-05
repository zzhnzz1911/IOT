const express = require('express');
const router = express.Router()
const nhietdodoam = require('../models/ndda');
let io
setTimeout(()=>{
	io=require('../socket.js').get()
},1000)


router.get('/',async(req,res)=>{
	
	try{
		const nhietdo= req.query.nhietdo
		const doam= req.query.doam

		console.log(nhietdo)
		console.log(doam)

		const ndda = new nhietdodoam({
			nhietdo,
			doam
		})
		try{
			await ndda.save();
		}catch(error){
			console.log(error);
		}

		const data ={
			'nhiet_do':parseFloat(nhietdo,0),
			'do_am':parseFloat(doam,0)
		}
		
		io.emit('HouseData',data)
		res.json({success: true,data:data})
	}catch(error){
		console.log(error);
		res.status(500).json({success:false, message: error})
	}
})

router.get('/data',async(req,res)=>{
	try{	
		let data=require('../index.js')
		res.json({success: true,data})
	}catch(error){
		res.status(500).json({success:false, message: 'nodata'})
	}
})


module.exports = router