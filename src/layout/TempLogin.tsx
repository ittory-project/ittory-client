import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import { userQuery } from '@/api/queries';

import { accessTokenRepository } from '../api/config/AccessTokenRepository';
import { postLogout, postTemporaryLogin } from '../api/service/AuthService';

export const TempLoginArea = () => {
  const queryClient = useQueryClient();
  const [loginId, setLoginId] = useState('ittory1');

  const handleLoginIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoginId(e.target.value);
  };

  const handleLogin = async (loginId: string) => {
    if (accessTokenRepository.isLoggedIn()) {
      await postLogout();
    }
    const { accessToken } = await postTemporaryLogin(loginId);
    accessTokenRepository.onLogin(accessToken);
    await queryClient.resetQueries(userQuery.myInfo());
  };

  return (
    <RootContainer>
      <div>
        <p>기존 계정은 로그아웃됩니다</p>
        <label>
          아이디 선택
          <Select onChange={handleLoginIdChange}>
            <option value="ittory1">ittory1</option>
            <option value="ittory2">ittory2</option>
            <option value="ittory3">ittory3</option>
            <option value="ittory4">ittory4</option>
            <option value="ittory5">ittory5</option>
          </Select>
        </label>
      </div>

      <button onClick={() => handleLogin(loginId)}>임시 로그인하기</button>
    </RootContainer>
  );
};

export const RootContainer = styled.div`
  display: flex;

  flex-direction: column;

  gap: 16px;
  align-items: center;
  justify-content: center;

  padding: 16px;
  margin-top: 16px;

  color: #666;

  background-color: #f8f9fa;
  border-radius: 16px;
`;

export const Select = styled.select`
  width: 100%;

  padding: 8px;

  color: #666;

  background-color: #f8f9fa;
  border: 2px solid #ccc;
  border-radius: 4px;
`;
