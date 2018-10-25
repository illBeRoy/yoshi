const fs = require('fs');
const path = require('path');

class GeneratorOptions {
  constructor(data) {
    this.data = data;
  }

  get doNotLint() {
    return this.data.doNotLint || false;
  }
}

module.exports = (templatePath) => {
  let jsonData;
  
  try {
    jsonData = JSON.parse(fs.readFileSync(path.join(templatePath, '#generator.options.json')).toString());
  } catch (err) {
    jsonData = {};
  }

  return new GeneratorOptions(jsonData);
};
