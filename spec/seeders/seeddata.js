const mongoose = require('mongoose');

module.exports = {
  users: [
    {
      id: mongoose.Schema.Types.ObjectId('57c96a56cd9ca231483f082b'),
      firstname: 'Charlotte',
      lastname: 'Bronte',
      username: 'charl',
      email: 'charlote@bronte.com',
      password: 'charlottebronte',
      title: 'editor'
    },
    {
      id: mongoose.Schema.Types.ObjectId('57c94278517ca48c9e5af00f'),
      firstname: 'Victor',
      lastname: 'Hugo',
      username: 'vichugo',
      email: 'victor@hugo.com',
      password: 'victorhugo',
      title: 'supra-admin'
    },
    {
      id: mongoose.Schema.Types.ObjectId('57c942a8517ca48c9e5af010'),
      firstname: 'Aldous',
      lastname: 'Huxley',
      username: 'al',
      email: 'aldous@huxley.com',
      password: 'aldoushuxley',
      title: 'admin'
    },
    {
      id: mongoose.Schema.Types.ObjectId('57d05aea1cd5386e0d2ca88a'),
      firstname: 'Clark',
      lastname: 'Kent',
      username: 'kal',
      email: 'manofsteel@league.com',
      password: 'krypton',
    },
    {
      id: mongoose.Schema.Types.ObjectId('57d1a854a13e763a1d5b89f1'),
      firstname: 'Clark',
      lastname: 'Kent',
      username: 'kal',
      email: 'manofsteel@league.com',
      password: 'krypton',
    },
    {
      id: mongoose.Schema.Types.ObjectId('57d05aea1cd5386e0d2ca88a'),
      firstname: 'Arthur',
      lastname: 'Curry',
      username: 'ac',
      email: 'acurry@league.com',
      password: 'triton',
    },
    {
      id: mongoose.Schema.Types.ObjectId('57d00913bc185f810bcd0d87'),
      firstname: 'Wonder',
      lastname: 'Woman',
      username: 'wonderwoman',
      email: 'wonderwoman@league.com',
      password: 'goldenlasoo',
    },
  ],

  documents: [

    {
      id: mongoose.Schema.Types.ObjectId('57c975eb2c3d08864b51cd0a'),
      // wonderwoman
      _creatorId: mongoose.Schema.Types.ObjectId('57d00913bc185f810bcd0d87'),
      title: 'We should all be feminitsts',
      content: 'Being a female superhero',
      privacy: 'public',
      // Arthur Curry
      sharewith: mongoose.Schema.Types.ObjectId('57d05aea1cd5386e0d2ca88a'),
    },

    {
      id: mongoose.Schema.Types.ObjectId('57c975eb2c3d08864b51cd09'),
      // arthur
      _creatorId: mongoose.Schema.Types.ObjectId('57d05aea1cd5386e0d2ca88a'),
      title: 'Topology of the Marianas Trench',
      content: 'The Marianas Trench',
      privacy: 'private',
      // Clark Kent
      sharewith: mongoose.Schema.Types.ObjectId('57d1a854a13e763a1d5b89f1'),
    },
    {
      id: mongoose.Schema.Types.ObjectId('57c975eb2c3d08864b51cd07'),
      // arthur
      _creatorId: mongoose.Schema.Types.ObjectId('57d05aea1cd5386e0d2ca88a'),
      title: 'Life underwater',
      content: 'An ode to life underwater',
      privacy: 'public',
    },
    {
      id: mongoose.Schema.Types.ObjectId('57c975eb2c3d08864b51cd08'),
      // Victor Hugo
      _creatorId: mongoose.Schema.Types.ObjectId('57c94278517ca48c9e5af00f'),
      title: 'A Tale of Two Cities',
      content: 'The French Revolution',
      privacy: 'public',
    },
  ],

  roles: [
    {
      title: 'supra-admin',
      permission: 'readWriteDelete'
    },
    {
      title: 'editor',
      permission: 'readWrite'
    },
    {
      title: 'viewer',
      permission: 'read'
    },
    {
      title: 'admin',
      permission: 'readWrite'
    },
  ]
};
