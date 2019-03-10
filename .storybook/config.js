import { configure } from '@storybook/react'

function loadStories() {
  require('../src/docs/stories')
}

configure(loadStories, module)
