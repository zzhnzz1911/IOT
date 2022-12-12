const express = require('express');
const router = express.Router()
const nodemailer =  require('nodemailer');
const nhietdodoam = require('../models/ndda');
let io
setTimeout(()=>{
	io=require('../socket.js').get()
},1000)


router.get('/',async(req,res)=>{
	
	try{
		const nhietdo= req.query.nhietdo
		const doam= req.query.doam
		const sendmail = req.query.sendmail

		if(sendmail == "true"){
			    //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
				var transporter =  nodemailer.createTransport({ // config mail server
					host: 'smtp.gmail.com',
					port: 465,
					secure: true,
					auth: {
						user: 'hoangnhan191120@gmail.com', //Tài khoản gmail vừa tạo
						pass: 'ndhcqvdwllfqxkin' //Mật khẩu tài khoản gmail vừa tạo
					},
					tls: {
						// do not fail on invalid certs
						rejectUnauthorized: false
					}
				});
				var content = '';
				content += `
					<div style="padding: 10px; background-color: #003375">
						<div style="padding: 10px; background-color: white;">
							<h4 style="color: #0085ff">Nguy hiểm</h4>
							<span style="color: black">Nhà bạn đang bị rò rỉ khí gas</span>
						</div>
					</div>
				`;
				var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
					from: 'NQH-Test nodemailer',
					to: "hoangnhan201119@gmail.com",
					subject: 'Test Nodemailer',
					text: 'Your text is here',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
					html: content //Nội dung html mình đã tạo trên kia :))
				}
				transporter.sendMail(mainOptions, function(err, info){
					if (err) {
						console.log(err);
						req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
						res.redirect('/');
					} else {
						console.log('Message sent: ' +  info.response);
						req.flash('mess', 'Một email đã được gửi đến tài khoản của bạn'); //Gửi thông báo đến người dùng
						res.redirect('/');
					}
				});
		}
		
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

router.get('/chart', async(req, res)=>{
	try{
		const data = await nhietdodoam.find().sort({"_id":-1}).limit(10);

		if(!data){

			return res.status(400).json({success:false, message: 'nodata'});
		}
		const avg = await nhietdodoam.aggregate([
			{$sort:{_id:-1}},
		    { $group: { 
		    	_id:  { year: { $year: "$createdAt" }, month: { $month: "$createdAt" },dayOfMonth:{ $dayOfMonth:"$createdAt"}
			}, 
		    	avgTemp: { $avg: '$nhietdo'},
		    	avgHumidity:{$avg:'$doam'}
		    } },
		  ]).exec();
	
		return res.json({success: true,data,avg})
	}catch(error){
		res.status(500).json({success:false, message: 'nodata'})
	}
})



module.exports = router
