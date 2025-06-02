import type { Meta, StoryObj } from '@storybook/react-vite';

import { Count } from './Count';

const meta: Meta<typeof Count> = {
  title: 'InvitePage/Count',
  component: Count,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Count>;

export const Default: Story = {
  args: {
    numOfParticipants: 3,
    onSubmit: async () => {},
    setViewCount: () => {},
  },
};

export const Five: Story = {
  args: {
    numOfParticipants: 5,
    onSubmit: async () => {},
    setViewCount: () => {},
  },
};
