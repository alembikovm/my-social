import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Header from "../components/Header";
import ProfileSummary from "../components/ProfileSummary";

import "./Home.css";

import { useEffect } from "react";
import StartPost from "../components/StartPost";
import AllPosts from "../components/AllPosts";

const Home: React.FC = () => {
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/auth";
    }
  }, []);

  return (
    <IonPage>
      <Header />

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="content-container">
          <ProfileSummary />
          <div className="start-post-container">
            <StartPost />
            <div className="item-divider post-divider"></div>
            <AllPosts />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
