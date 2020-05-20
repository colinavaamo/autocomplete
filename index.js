var fetch = require('node-fetch');
var fs = require('fs');
var path = require('path');
var kps = ['https://c7.avaamo.com/dashboard/bot_knowledge_packs/965.json'];

require('dotenv').config();

var content = [];

async function generateJSON(endpoint) {
  await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Access-Token': process.env.USER_ACCESS_TOKEN
    }
  }).then(res => res.json())
    .then((json) => {
      for (let set of json.knowledge_pack.answer_sets)
        for (let sentence of set.training_data) {
          let uttrance = sentence.value.charAt(0).toUpperCase() + sentence.value.slice(1);
          uttrance = uttrance.replace(" i ", " I ");
          content.push(uttrance);
        }

      fs.writeFile(path.join(__dirname, `${json.knowledge_pack.name}.json`), JSON.stringify(content), 'utf8', function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }

        console.log("JSON file has been saved.");
      });
    });
}

(async () => {
  for (let kp of kps) {
    await generateJSON(kp);
  }
})();