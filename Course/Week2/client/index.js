const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {
  // TODO: how do we prove to the server we're on the nice list? 
  const name = 'Norman Block'
  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    name: name
  });

  console.log({ gift });
}

main();