const mongoose = require('mongoose');
// look into why you create a model, is it for data
// Create model: this is where I might be able to load up character
const User = new mongoose.Schema(
{
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true}, // makes sure there is only one email with that, create index mongodb
  password: {type: String, required: true},
  quote: {type: String}, // not required, maybe make it like this if dosn't exist yet
},
{
    collection: 'user-data' // the name of the collection in mongo db
});

const model = mongoose.model('UserData', User); // figure out what UserData vs user-data is

module.exports = model;
