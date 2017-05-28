# helper-prompt [![NPM version](https://img.shields.io/npm/v/helper-prompt.svg?style=flat)](https://www.npmjs.com/package/helper-prompt) [![NPM monthly downloads](https://img.shields.io/npm/dm/helper-prompt.svg?style=flat)](https://npmjs.org/package/helper-prompt) [![NPM total downloads](https://img.shields.io/npm/dt/helper-prompt.svg?style=flat)](https://npmjs.org/package/helper-prompt)

> Async helper that prompts the user for input then uses the answers to render templates. Must be registered with a library that supports async helpers, like assemble or generate. After that it should work with handlebars, lo-dash or any other node.js engine that supports helper functions.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save helper-prompt
```

## How it works

1. Prompts you for input
2. If "answered", a second prompt asks if you want to save the answer (this can be skipped)
3. If "yes", the answer is persisted to a [local data store](#data-store), and the prompt will be skipped the next time the same question is asked.

This is really simple and basic at the moment, it would probably be good to keep it that way. There are lots of interesting things we can do with prompts and templates, but it would be better to do those things with custom implementations.

## Usage

Register as an async helper with [assemble](https://github.com/assemble/assemble), [generate](https://github.com/generate/generate), [templates](https://github.com/jonschlinkert/templates) or any library that uses [async-helpers](https://github.com/doowb/async-helpers).

```js
var prompt = require('helper-prompt');
var assemble = require('assemble');
var app = assemble();

// "app" can be any of the mentioned libraries above
app.asyncHelper('prompt', prompt());
```

## Example

```js
var templates = require('templates');
var app = templates();

app.engine('hbs', require('engine-handlebars'));
app.asyncHelper('prompt', prompt({save: false}));

app.create('pages');
app.page('example.hbs', 'My name is: {{prompt "What is your name?"}}');

app.render('example.hbs', function(err, view) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(view.contents.toString());
  //=> 'My name is: Jon'
});
```

## Prompt types

Currently only the following prompt types are supported:

* [prompt-text](https://github.com/enquirer/prompt-text)
* [prompt-checkbox](https://github.com/enquirer/prompt-checkbox)
* [prompt-confirm](https://github.com/enquirer/prompt-confirm)

Any prompt options may be defined using hash arguments.

## Options

### options.save

**Type**: `boolean`

**Default**: `undefined`

By default, you will be prompted to confirm whether or not an answer value should be persisted. You can disable this by setting `options.save` to false.

```js
var prompt = require('helper-prompt');
var assemble = require('assemble');
var app = assemble();

app.asyncHelper('prompt', prompt({save: false}));
```

### options.prompt

**Type**: `boolean`

**Default**: `undefined`

Don't skip the prompt, regardless of whether or not the answer was persisted. This is especially useful when `argv` is passed to helper options.

This is different from `save` in that it forces the prompt to be presented, it does not have any effect on whether or not the answer value is persisted.

```js
var prompt = require('helper-prompt');
var minimist = require('minimist')(process.argv.slice(2));
var assemble = require('assemble');
var app = assemble();

// $ your-app --prompt
app.asyncHelper('prompt', prompt(argv));
```

## Data store

Answer values are persisted using [data-store](https://github.com/jonschlinkert/data-store). Options are passed to that library, so you'll need to visit the data-store docs to see all available options and features.

Here is an example of how to change the path of the data store:

```js
// persist answers to a local folder in "data/prompt-answers.json"
prompt({path: 'data/prompt-answers.json'});
```

## About

### Related projects

* [enquirer](https://www.npmjs.com/package/enquirer): Intuitive, plugin-based prompt system for node.js. Much faster and lighter alternative to Inquirer, with all… [more](https://github.com/enquirer/enquirer) | [homepage](https://github.com/enquirer/enquirer "Intuitive, plugin-based prompt system for node.js. Much faster and lighter alternative to Inquirer, with all the same prompt types and more, but without the bloat.")
* [prompt-base](https://www.npmjs.com/package/prompt-base): Base prompt module used for creating custom prompts. | [homepage](https://github.com/enquirer/prompt-base "Base prompt module used for creating custom prompts.")
* [prompt-checkbox](https://www.npmjs.com/package/prompt-checkbox): Multiple-choice/checkbox prompt. Can be used standalone or with a prompt system like [Enquirer]. | [homepage](https://github.com/enquirer/prompt-checkbox "Multiple-choice/checkbox prompt. Can be used standalone or with a prompt system like [Enquirer].")
* [prompt-confirm](https://www.npmjs.com/package/prompt-confirm): Confirm (yes/no) prompt. Can be used standalone or with a prompt system like [Enquirer]. | [homepage](https://github.com/enquirer/prompt-confirm "Confirm (yes/no) prompt. Can be used standalone or with a prompt system like [Enquirer].")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for advice on opening issues, pull requests, and coding standards.

### Building docs

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on May 28, 2017._