qunit = require('qunit')

{spawn} = require('child_process')

path = require('path')

redirect = (proc) ->
	proc.stderr.pipe(process.stderr)
	proc.stdout.pipe(process.stdout)
	return proc

compile = (src, output, success, error) ->
  coffee = spawn('coffee', ['-c', '-o', output, src])
  coffee.on('exit', (code) ->
    if code is 0
      success?()
    else
      error?()
  )

buildSource = (success, error) ->
  compile(path.join('src','joinalize.coffee'), 'lib', success, error)  

buildTest = (success, error) ->
  compile(path.join('tests','joinalize_tests.coffee'), 'tests', success, error)

task 'build', 'Build JS from Coffeescript', (options) ->
  buildSource()
  
task 'test', 'Run unit tests', (options) ->
  buildSource( ->
    buildTest( ->
      qunit.run(
        code: path.join(__dirname, 'lib', 'joinalize.js')
        tests: path.join(__dirname, 'tests','joinalize_tests.js')
      )
    )
  )
  