# sample-API-neo4j
This sample API using express and neo4j graph db

Demo API: https://sample-api-neo4j-vt5aik4fxq-de.a.run.app

Available Rest API:

API | Body | Parameter 
--- | --- | ---
GET /api/person/ | |
POST /api/person/ | {name, born} |
GET /api/person/:id | | id
PATCH /api/person/:id | {name, born} | id
DELETE /api/person/:id | | id
--- | --- | ---
GET /api/movie/ | |
POST /api/movie/ | {title, released, tagline} |
GET /api/movie/:id | | id
PATCH /api/movie/:id | {title, released, tagline} | id
DELETE /api/movie/:id | | id
--- | --- | ---
POST api/relationship/friend/add | {source, destination} |
GET api/relationship/friend/list/:name | | name
POST api/relationship/friend/delete | {source, destination} |
POST api/relationship/acted-in/add | {source, destination, role} |
GET api/relationship/acted-in/list/:name | | name
POST api/relationship/acted-in/delete | {source, destination, role} |
POST api/relationship/directed/add | {source, destination} |
GET api/relationship/directed/list/:name | | name
POST api/relationship/directed/delete | {source, destination} |
