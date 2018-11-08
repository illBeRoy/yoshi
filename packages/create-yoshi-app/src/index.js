#! /usr/bin/env node
const { createApp, registry } = require('create-wix-app');
const projectCreationSteps = require('./projectCreationSteps');
const path = require('path');

const templatesRegistry = registry.aLocalRegistry(path.resolve(__dirname, '../templates'));
createApp('create-yoshi-app', templatesRegistry, projectCreationSteps);
