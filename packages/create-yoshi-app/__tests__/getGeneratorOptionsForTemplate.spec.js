const path = require('path');
const getGeneratorOptionsForTemplate = require('../src/getGeneratorOptionsForTemplate');

describe('Get Generator Options for Template', () => {
  const templateWithGeneratorOptions = path.join(__dirname, './__fixtures__/template-with-generator-options/');
  const templateWithoutGeneratorOptions = path.join(__dirname, './__fixtures__/minimal-template/');

  it('should look for the "#generator.options.json" file in the template\'s directory and load it', () => {
    const generatorOptions = getGeneratorOptionsForTemplate(templateWithGeneratorOptions);
    expect(generatorOptions.doNotLint).toBe(true);
  })

  it('should fall back to default values, if no "#generator.options.json" is found in the template\'s directory', () => {
    const generatorOptions = getGeneratorOptionsForTemplate(templateWithoutGeneratorOptions);
    expect(generatorOptions.doNotLint).toBe(false);
  })
});
