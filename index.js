const express=require('express');
const app=express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;

let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');
const response=require('express');

const url='mongodb://127.0.0.1:27017';
const dbname="hospitals";
let db

MongoClient.connect(url,(err,client)=>{
if(err) return console.log(err);
db=client.db(dbname);
console.log(`connected database: ${url}`);
console.log(`Database:${dbname}`);
});

app.get('/hospital', middleware.checkToken, (req,res)=>{
console.log("getting things ready");
const data=db.collection("hospital").find().toArray()
.then(result => res.json(result));
});

app.get('/ventilator', middleware.checkToken, (req,res)=>{
console.log("getting things ready");
const data=db.collection("ventilators").find().toArray()
.then(result=>(res.json(result)));
});

app.post('/searchventbystatusandname', middleware.checkToken, (req,res) => {
const status = req.query.status;
const name= req.query.name;
console.log(status);
const ventillatordetails=db.collection('ventilators')
.find({"status":status,"name":name}).toArray().then(result=>res.json(result));
});

app.post('/searchventbyname', middleware.checkToken, (req,res) => {
const name=req.query.name;
console.log(name);
const ventilatordeatils=db.collection('ventilators')
.find({'name':new RegExp(name, 'i')}).toArray().then(result=>res.json(result));
});

app.post('/searchhospital', middleware.checkToken, (req,res) => {
const name=req.query.name;
console.log(name);
const ventilatordeatils=db.collection('hospital')
.find({'name':new RegExp(name, 'i')}).toArray().then(result=>res.json(result));
});

app.post('/addvent',(req,res)=>{
const hid=req.query.hid;
const ventid=req.query.ventid;
const status=req.query.status;
const name=req.query.name;
console.log("adding ventilator, please wait a moment");
const item={"hid":hid, "ventid":ventid, "status":status, "name":name};
db.collection("ventilators").insertOne(item, function(err, result){
res.json("inserted successfully");
});
});

app.put('/updateventilator', middleware.checkToken, (req,res) => {
const ventid= {ventid: req.query.ventid};
console.log(ventid);
const newvalues={$set: {status:req.query.status}};
console.log("updating ventilator details, please wait a moment");
db.collection("ventilators").updateOne(ventid, newvalues, function(err, result){
res.json('updated one document');
if(err) throw err;
});
});

app.delete('/deletevent', middleware.checkToken, (req,res) => {
const ventid=req.query.ventid;
console.log(ventid);
const temp={"ventid":ventid};
db.collection("ventilators").deleteOne(temp, function(err,obj){
if(err) throw err;
res.json("deleted one element");
});
});

app.listen(4000,(req,res)=>{
console.log("working well");
});