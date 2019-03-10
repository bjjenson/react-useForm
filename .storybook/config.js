import { configure } from '@storybook/react'

function loadStories() {
  require('../src/docs/stories')
  require('../src/docs/stories/basic/BasicForm')
}

configure(loadStories, module)
