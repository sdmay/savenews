var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var SavedSchema = new Schema({
  // Just a string
title: {
    type: String,
    
  },
  
  // link is a required string

  article: [{
    type: Schema.Types.ObjectId,
    ref: "Article"
  }]
  
});

// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Article model

// Create the Note model with the NoteSchema
var Saved = mongoose.model("Saved", SavedSchema);

// Export the Note model
module.exports = Saved;