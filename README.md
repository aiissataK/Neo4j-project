# Neo4j-project

This project is an application that can be used to search for restaurants in an area. 
The main purpose is how to work with neo4j database and to how to print results on the map.
The data are not included in this project.

First the user can type the name of a region to get all the restaurants in that area.
![alt text](https://github.com/aiissataK/Neo4j-project/blob/master/includes/img/img1.png)


The user can also specify the name of an restaurant or something he want to eat to get all restaurants that have that type of meal.
![alt text](https://github.com/aiissataK/Neo4j-project/blob/master/includes/img/img2.png)

In this project we use <b>Neo4j bolt driver</b> for javascript to communicate with our database. 
## Usage examples

Initialization of the neo4j object:
```javascript
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost:7687");
```
using session API:
```javascript
app.get('/data/:city', function (req, res) {
	var coords = [];
	var params ={
		city : req.params.city,
		research : req.params.research
	}
	session
		.run("Match (r:Restaurant)-[:LOCATED_IN]->(c:City) WHERE c.name={city} return r AS restaurants", {city:req.params.city})
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
```
