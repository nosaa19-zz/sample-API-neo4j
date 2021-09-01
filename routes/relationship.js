const express = require('express');
const router = express.Router();
const graphDBConnect = require('../middleware/graphDBConnect');

function formatResponse(resultObj) {
  const result = [];
  if (resultObj.records.length > 0) {
    resultObj.records.map(record => {
      result.push(record._fields[0].properties);
    });
  }
  return result;
}

/* Friend Relation -> Person to Person */

router.post('/friend/add', async (req, res) => {
  const { source, destination } = req.body;
  if (!source || source < 1 || !destination || destination < 1) {
    return res.status(400).send('Invalid Inputs');
  }

  const query = `MATCH (n:Person {name:$source}), (f:Person {name:$destination}) CREATE (n)-[:FRIEND]->(f) RETURN n`;
  const params = {
    source,
    destination
  };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});

router.get('/friend/list/:name', async (req, res) => {
  const { name } = req.params;
  const query = 'MATCH (n:Person {name: $name})-[:FRIEND]-(f) RETURN f LIMIT 100';
  const params = { name: name };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});

router.post('/friend/delete', async (req, res) => {
  const { source, destination } = req.body;
  if (!source || source < 1 || !destination || destination < 1) {
    return res.status(400).send('Invalid Inputs');
  }
  const query =
    'MATCH (n:Person {name:$source})-[r:FRIEND]-(f:Person {name:$destination}) DELETE r';
  const params = {
    source,
    destination
  };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send('Friends relation deleted successfully');
});

/* Acted In Relation -> Person to Movie */

router.post('/acted-in/add', async (req, res) => {
  const { source, destination, role } = req.body;
  if (!source || source < 1 || !destination || destination < 1) {
    return res.status(400).send('Invalid Inputs');
  }

  if(!role){
    return res.status(400).send('Role is needed for this relation');
  }

  let strRole = ` {roles:['${role}']}`;

  const query = `MATCH (n:Person {name:$source}), (m:Movie {title:$destination}) CREATE (n)-[:ACTED_IN ${strRole}]->(m) RETURN n`;
  const params = {
    source,
    destination
  };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});

module.exports = router;

router.get('/acted-in/list/:name', async (req, res) => {
  const { name } = req.params;
  const query = 'MATCH (n:Person {name: $name})-[:ACTED_IN]-(m) RETURN m LIMIT 100';
  const params = { name: name };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});

router.post('/acted-in/delete', async (req, res) => {
  const { source, destination } = req.body;
  if (!source || source < 1 || !destination || destination < 1) {
    return res.status(400).send('Invalid Inputs');
  }
  const query =
    'MATCH (n:Person {name:$source})-[r:ACTED_IN]-(m:Movie {name:$destination}) DELETE r';
  const params = {
    source,
    destination
  };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send('Acted In relation deleted successfully');
});

/* Directed In Relation -> Person to Movie */

router.post('/directed/add', async (req, res) => {
  const { source, destination} = req.body;
  if (!source || source < 1 || !destination || destination < 1) {
    return res.status(400).send('Invalid Inputs');
  }

  const query = `MATCH (n:Person {name:$source}), (m:Movie {title:$destination}) CREATE (n)-[:DIRECTED]->(m) RETURN n`;
  const params = {
    source,
    destination
  };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});

module.exports = router;

router.get('/directed/list/:name', async (req, res) => {
  const { name } = req.params;
  const query = 'MATCH (n:Person {name: $name})-[:DIRECTED]-(m) RETURN m LIMIT 100';
  const params = { name: name };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});

router.post('/acted-in/delete', async (req, res) => {
  const { source, destination } = req.body;
  if (!source || source < 1 || !destination || destination < 1) {
    return res.status(400).send('Invalid Inputs');
  }
  const query =
    'MATCH (n:Person {name:$source})-[r:DIRECTED]-(m:Movie {name:$destination}) DELETE r';
  const params = {
    source,
    destination
  };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send('Directed relation deleted successfully');
});