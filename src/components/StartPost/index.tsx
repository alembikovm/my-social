import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonImg,
  IonText,
} from "@ionic/react";
import {
  calendarOutline,
  imageOutline,
  newspaperOutline,
  playSharp,
} from "ionicons/icons";
import PostModal from "../PostModal";
import { useCallback, useState } from "react";
import { avatarImgPath } from "../../utils";

import "./style.css";

const StartPost = () => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <IonCard className="post-section">
      <IonCardHeader>
        <IonAvatar>
          <IonImg src={avatarImgPath} />
        </IonAvatar>

        <IonButton
          shape="round"
          fill="outline"
          color="medium"
          onClick={() => setShowModal(true)}
        >
          <span className="ion-text-left">Start a post</span>
        </IonButton>
      </IonCardHeader>

      <IonCardContent>
        <IonButton color="medium" fill="clear">
          <IonIcon color="secondary" icon={imageOutline} />
          <IonText>Photo</IonText>
        </IonButton>
        <IonButton color="medium" fill="clear">
          <IonIcon color="success" icon={playSharp} />
          <IonText>Video</IonText>
        </IonButton>
        <IonButton color="medium" fill="clear">
          <IonIcon color="warning" icon={calendarOutline} />
          <IonText>Event</IonText>
        </IonButton>
        <IonButton color="medium" fill="clear">
          <IonIcon color="danger" icon={newspaperOutline} />
          <IonText>Write article</IonText>
        </IonButton>
      </IonCardContent>

      <PostModal handleCloseModal={handleCloseModal} showModal={showModal} />
    </IonCard>
  );
};

export default StartPost;
