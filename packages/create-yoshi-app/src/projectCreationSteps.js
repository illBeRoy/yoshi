const { defaultProjectCreationSteps, logging } = require('create-wix-app');
const execa = require('execa');
const { log, warn, fail, ask, startLoader, stopLoader, Colors } = logging;

/**
 * Called right after the user selects a template from the registry.
 * Useful when the same template has multiple versions, e.g. `node-library` and `node-library-typescript` in create-yoshi-app.
 * You register the changes by simply mutating the template parameter.
 * @param {{ projectType: string, templatePath: string }} template - the template selected by the user
 */
module.exports.onTemplateSelected = async function(template) {
  await defaultProjectCreationSteps.onTemplateSelected();
  const transpiler = await ask('Choose JavaScript Transpiler', { type: 'select', choices: ['Typescript', 'Babel'] });
  if (transpiler === 'Typescript') {
    template.templatePath = `${template.templatePath}-typescript`;
  }
}

/**
 * Called right before files are being copied from the template's directory.
 * Good for displaying additional information, or maybe asking further questions.
 * This phase may be overwritten or extended by a template's wixbowl.js file.
 */
module.exports.setUp = async function() {
  await defaultProjectCreationSteps.setUp();
}

/**
 * Called after files were copied using the templates engine, and before the "install" command is performed.
 * Good for performing actions in the directory before the install phase (such as git init, or dynamic changes to package.json, etc).
 * This phase may be overwritten or extended by a template's wixbowl.js file.
 */
module.exports.preInstall = async function() {
  await defaultProjectCreationSteps.preInstall();
}

/**
 * This is the install phase of the generator - whether it's "npm install", "bower install",
 * or even "maven clean install", "make" or whatever black magic you want to do - this is where they should go.
 * This phase may be overwritten or extended by a template's wixbowl.js file.
 */
module.exports.install = async function() {
  await defaultProjectCreationSteps.install();
}

/**
 * Called after the project was installed successfully. Perform actions right before
 * displaying the "success" message.
 * This is the right place for post-install actions such as linting.
 * This phase may be overwritten or extended by a template's wixbowl.js file.
 */
module.exports.tearDown = async function() {
  await defaultProjectCreationSteps.tearDown();

  startLoader(`Running ${Colors.command('yoshi lint --fix')}`);
  await execa.shell('npx yoshi lint --fix', { stdio: 'ignore' });
  stopLoader();
  log();

  log('You can run the following commands:');
  log(Colors.command('npm start'), 1);
  log('🚀 Start your app in development mode', 2);
  log(Colors.command('npm test'), 1);
  log('🔬 Run the test runner', 2);
  log(Colors.command('npx yoshi lint'), 1);
  log('✏️ Run the linter', 2);
  log(Colors.command('npx yoshi build'), 1);
  log('🚧 Build your app for production', 2);
  log();

  log('We advise you\'ll start by running the following command from within the project directory:');
  log(Colors.command('npm start'));
  log();

  log('For more information visit https://github.com/wix/yoshi');
  log();
}
