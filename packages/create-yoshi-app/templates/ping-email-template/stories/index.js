import { storiesOf } from '@storybook/react';
import { anEmailTemplateStory } from 'ping-email-templates-storybook';

storiesOf('Hello World Template', module)
  .add('English', anEmailTemplateStory('helloWorld')
    .withLocale('en')
    .withParams({ name: '{%authorName%}' })
    .build());
