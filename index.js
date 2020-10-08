const express = require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient=require('Mongodb').MongoClient;
let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');
const response=require('express');
const url='mongodb://127.0.0.1:27017';
const dbn='hospitalInfo';
let db
MongoClient.connect(url,{ useUnifiedTopology:true } ,(err,client) =>
{
    if(err) return console.log(err);
    db=client.db(dbn);
    console.log('connected to database:'+url);
    console.log('database : '+dbn);
});

app.get('/hospital', middleware.checkToken, function(req, res) {
    var da= db.collection("hospital").find().toArray()
    .then(result=>  res.json(result));
    console.log('fetching details of hospital',da);
  });

  app.get('/ventilator',middleware.checkToken, function(req, res) {
    var da= db.collection("ventilator").find().toArray()
    .then(result=>  res.json(result));
    console.log('fetching details of ventilator',da);
  });

app.post('/searchventilator',middleware.checkToken, (req,res) =>{
      var status=req.body.status;
      console.log(status);
      var ventilatorInfo=db.collection('ventilator')
      .find({"status": status}).toArray().then(result=>res.json(result));
});
app.post('/searchventilators',middleware.checkToken,(req,res) => {
  var Name=req.query.Name;
  console.log(Name);
  var ventilatorInfo= db.collection('ventilator')
  .find({"Name":new RegExp(Name,'i')}).toArray().then(result=>res.json(result));
});
app.put('/update',middleware.checkToken,(req,res) => {
  var ventid={ventilatorID: req.body.ventilatorID};
  console.log(ventid);
  var newvalues={ $set :{ status:req.body.status}};
  db.collection("ventilator").updateOne(ventid,newvalues,function(err,result){
    res.json('1 document updated');
  });
});
app.post('/add',middleware.checkToken,(req,res)=>{
  var hID=req.body.hID;
  var ventilatorID=req.body.ventilatorID;
  var status=req.body.status;
  var Name=req.body.Name;
  var item={
    hID:hID,ventilatorID:ventilatorID,status:status,Name:Name
  };
  db.collection('ventilator').insertOne(item,function(err,result){
    res.json('Item inserted');
  });

});
app.delete('/delete',middleware.checkToken,(req,res)=>{
  var myquery=req.query.ventilatorID;
  console.log(myquery);
  var myquery1={ ventilatorID: myquery};
  db.collection('ventilator').deleteOne(myquery1,function(err,obj)
    {
      res.json("1 document deleted");
    });
});
app.listen(1100);