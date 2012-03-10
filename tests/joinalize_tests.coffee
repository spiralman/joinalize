module = QUnit.module;

class Source
  associations:
    targets:
      target: tableName: 'TargetTable'
      identifier: 'TargetID'
  name: 'Source'

class Target
  tableName: 'TargetTable'
  name: 'Target'

class sequelize
  modelFactoryManager: 
    models: []
    
  constructor: (Source, Target) ->
    this.modelFactoryManager.models = [Source, Target]

constructModels = (module) ->
  module.Source = new Source()
  module.Target = new Target()
  module.sequelize = new sequelize(module.Source, module.Target)
  
module('Mixins',
  setup: ->
    constructModels( this )
    register(this.sequelize)
)

test( 'Models get quoted function', ->
  ok( this.Source.hasOwnProperty('quoted'), 'Source has quoted method' )
  ok( this.Target.hasOwnProperty('quoted'), 'Target has quoted method' )
)

