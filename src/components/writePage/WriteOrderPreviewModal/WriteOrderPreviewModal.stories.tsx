import { Suspense } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { reactRouterParameters } from 'storybook-addon-remix-react-router';
import styled from 'styled-components';

import {
  MOCK_FIVE_PARTICIPANTS,
  MOCK_PARTICIPANTS_DEFAULT,
  MOCK_SINGLE_PARTICIPANT,
  letterParticipantsApiMocks,
} from '@/mocks/api/letter-participants-api-mocks';

import { WriteOrderPreviewModal } from './WriteOrderPreviewModal';

const Container = styled.div`
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  /* iPhone SE 기준 */
  width: 375px;
  height: 667px;
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
  parameters: {
    msw: {
      handlers: {
        letterParticipants: letterParticipantsApiMocks(
          MOCK_LETTER_ID,
          MOCK_PARTICIPANTS_DEFAULT,
        ),
      },
    },
  },
  args: {
    repeatCount: 1,
    elementCount: 1,
    secondsLeft: 1,
  },
};

export const SingleParticipant: Story = {
  parameters: {
    msw: {
      handlers: {
        letterParticipants: letterParticipantsApiMocks(
          MOCK_LETTER_ID,
          MOCK_SINGLE_PARTICIPANT,
        ),
      },
    },
  },
  args: {
    repeatCount: 1,
    elementCount: 1,
    secondsLeft: 1,
  },
};

export const MaxParticipants: Story = {
  parameters: {
    msw: {
      handlers: {
        letterParticipants: letterParticipantsApiMocks(
          MOCK_LETTER_ID,
          MOCK_FIVE_PARTICIPANTS,
        ),
      },
    },
  },
  args: {
    repeatCount: 1,
    elementCount: 1,
    secondsLeft: 1,
  },
};
