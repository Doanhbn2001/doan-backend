const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  plants: {
    type: [Schema.Types.ObjectId],
    ref: 'Plant',
    require: true,
  },
});

module.exports = mongoose.model('Type', userSchema);
