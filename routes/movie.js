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
  const { title, tagline, released } = req.body;
  if (!title || !released) {
    return res.status(400).send('Invalid Inputs');
  }

  const query = `CREATE (n:Movie {id:$id, title:$title, tagline: $tagline, released: $released}) RETURN n`;
  const params = {
    id: uuidv4(),
    title,
    tagline,
    released
  };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});
router.get('/', async function(req, res) {
  const query = 'MATCH (n:Movie) RETURN n LIMIT 100';
  const params = {};
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});
router.get('/:id', async function(req, res) {
  const { id } = req.params;
  const query = 'MATCH (n:Movie {id: $id}) RETURN n LIMIT 100';
  const params = { id: id };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});
router.patch('/:id', async function(req, res) {
  const { id } = req.params;
  const { title, tagline, released } = req.body;

  let strTitle = title ? ` n.title = '${title}' ` : '';
  let strTagline = tagline ? ` n.tagline = '${tagline}' ` : '';
  let strReleased = released ? ` n.released = '${released}' ` : '';

  const query = `MATCH (n:Movie {id: $id}) SET ${strTitle}, ${strTagline}, ${strReleased} RETURN n`;
  const params = { id: id };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});
router.delete('/:id', async function(req, res) {
  const { id } = req.params;
  const query = 'MATCH (n:Movie {id: $id}) DELETE n';
  const params = { id: id };
  const resultObj = await graphDBConnect.executeCypherQuery(query, params);
  res.send('Delete success');
});

module.exports = router;
