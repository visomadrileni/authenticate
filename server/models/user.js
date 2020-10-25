const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//Everything in Mongoose starts with a Schema.Each schema maps
// to a MongoDB collection and defines the shape of the documents within that collection
// Define our model,when our email will be unique
const userSchema = new Schema({
  email: { 
           type: String, 
           unique: true,
           lowercase: true 
          },
          password: String
       });

/*
Pre middleware functions are executed one after another,when each middleware calls next,
save is the parallel flag in your call

var schema = new Schema(..);
schema.pre('save', function(next) {
  // do stuff
  next();
});
*/

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  const user = this;    // get access to the user model

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password,salt,null,function(err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});


userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create the model class,to use our schema definition, we need to
// convert our userSchema into a Model we can work with
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
