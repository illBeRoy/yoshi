const { editorUrl, viewerUrl } = require('./dev/sites');

module.exports = {
  startUrl: [editorUrl, viewerUrl],
  servers: {
    cdn: {
      ssl: true,
    },
  },
};
