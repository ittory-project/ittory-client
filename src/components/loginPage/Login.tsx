import styled from 'styled-components';
import { getKakaoCode } from '../../api/config/setToken';

export const Login = () => {
    const kakaoLogin = () => {
        getKakaoCode()
    }

    return (
        <Container>
            <CloseBtn 
                src='/assets/btn_close.png'
            />
            <LoginContainer>
                <Logo src="" alt="Logo" />
                <Desc>{'서비스 설명입니다.'}</Desc>
                <LoginBtn onClick={kakaoLogin}>
                    <Icon src="/assets/kakao_logo.png" alt="Login Icon" />
                    {'카카오로 시작하기'}
                </LoginBtn>
                <LoginDesc>{'로그인하시면 개인정보처리방침과 서비스이용약관에 동의하게 됩니다.'}</LoginDesc>
            </LoginContainer>
        </Container>
    );
};

const Container = styled.div`
    height: 100vh;
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: white;
    position: relative;
`;

const CloseBtn = styled.img`
    height: 24px;
    width: 24px;
    position: absolute;
    top: 20px;
    right: 20px;
`;

const Logo = styled.img`
    width: 236px;
    height: 90px;
    margin-bottom: 20px;
`;

const Desc = styled.div`
    font-size: 18px;
    color: #868E96;
    margin-bottom: 250px;
`;

const Icon = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 8px;
`;

const LoginBtn = styled.button`
    width: 90%;
    max-width: 400px; 
    height: 48px;
    background-color: #fee500;
    color: black;
    border: none;
    border-radius: 5px;
    padding: 0 20px; 
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LoginDesc = styled.div`
    font-size: 14px;
    color: #868E96;
    text-align: center;
    max-width: 400px;
    margin-top: 10px;
`;