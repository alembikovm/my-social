//@ts-nocheck

import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonImg,
  IonText,
} from "@ionic/react";
import { UserService } from "../../services/UserService";

import "./style.css";
import { avatarImgPath } from "../../utils";
import { createRef, useState } from "react";

const ProfileSummary = () => {
  // const handleOpenProfile = () => (window.location.href = "/");
  const [image, _setImage] = useState(null);

  //@ts-ignore
  const inputFileRef = createRef(null);

  const cleanup = () => {
    //@ts-ignore
    URL.revokeObjectURL(image);
    //@ts-ignore
    inputFileRef.current.value = null;
  };

  const setImage = (newImage: any) => {
    if (image) {
      cleanup();
    }
    _setImage(newImage);
  };

  const handleOnChange = (event: any) => {
    console.log("immmmage");
    event.preventDefault();

    const newImage = event.target?.files?.[0];

    if (newImage) {
      setImage(URL.createObjectURL(newImage));
      UserService.uploadUserImage(event.target?.files?.[0]);
    }
  };

  return (
    <IonCard className="profile-section">
      <div className="backdrop">
        <div className="background-one"></div>
        <div className="half-ellipse"></div>
        <div className="background-two"></div>
        <div className="background-three"></div>
      </div>

      <IonCardHeader className="ion-text-center">
        <IonAvatar
          className="ion-margin-auto"
          style={{ cursor: "pointer" }}
          // onClick={handleOpenProfile}
        >
          <IonImg src={image || avatarImgPath} />
        </IonAvatar>
        <input
          ref={inputFileRef}
          accept="image/*"
          // hidden
          id="avatar-image-upload"
          type="file"
          onChange={handleOnChange}
        />

        <IonCardTitle
          className="ion-margin-top" /*onClick={handleOpenProfile} */
        >
          Marat Alembikov
        </IonCardTitle>
        <IonCardSubtitle>JavaScript Developer</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <div>
          <span> Who viewed your profile </span>

          <IonText color="primary">32</IonText>
        </div>

        <div className="connections">
          <span> Connections </span>

          <IonText color="primary">671</IonText>
        </div>

        <IonCardSubtitle color="dark">Manage your network</IonCardSubtitle>
      </IonCardContent>
    </IonCard>
  );
};

export default ProfileSummary;
