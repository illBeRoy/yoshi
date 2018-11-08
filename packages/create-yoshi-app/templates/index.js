const fs = require('fs');

module.exports = fs.readdirSync(__dirname).filter(projectType => !projectType.endsWith('-typescript'));
