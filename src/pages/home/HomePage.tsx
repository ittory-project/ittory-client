import { Helmet } from "react-helmet";
import { Home } from "../../components/homePage/Home";

export const HomePage = () => {
    return (
        <div>
            <Helmet>
              <title>Home - My App</title>
              <meta property="og:title" content="잇토리" />
              <meta property="og:description" content="Welcome to the homepage!" />
              <meta property="og:image" content="../public/img/main_logo.svg" />
              <meta property="og:url" content={`${import.meta.env.VITE_FRONT_URL}`} />
            </Helmet>
            <Home />
        </div>
    );
}
