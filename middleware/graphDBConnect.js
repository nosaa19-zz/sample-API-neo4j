const neo4j = require('neo4j-driver-lite');
const config = require('config');
const e = require('express');

const uri = config.get('dbHost');
const user = config.get('dbUser');
const password = config.get('dbPass');

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
  maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
  maxConnectionPoolSize: 50,
  connectionAcquisitionTimeout: 2 * 60 * 1000, // 120 seconds
  disableLosslessIntegers: true
});

function executeCypherQuery(statement, params = {}) {
  const session = driver.session();
  return session.run(statement, params)
          .then(res => {
              session.close()
              return res
          })
          .catch(e => {
              session.close()
              throw e
          });                    
}

module.exports = { executeCypherQuery };
