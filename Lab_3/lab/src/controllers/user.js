const db = require("../dbClient");

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if (!user.username)
      return callback(new Error("Wrong user parameters"), null);
    // Create User schema
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    };
    // Save to DB
    db.exists(user.username, (err, exist) => {
      if (err) {
        return callback(err, null);
      }
      if (exist) {
        return callback(new Error("User already exist"), null);
      }
    });

    db.hmset(user.username, userObj, (err, res) => {
      if (err) return callback(err, null);
      callback(null, res); // Return callback
    });
  },

  get: (username, callback) => {
    db.exists(username, (err, exist) => {
      if (err) {
        return callback(err, null);
      }

      if (exist == false) {
        return callback(new Error("User don't exist"), null);
      }

      if (exist) {
        const userObj = {
          firstname: "a",
          lastname: "b",
        };
        return callback(null, userObj);
      }
    });
  },
};
