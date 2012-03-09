Joinalize
=========

An extension to Sequelize which provides functions to execute JOINs between Models.

Currently only supports the MySQL dialect.

The Basics
----------

First, given that two Models are associated with each other (from the Sequelize docs):

    var Joinalize = require('joinalize')
    
    var User = sequelize.define('User', {/* ... */})
    var Project = sequelize.define('Project', {/* ... */})
    var Task = sequelize.define('Task', {/* ... */})

    // One-way associations
    Project.hasOne(User)
    
    // Add Joinalize, after your models and associations have been defined
    Joinalize.register(sequelize)

You could select the Project and associated User with a single statement:

    var projectAndUser = Project.joinTo( User, {where: 123} );
    
    // You can access either object
    console.log(projectAndUser.User.firstname)
    if( projectAndUser.Project.id === 123 ) {
        console.log("Success!");
    }

What make it useful is being able to filter one Model based on attributes of an 
associated Model:

    var tomsProject = User.joinTo( Project, {where: {'firstname': 'Tom'}} );
