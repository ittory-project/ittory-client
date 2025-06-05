import type { Meta, StoryObj } from '@storybook/react-vite';

import { CountWheelPicker } from './CountWheelPicker';

const meta: Meta<typeof CountWheelPicker> = {
  title: 'InvitePage/CountWheelPicker',
  component: CountWheelPicker,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof CountWheelPicker>;

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
