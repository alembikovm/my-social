import {
  IonCard,
  IonCardHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
  IonImg,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonCardContent,
} from "@ionic/react";

import { avatarImgPath } from "../../../utils/index";

import "./style.css";

const PopoverList = ({ handleLogOut }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonGrid>
          <IonRow className="ion-align-items-center ion-justify-content-center">
            <IonCol size="auto">
              <IonAvatar style={{ width: "64px", height: "64px" }}>
                <IonImg src={avatarImgPath} />
              </IonAvatar>
            </IonCol>

            <IonCol>
              <IonCardTitle>Marat Alembikov</IonCardTitle>
              <IonCardSubtitle>JavaScript Developer</IonCardSubtitle>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonButton expand="block" size="small" fill="outline" color="primary">
          View Profile
        </IonButton>
      </IonCardHeader>

      <IonCardContent>
        <IonCardSubtitle color="dark">Account</IonCardSubtitle>
        <p className="ion-padding-top">Setting & Privacy</p>
        <p className="ion-padding-top">Help</p>
        <p className="ion-padding-top">Language</p>
      </IonCardContent>

      <div className="item-devider"></div>

      <IonCardContent>
        <IonCardSubtitle color="dark">Manage</IonCardSubtitle>
        <p className="ion-padding-top">Post & Activities</p>
        <p className="ion-padding-top">Job Posting Account</p>
      </IonCardContent>

      <div className="item-devider"></div>

      <IonCardContent>
        <IonCardSubtitle color="dark">Account</IonCardSubtitle>
        <p className="ion-padding-top" onClick={handleLogOut}>
          Sign Out
        </p>
      </IonCardContent>

      <div className="item-devider"></div>
    </IonCard>
  );
};

export default PopoverList;
