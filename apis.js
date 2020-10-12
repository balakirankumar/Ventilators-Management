//All API's be here
//API's.JS

const express=require('express');
const app=express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;

let server = require('./server');
let config = require('./config');
let middleware = require('./middleware');
const response = require('express');

const url='mongodb://127.0.0.1:27017';
const dbname="hospitalDetails";
let db

//Connecting to Mongodb.
MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbname);
    console.log(`connected database: ${url}`);
    console.log(`Database:${dbname}`);
});

//Get hospital details.
app.get('/hospitals', middleware.checkToken, (req,res)=>{
    console.log("All hospital details are given");
    const data=db.collection("hospital").find().sort({'hid':1}).toArray()
    .then(result => res.json(result));
});

//Get ventilators details.
app.get('/ventilators', middleware.checkToken, (req,res)=>{
    console.log("All ventilator details are given");
    const data=db.collection("ventilators").find().sort({'hid':1}).toArray()
    .then(result=>(res.json(result)));
});

//Get ventilators by status.
app.post('/searchventbystatus', middleware.checkToken, (req,res) => {
    const status = req.query.status;
    console.log(`Searching for ventilators of status : ${status}.`);
    const ventillatordetails=db.collection('ventilators')
    .find({"status":status}).toArray().then(result=>res.json(result));
});

//Get ventilators by hospital's name.
app.post('/searchventbyname', middleware.checkToken, (req,res) => {
    const name=req.query.name;
    console.log(`Searching ventilators by hospital : ${name}.`);
    const ventilatordeatils=db.collection('ventilators')
    .find({'name':new RegExp(name, 'i')}).toArray().then(result=>res.json(result));
});

//Search hospitals by name.
app.post('/searchhospitals', middleware.checkToken, (req,res) => {
    const name=req.query.name;
    console.log(`Searching hospital for : ${name}`);
    const ventilatordeatils=db.collection('hospital')
    .find({'name':new RegExp(name, 'i')}).toArray().then(result=>res.json(result));
});

//Add ventilators.
app.post('/addventilator',(req,res)=>{
    const hid=req.query.hid;
    const ventid=req.query.ventid;
    const status=req.query.status;
    const name=req.query.name;
    console.log(`Adding ventilator in hospital :${name}.`);
    const item={"hid":hid, "ventid":ventid, "status":status, "name":name};
    db.collection("ventilators").insertOne(item, function(err, result){
        res.json("inserted successfully");
    });
});

//Update ventilators by ventilator id.
app.put('/updateventilator', middleware.checkToken, (req,res) => {
    const ventid= {ventid: req.query.ventid};
    console.log(ventid);
    const newvalues={$set: {status:req.query.status}};
    console.log(`Updating the status of ventilator of from ${ventid} to ${req.query.status}`);
    db.collection("ventilators").updateOne(ventid, newvalues, function(err, result){
        res.json('updated one document');
        if(err) throw err;
    });
});

//delete ventilators by ventilator id.
app.delete('/deleteventilator', middleware.checkToken, (req,res) => {
    const ventid=req.query.ventid;
    console.log(`Deleting ventilator of id ${ventid}`);
    const temp={"ventid":ventid};
    db.collection("ventilators").deleteOne(temp, function(err,obj){
        if(err) throw err;
        res.json("deleted one element");
    });
});

//Add hospital.
app.post('/addhospital',(req,res)=>{
    const hid=req.query.hid;
    const name=req.query.name;
    const location = req.query.location;
    console.log(`Adding hospital of hid :${hid} and name : ${name}`);
    const item={"hid":hid, "name":name,"location":location};
    db.collection("hospital").insertOne(item, function(err, result){
        res.json(" Hospital inserted successfully");
    });
});

//Delete hospital.
app.delete('/deletehospital', middleware.checkToken, (req,res) => {
    const hid=req.query.hid;
    const temp={"hid":hid};
    console.log("Hopital with "+hid+" got Deleted");
    db.collection("hospital").deleteOne(temp, function(err,obj){
        if(err) throw err;
        res.json("deleted one element");
    });
});

//Search by ventilators status in specified hospital.
app.get('/searchventbystatusinhospital', middleware.checkToken, (req,res) => {
    const status = req.query.status;
    const name=req.query.name;
    console.log(`Searching for hospital : ${name} for which ventilator status :${status}`);
    const ventillatordetails=db.collection('ventilators').find({"status":status,"name":name}).toArray().then(result=>res.json(result));
});

//Search hospitals by location.
app.get('/searchhospitalbylocation', middleware.checkToken, (req,res) => {
    const location=req.query.location;
    console.log(`Searching for hospitals at ${location}.`);
    const ventillatordetails=db.collection('hospital').find({"location":location}).toArray().then(result=>res.json(result));
});

//api's work on port 1100
app.listen(1100,(req,res)=>{
    console.log("working well");
});
