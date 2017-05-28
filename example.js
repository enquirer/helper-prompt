
var prompt = require('./');
var templates = require('templates');
var app = templates();

app.engine('hbs', require('engine-handlebars'));
app.asyncHelper('prompt', prompt({save: false}));

app.create('pages');
app.page('example.hbs', {
  data: {choices: ['a', 'b', 'c']},
  content: 'My name is: {{prompt "What is your name?"}}\nFoo: {{prompt "foo?" type="confirm" default=false}}\nFoo: {{prompt "Letters:" type="checkbox" choices=choices}}'
});

app.render('example.hbs', function(err, view) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(view.contents.toString());
});
