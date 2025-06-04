// FIXME: 'React' refers to a UMD global, but the current file is a module. Consider adding an import instead.
/** @jsxImportSource react */
import type { Preview } from '@storybook/react';
import { initialize as initializeMSW, mswLoader } from 'msw-storybook-addon';
import {
  reactRouterParameters,
  withRouter,
} from 'storybook-addon-remix-react-router';

import { ignoreDevResources } from '../src/mocks';
import { ReactQueryClientProvider } from '../src/react-query-provider';

initializeMSW({
  onUnhandledRequest: ignoreDevResources,
});

const preview: Preview = {
  decorators: [
    withRouter,
    (Story) => (
      <ReactQueryClientProvider>
        <Story />
      </ReactQueryClientProvider>
    ),
  ],
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    reactRouter: reactRouterParameters({
      routing: {
        useStoryElement: true,
        path: '*',
      },
    }),
  },
};

export default preview;
