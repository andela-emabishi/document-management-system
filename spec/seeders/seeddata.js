const mongoose = require('mongoose');

module.exports = {
  users: [
    {
      _id: mongoose.Types.ObjectId('57c96a56cd9ca231483f082b'),
      firstname: 'Charlotte',
      lastname: 'Bronte',
      username: 'charl',
      email: 'charlote@bronte.com',
      password: 'charlottebronte',
      title: 'editor',
    },
    {
      _id: mongoose.Types.ObjectId('57c94278517ca48c9e5af00f'),
      firstname: 'Victor',
      lastname: 'Hugo',
      username: 'vichugo',
      email: 'victor@hugo.com',
      password: 'victorhugo',
      title: 'supra-admin',
    },
    {
      _id: mongoose.Types.ObjectId('57c942a8517ca48c9e5af010'),
      firstname: 'Aldous',
      lastname: 'Huxley',
      username: 'al',
      email: 'aldous@huxley.com',
      password: 'aldoushuxley',
      title: 'admin',
    },
    {
      _id: mongoose.Types.ObjectId('57d05aea1cd5386e0d2ca88a'),
      firstname: 'Clark',
      lastname: 'Kent',
      username: 'kal',
      email: 'manofsteel@league.com',
      password: 'krypton',
    },
    {
      _id: mongoose.Types.ObjectId('57d05aea1cd5386e0d2ca88b'),
      firstname: 'Arthur',
      lastname: 'Curry',
      username: 'ac',
      email: 'acurry@league.com',
      password: 'triton',
    },
    {
      _id: mongoose.Types.ObjectId('57d00913bc185f810bcd0d87'),
      firstname: 'Wonder',
      lastname: 'Woman',
      username: 'wonderwoman',
      email: 'wonderwoman@league.com',
      password: 'goldenlasoo',
    },
  ],
  documents: [

    {
      _id: mongoose.Types.ObjectId('57c975eb2c3d08864b51cd0a'),
      // wonderwoman
      _creatorId: mongoose.Types.ObjectId('57d00913bc185f810bcd0d87'),
      title: 'We should all be feminitsts',
      content: 'Being a female superhero',
      privacy: 'public',
      // Arthur Curry
      sharewith: mongoose.Types.ObjectId('57d05aea1cd5386e0d2ca88a'),
    },

    {
      _id: mongoose.Types.ObjectId('57c975eb2c3d08864b51cd09'),
      // arthur
      _creatorId: mongoose.Types.ObjectId('57d05aea1cd5386e0d2ca88a'),
      title: 'Topology of the Marianas Trench',
      content: 'The Marianas Trench',
      privacy: 'private',
      // Victor Hugo
      sharewith: mongoose.Types.ObjectId('57c94278517ca48c9e5af00f'),
    },
    {
      _id: mongoose.Types.ObjectId('57c975eb2c3d08864b51cd07'),
      // arthur
      _creatorId: mongoose.Types.ObjectId('57d05aea1cd5386e0d2ca88a'),
      title: 'Life underwater',
      content: 'An ode to life underwater',
      privacy: 'public',
    },
    {
      _id: mongoose.Types.ObjectId('57c975eb2c3d08864b51cd08'),
      // Victor Hugo
      _creatorId: mongoose.Types.ObjectId('57c94278517ca48c9e5af00f'),
      title: 'A Tale of Two Cities',
      content: 'The French Revolution',
      privacy: 'public',
    },
    {
      _id: mongoose.Types.ObjectId('57c975eb2c3d08874b51cd08'),
      // Victor Hugo
      _creatorId: mongoose.Types.ObjectId('57c94278517ca48c9e5af00f'),
      title: 'Administrator things',
      content: 'Only for adminnistrators',
      privacy: 'private',
      access: mongoose.Types.ObjectId('55c975eb2c3d08864b51cd08'),
    },
    {
      _id: mongoose.Types.ObjectId('58c175eb2c3d08874b51cd08'),
      // Victor Hugo
      _creatorId: mongoose.Types.ObjectId('57c94278517ca48c9e5af00f'),
      title: 'The Hunchback of Notre Dame',
      content: 'Quasimodo watched the sky awash with brilliant blue..',
      privacy: 'private',
    },
    {
      _id: mongoose.Types.ObjectId('58c175eb1d3d08874b51cd08'),
      // Arthur Curry
      _creatorId: mongoose.Types.ObjectId('57d05aea1cd5386e0d2ca88a'),
      title: 'The population of reef fish globally',
      content: 'The colourful reef fish...',
      // Victor Hugo
      sharewith: mongoose.Types.ObjectId('57c94278517ca48c9e5af00f'),
      privacy: 'private',
    },

  ],

  roles: [
    {
      _id: mongoose.Types.ObjectId('55c975eb2c3d08864b51cd08'),
      title: 'supra-admin',
      permission: 'readWriteDelete',
    },
    {
      _id: mongoose.Types.ObjectId('65c975eb2c3d08864b51cd08'),
      title: 'editor',
      permission: 'readWrite',
    },
    {
      _id: mongoose.Types.ObjectId('45c975eb2c3d08864b51cd08'),
      title: 'viewer',
      permission: 'read',
    },
    {
      _id: mongoose.Types.ObjectId('55c975eb2c3d08864b53cd08'),
      title: 'admin',
      permission: 'readWrite',
    },
  ],
};
