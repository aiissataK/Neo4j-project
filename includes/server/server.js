var express = require('express');
var request = require('request');
var app = express();
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost:7687");
var session = driver.session();


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', null);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
    
});


app.get('/data/:city/:research', function (req, res) {
	var coords = [];
	
	session
		.run("Match (p:Pleasure)<-[:PREPARES]-(r:Restaurant)-[:LOCATED_IN]->(c:City) WHERE c.name={city} and (r.plats CONTAINS {research} or p.name = {research}) return distinct r as restaurants", {city:req.params.city, research:req.params.research})
		  .then(function (result) {
		    result.records.forEach(function (record) {
		     	coords.push(record.get('restaurants'));
		    });
		  	res.send(coords);
		    session.close();
		  })
		  .catch(function (error) {
		  	res.send('error');
		  });

});

app.get('/data/:city', function (req, res) {
	var coords = [];
	var params ={
		city : req.params.city,
		research : req.params.research
	}
	session
		.run("Match (r:Restaurant)-[:LOCATED_IN]->(c:City) WHERE c.name={city} return r as restaurants", {city:req.params.city})
		  .then(function (result) {
		    result.records.forEach(function (record) {
		     	coords.push(record.get('restaurants'));
		    });
		  	res.send(coords);
		    session.close();
		  })
		  .catch(function (error) {
		  	res.send('error');
		  });

});

app.listen(8181)