import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';

import {
  MOCK_FIVE_PARTICIPANTS,
  MOCK_PARTICIPANTS_DEFAULT,
  MOCK_SINGLE_PARTICIPANT,
} from '@/mocks';

import { WriteOrderPopover } from './WriteOrderPopover';

const Container = styled.div`
  position: relative;

  width: 300px;
  height: 300px;
`;

const meta: Meta<typeof WriteOrderPopover> = {
  title: 'WritePage/WriteOrderPopover',
  component: WriteOrderPopover,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
  argTypes: {
    writeOrderList: {
      control: 'object',
      description: '편지 참여자 목록',
    },
    onClose: {
      action: 'closed',
      description: '팝오버 닫기 함수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof WriteOrderPopover>;

export const Default: Story = {
  args: {
    writeOrderList: MOCK_PARTICIPANTS_DEFAULT.participants,
  },
};

export const SingleParticipant: Story = {
  args: {
    writeOrderList: MOCK_SINGLE_PARTICIPANT.participants,
  },
};

export const FiveParticipants: Story = {
  args: {
    writeOrderList: MOCK_FIVE_PARTICIPANTS.participants,
  },
};
