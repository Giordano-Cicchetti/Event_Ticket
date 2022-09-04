const mongoose = require('mongoose');

//------------ Event Schema ------------//
const EventSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  descrizione: {
    type: String,
  },
  img:
  {
      data: Buffer,
      contentType: String
  },
  date:{
    type: Date
  },
  city:{
    type: String
  },
  locale:{
    type: String
  },
  manager:{
    type: String
  }

}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;