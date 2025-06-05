import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';

import {
  MOCK_ELEMENTS_ALL_COMPLETED,
  MOCK_ELEMENTS_MIXED,
  MOCK_ELEMENTS_SINGLE,
} from '@/mocks';

import { WriteOrderList } from './WriteOrderList';

const Container = styled.div`
  display: flex;

  flex-direction: column;

  width: 400px;
  height: calc(var(--vh, 1vh) * 100);

  padding: 10px 20px;

  overflow: auto;

  background-color: #212529;
`;

const meta: Meta<typeof WriteOrderList> = {
  title: 'WritePage/WriteOrderList',
  component: WriteOrderList,
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
  tags: ['autodocs'],
  argTypes: {
    elements: {
      control: 'object',
      description: '편지 순서 엘리먼트 목록',
    },
    isMyTurnToWrite: {
      control: 'boolean',
      description: '현재 사용자의 작성 차례 여부',
    },
    nowElementRef: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WriteOrderList>;

export const MyTurnToWrite: Story = {
  args: {
    elements: MOCK_ELEMENTS_MIXED,
    isMyTurnToWrite: true,
  },
};

export const NotMyTurnToWrite: Story = {
  args: {
    elements: MOCK_ELEMENTS_MIXED,
    isMyTurnToWrite: false,
  },
};

export const SingleCurrentElement: Story = {
  args: {
    elements: MOCK_ELEMENTS_SINGLE,
    isMyTurnToWrite: true,
  },
};

export const MaxElements: Story = {
  args: {
    elements: MOCK_ELEMENTS_ALL_COMPLETED,
    isMyTurnToWrite: false,
  },
};
