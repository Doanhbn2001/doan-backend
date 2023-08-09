const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    require: true,
  },
  plant_notes: {
    plant_notes: [
      {
        note: {
          type: String,
          require: true,
        },
        plant: {
          type: Schema.Types.ObjectId,
          require: true,
          ref: 'Plant',
        },
      },
    ],
  },
});

userSchema.methods.addToNote = function (plant, note) {
  const notePlant = this.plant_notes.plant_notes.findIndex((cb) => {
    return cb.plant.toString() === plant._id.toString();
  });
  const updatedNote = [...this.plant_notes.plant_notes];
  if (notePlant >= 0) {
    updatedNote[notePlant].note = note;
  } else {
    updatedNote.push({ note: note, plant: plant._id });
  }
  update = {
    plant_notes: updatedNote,
  };
  this.plant_notes = update;
  return this.save();
};

userSchema.methods.deleteNote = function (plant) {
  const updateNote = this.plant_notes.plant_notes.filter((n) => {
    return n.plant.toString() !== plant.toString();
  });
  this.plant_notes.plant_notes = updateNote;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
