'use strict';

var extend = require('extend-shallow');
var Enquirer = require('enquirer');
var Store = require('data-store');

module.exports = function(config) {
  config = extend({name: 'helper-prompt'}, config);

  return function(name, question, options, cb) {
    var args = [].slice.call(arguments);
    cb = args.pop();

    if (typeof options === 'function') {
      cb = options;
      options = question;
      question = {};
    }

    var store = null;
    if (config.save !== false) {
      store = config.store || new Store(config);
      if (config.path) {
        store.path = config.path;
      }

      var val = store.get(name);
      var opts = extend({}, config, this && this.options);
      if (opts.prompt !== true && val != null && val !== '') {
        cb(null, val);
        return;
      }
    }

    var enquirer = config.enquirer || new Enquirer();
    enquirer.register('confirm', require('prompt-confirm'));
    enquirer.register('checkbox', require('prompt-checkbox'));

    if (typeof question === 'string') {
      question = { message: question };
    }

    enquirer.question(name, Object.assign({default: val}, question, options.hash));
    enquirer.question('save', {
      type: 'confirm',
      message: 'Want to store the answer to skip this prompt next time?',
      transform: function(answer) {
        if (config.save === false) {
          return answer;
        }
        if (answer === true) {
          store.set(name, this.answers[name]);
          console.log('√ saved on "' + name + '" in "' + store.relative + '"');
        } else {
          console.log(' got it, skipping');
        }
        return answer;
      },
      when: function(answers) {
        if (config.save === false) {
          return false;
        }
        var val = answers[name] || '';
        return val.trim() !== '';
      }
    });

    enquirer.prompt(name)
      .then(function() {
        return enquirer.prompt('save');
      })
      .then(function(answers) {
        cb(null, answers[name]);
      })
      .catch(cb);
  };
};
