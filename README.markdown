Joinalize
=========

An extension to Sequelize which provides functions to execute JOINs between Models.

Currently only supports the MySQL dialect.

The Basics
----------

First, given that two Models are associated with each other (from the Sequelize docs):

    var joinalize = require('joinalize')
    
    var User = sequelize.define('User', {/* ... */})
    var Project = sequelize.define('Project', {/* ... */})
    var Task = sequelize.define('Task', {/* ... */})

    // One-way associations
    Project.hasOne(User)
    
    // Add Joinalize, after your models and associations have been defined
    joinalize.register(sequelize)

You could select the Project and associated User with a single statement:

    Project.joinTo( User, {where: 123} )
    .success( function(projectAndUser) -> {
        // You can access either object
        console.log(projectAndUser.User.firstname)
        if( projectAndUser.Project.id === 123 ) {
            console.log("Success!");
        }
    });

What make it useful is being able to find one Model based on attributes of another 
associated Model:

    User.joinTo( Project, {where: {'firstname': 'Tom'}} )
    .success( function(tomsProjects) -> {
        // ...
    });
