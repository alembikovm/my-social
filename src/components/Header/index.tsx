import {
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonSearchbar,
  IonToolbar,
} from "@ionic/react";

import {
  home,
  people,
  planetOutline,
} from "ionicons/icons";

import { useAuth } from "../../hooks/useAuth";

import "./style.css";

const Header = () => {
  const auth = useAuth();

  const signout = () => {
    auth?.signout();
    window.location.href = "/auth";
  };

  return (
    <IonHeader>
      <IonToolbar>
        <div className="toolbar-wrapper">
          <IonButtons slot="start" className="ion-no-padding">
            <IonButton>
              <IonIcon
                className="my-social-logo"
                icon={planetOutline}
                color="primary"
              />

              <IonSearchbar className="ion-hide-lg-down" placeholder="Search" />
            </IonButton>
          </IonButtons>

          <IonGrid>
            <IonRow className="ion-justify-content-end">
              <IonCol size="auto">
                <IonIcon icon={home} />
                <div>Home</div>
              </IonCol>

              <IonCol size="auto">
                <IonIcon icon={people} />
                <div>My Network</div>
              </IonCol>

              <div className="ion-padding-top" onClick={signout}>
                Sign Out
              </div>
            </IonRow>
          </IonGrid>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
