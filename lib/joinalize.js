(function() {
  var JoinedResultFactory, joinAttributes, joinalize, unambiguousAttributes,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  unambiguousAttributes = function(model) {
    var column, result;
    result = [];
    for (column in model.rawAttributes) {
      result.push([model.quoted(column), model.qualified(column)]);
    }
    return result;
  };

  joinAttributes = function(left, right) {
    var attributes;
    attributes = unambiguousAttributes(left).concat(unambiguousAttributes(right));
    return attributes;
  };

  JoinedResultFactory = (function() {

    function JoinedResultFactory(source, target) {
      this.build = __bind(this.build, this);      this.source = source;
      this.target = target;
    }

    JoinedResultFactory.prototype.build = function(values, options) {
      var column, key, result, sourceValues, table, targetValues, value, _ref;
      sourceValues = {};
      targetValues = {};
      for (key in values) {
        value = values[key];
        _ref = key.split('.'), table = _ref[0], column = _ref[1];
        if (table === this.source.tableName) {
          sourceValues[column] = value;
        } else if (table === this.target.tableName) {
          targetValues[column] = value;
        } else {
          throw new Error("Could not find joined result with table name '" + table + "' for result '" + key + "' : '" + value + "'");
        }
      }
      result = {};
      result[this.source.name] = this.source.build(sourceValues, options);
      result[this.target.name] = this.target.build(targetValues, options);
      return result;
    };

    return JoinedResultFactory;

  })();

  /*
  Will automatically add a joining clause if options.where is a map or number (id).
  
  If options.where is an array (a format string), then it must include the joining clause.
  */

  joinalize = function(factory) {
    factory.qualified = function(column) {
      return "" + this.tableName + "." + column;
    };
    factory.quoted = function(column) {
      return "`" + this.tableName + "`.`" + column + "`";
    };
    factory._buildJoinOptions = function(Target, options) {
      var assc, association, attr, name, newWhere, val, _ref, _ref2, _ref3;
      if (options == null) options = {};
      options.attributes = ((_ref = options.attributes) != null ? _ref : []).concat(joinAttributes(this, Target));
      _ref2 = this.associations;
      for (name in _ref2) {
        assc = _ref2[name];
        if (assc.target.tableName === Target.tableName) association = assc;
      }
      if (!(association != null)) {
        throw new Error("Could not find association mapping " + this.name + " to " + Target.name);
      }
      if (typeof options.where !== 'string' && !Array.isArray(options.where)) {
        newWhere = {};
        newWhere[this.qualified(association.identifier)] = {
          join: Target.qualified('id')
        };
        if (typeof options.where === 'object' && !options.where.hasOwnProperty('length')) {
          _ref3 = options.where;
          for (attr in _ref3) {
            val = _ref3[attr];
            newWhere[this.qualified(attr)] = val;
          }
        } else if (typeof options.where === 'number') {
          newWhere[this.qualified('id')] = options.where;
        }
        options.where = newWhere;
      } else if (typeof options.where === 'string') {
        options.where = "(" + options.where + ") AND (" + (this.quoted(association.identifier)) + " = " + (Target.quoted('id')) + ")";
      }
      return options;
    };
    factory.joinTo = function(Target, options) {
      if (options == null) options = {};
      options = this._buildJoinOptions(Target, options);
      return this.QueryInterface.select(new JoinedResultFactory(this, Target), [this.tableName, Target.tableName], options);
    };
    return factory.countJoined = function(Target, options) {
      if (options == null) options = {};
      options.attributes = [['count(*)', 'count']];
      options = this._buildJoinOptions(Target, options);
      factory = {
        build: function(values, options) {
          return parseInt(values.count, 10);
        }
      };
      return this.QueryInterface.select(factory, [this.tableName, Target.tableName], options);
    };
  };

  exports.register = function(sequelize) {
    var model, _i, _len, _ref, _results;
    _ref = sequelize.modelFactoryManager.models;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      model = _ref[_i];
      _results.push(joinalize(model));
    }
    return _results;
  };

}).call(this);
