import { Helmet } from "react-helmet";
import { ReceiveLetter } from "../../components/receivePage/ReceiveLetter";

export const ReceiveLetterPage = () => {
  return (
    <div>
      <Helmet>
        {/* <title>편지 받기임</title>
        <meta property="og:title" content="잇토리편지받기" />
        <meta property="og:description" content="편받페이지" />
        <meta property="og:image" content="../public/img/main_logo.svg" />
        <meta property="og:url" content={`${import.meta.env.VITE_FRONT_URL}/receive/:letterId`} /> */}
      </Helmet>
      <ReceiveLetter />
    </div>
  );
}
