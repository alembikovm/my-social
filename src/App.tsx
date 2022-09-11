import { Redirect, Route, useHistory } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { ProvideAuth } from "./hooks/useAuth";
import { PostsStore } from "./store/posts";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import ConnectionProfile from "./components/ConnectionProfile";

import { Post } from "./models/post";
import { createContext, useContext } from "react";

setupIonicReact();
const PostContext = createContext<PostsStore>({} as PostsStore);
export const usePostStore = (): PostsStore => useContext(PostContext);

const App: React.FC = () => {
  return (
    <ProvideAuth>
      <PostContext.Provider value={new PostsStore()}>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route exact path="/" component={Home}></Route>
              <Route path="/:id" component={ConnectionProfile} />
              <Route exact path="/auth">
                <Auth />
              </Route>
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </PostContext.Provider>
    </ProvideAuth>
  );
};

export default App;
