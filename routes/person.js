const express = require('express');
const { v4: uuidv4 } = require('uuid');
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

router.post('/', async function(req, res) {
  const { name, born } = req.body;
  if (!name || !born) {
    return res.status(400).send('Invalid Inputs');
  }

  const query = `CREATE (n:Person {id:$id, name:$name, born: $born}) RETURN n`;
  const params = {
    id: uuidv4(),
    name,
    born
  };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});
router.get('/', async function(req, res) {
  const query = 'MATCH (n:Person) RETURN n LIMIT 100';
  const params = {};
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});
router.get('/:id', async function(req, res) {
  const { id } = req.params;
  const query = 'MATCH (n:Person {id: $id}) RETURN n LIMIT 100';
  const params = { id: id };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});
router.patch('/:id', async function(req, res) {
  const { id } = req.params;
  const { name, born } = req.body;
  let strName = name ? ` n.name = '${name}' ` : '';
  let strBorn = born ? ` n.born = '${born}' ` : '';

  const query = `MATCH (n:Person {id: $id}) SET ${strName}, ${strBorn} RETURN n`;
  const params = { id: id };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});
router.delete('/:id', async function(req, res) {
  const { id } = req.params;
  const query = 'MATCH (n:Person {id: $id}) DELETE n';
  const params = { id: id };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  res.send('Delete success');
});

module.exports = router;
