'use strict';

var extend = require('extend-shallow');
var Enquirer = require('enquirer');
var Store = require('data-store');

module.exports = function(config) {
  config = extend({name: 'helper-prompt'}, config);

  return function(name, question, options, cb) {
    var store = null;
    var args = [].slice.call(arguments);
    cb = args.pop();

    if (typeof question === 'function') {
      cb = question;
      options = name;
      question = {};
    }

    if (typeof options === 'function') {
      cb = options;
      options = question;
      question = {};
    }

    var enquirer = config.enquirer || new Enquirer();
    enquirer.register('confirm', require('prompt-confirm'));
    enquirer.register('checkbox', require('prompt-checkbox'));

    if (typeof question === 'string') {
      question = { message: question };
    }

    question = Object.assign({default: val, name: name}, question, options.hash);
    name = question.name;
    console.log(question)
    if (config.save !== false) {
      store = config.store || new Store(config);
      if (config.path) {
        store.path = config.path;
      }

      var val = store.get(name);
      var opts = extend({}, question, config, this && this.options);
      if (opts.prompt !== true && val != null && val !== '') {
        cb(null, val);
        return;
      }
    }

    enquirer.question(name, question);
    enquirer.question('save', {
      type: 'confirm',
      message: 'Want to store the answer to skip this prompt next time?',
      transform: function(answer) {
        if (config.save === false) {
          return answer;
        }
        if (answer === true) {
          store.set(name, this.answers[name]);
          if (opts.verbose) {
            console.log('√ saved on "' + name + '" in "' + store.relative + '"');
          }
        } else {
          if (opts.verbose) {
            console.log(' got it, skipping');
          }
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
      .then(function(answers) {
        if (config.save === true) {
          store.set(name, answers[name]);
          return answers;
        }
        return enquirer.prompt('save');
      })
      .then(function(answers) {
        cb(null, answers[name]);
      })
      .catch(cb);
  };
};
