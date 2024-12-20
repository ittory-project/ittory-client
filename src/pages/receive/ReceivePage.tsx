import { Helmet } from "react-helmet";
import Receive from "../../components/receivePage/Receive";
import ThumbnailImg from "../../../public/img/icon_main.svg"

export const ReceivePage = () => {
  return (
    <div>
      <Helmet>
        <title>편지 받기임</title>
        <meta property="og:title" content="잇토리편지받기" />
        <meta property="og:description" content="Welcome to the homepage!" />
        <meta property="og:image" content={ThumbnailImg} />
        <meta property="og:url" content={`${import.meta.env.VITE_FRONT_URL}/receive/:letterId`} />
      </Helmet>
      <Receive />
    </div>
  );
}
