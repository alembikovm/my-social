import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  IonAvatar,
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonModal,
  IonRow,
  IonText,
  IonTextarea,
} from "@ionic/react";
import {
  add,
  calendarOutline,
  caretDownOutline,
  chatbox,
  chatboxEllipsesOutline,
  closeOutline,
  globeOutline,
  imageOutline,
  playSharp,
} from "ionicons/icons";
import { avatarImgPath } from "../../utils";

import "./style.css";
import { Post } from "../../models/post";
import { usePostStore } from "../../App";
import { observer } from "mobx-react-lite";

interface Props {
  showModal: boolean;
  handleCloseModal: () => void;
  isUpdate?: boolean;
  post?: {
    postId: number;
    postBody: string;
  };
}

const PostModal = observer(
  ({ showModal, handleCloseModal, isUpdate, post }: Props) => {
    const [textMessage, setTextMessage] = useState("");

    useEffect(() => {
      if (post?.postBody) {
        setTextMessage(post?.postBody);
      }
    }, [post?.postBody]);

    const postStore = usePostStore();

    console.log(textMessage);

    const handleChangeMessageText = useCallback((event) => {
      setTextMessage(event.target.value);
    }, []);

    const handleMessageSubmit = async (e: any) => {
      e.preventDefault();
      if (isUpdate) {
        await postStore.updatePost(post?.postId as number, textMessage);
      } else {
        await postStore.createPost(textMessage);
      }
      await postStore.refreshPosts();

      handleCloseModal();
    };

    return (
      <div className="postModal">
        <IonModal isOpen={showModal} className="my-custom-class2">
          <div>
            <div className="heading ion-padding">
              <IonText>{`${isUpdate ? "Update" : "Create"} a post`}</IonText>
              <IonButton
                onClick={handleCloseModal}
                size="small"
                fill="clear"
                color="dark"
                shape="round"
              >
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>
            <div className="item-divider"></div>

            <IonGrid className="ion-padding">
              <IonRow className="ion-justify-content-start">
                <IonCol size="auto">
                  <IonAvatar>
                    <IonImg src={avatarImgPath} />
                  </IonAvatar>
                </IonCol>

                <IonCol>
                  <div>
                    <IonText className="username">Marat Alembikov</IonText>
                  </div>

                  <IonButton size="small" shape="round" fill="outline">
                    <IonIcon color="dark" icon={globeOutline} />
                    <IonText className="view-status">Anyone </IonText>
                    <IonIcon color="dark" icon={caretDownOutline} />
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>

            <form className="ion-padding" onSubmit={handleMessageSubmit}>
              <IonTextarea
                rows={5}
                placeholder="What do you want to talk about?"
                name="body"
                onInput={handleChangeMessageText}
                required
                value={textMessage}
              />

              <div className="action-items">
                <IonButton
                  disabled={!textMessage}
                  className="ion-margin"
                  type="submit"
                >
                  {`${isUpdate ? "Edit" : "Post"} `}
                </IonButton>
              </div>
            </form>
          </div>
        </IonModal>
      </div>
    );
  }
);

export default PostModal;
