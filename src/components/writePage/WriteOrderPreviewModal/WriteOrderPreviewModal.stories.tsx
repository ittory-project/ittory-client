import { Suspense } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { reactRouterParameters } from 'storybook-addon-remix-react-router';
import styled from 'styled-components';

import {
  MOCK_PARTICIPANTS_DEFAULT,
  letterParticipantsApiMocks,
} from '@/mocks/api/letter-participants-api-mocks';

import { WriteOrderPreviewModal } from './WriteOrderPreviewModal';

const Container = styled.div`
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
`;

const MOCK_LETTER_ID = 1;

const meta: Meta<typeof WriteOrderPreviewModal> = {
  title: 'WritePage/WriteOrderPreviewModal',
  component: WriteOrderPreviewModal,
  decorators: [
    (Story) => (
      <Suspense>
        <Container>
          <Story />
        </Container>
      </Suspense>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        letterParticipantsApiMocks(MOCK_LETTER_ID, MOCK_PARTICIPANTS_DEFAULT),
      ],
    },
    layout: 'fullscreen',
    reactRouter: reactRouterParameters({
      routing: {
        path: `/write/:letterId`,
      },
      location: {
        pathParams: {
          letterId: MOCK_LETTER_ID,
        },
      },
    }),
  },
};

export default meta;
type Story = StoryObj<typeof WriteOrderPreviewModal>;

export const Default: Story = {
  args: {
    repeatCount: 2,
    elementCount: 6,
    secondsLeft: 30,
  },
};

export const SingleParticipant: Story = {
  args: {
    repeatCount: 3,
    elementCount: 3,
    secondsLeft: 15,
  },
};

export const ManyParticipants: Story = {
  args: {
    repeatCount: 2,
    elementCount: 12,
    secondsLeft: 45,
  },
};

export const ParticipantsWithoutImages: Story = {
  args: {
    repeatCount: 1,
    elementCount: 3,
    secondsLeft: 60,
  },
};

export const HighRepeatCount: Story = {
  args: {
    repeatCount: 5,
    elementCount: 15,
    secondsLeft: 10,
  },
};

export const AlmostStarting: Story = {
  args: {
    repeatCount: 2,
    elementCount: 6,
    secondsLeft: 3,
  },
};
