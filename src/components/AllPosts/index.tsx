import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonRow,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  createOutline,
  ellipse,
  globeOutline,
  trashOutline,
} from "ionicons/icons";
import { observer } from "mobx-react-lite";

import React, { useCallback, useEffect, useState } from "react";
import { avatarImgPath } from "../../utils";
import { Post } from "../../models/post";
import "./style.css";
import { PostService } from "../../services/PostService";
import { useAuth } from "../../hooks/useAuth";
import { usePostStore } from "../../App";
import { PostsStore } from "../../store/posts";
import PostModal from "../PostModal";

const AllPosts = observer(() => {
  const postStore: PostsStore = usePostStore();
  const { posts } = postStore;
  const [showModal, setShowModal] = useState(false);
  const [skip, setSkip] = useState(0);
  const [updatedPost, setUpdatedPost] = useState<{
    postId: number;
    postBody: string;
  }>();

  console.log({ updatedPost });

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setUpdatedPost(undefined);
  }, []);

  const auth = useAuth();

  const pushPosts = async () => {
    setSkip((skip) => skip + 5);

    await postStore.getPosts(skip);
  };

  async function fetchPosts(ev: any) {
    pushPosts();
    ev.target.complete();
  }

  useIonViewWillEnter(() => {
    pushPosts();
  });

  const hadleDeletePost = (postId: number) => {
    try {
      PostService.deletePost(postId);
    } catch (error) {
      console.error("Error, can't delete post");
      return;
    }

    posts.filter((currentPost: { id: number }) => currentPost.id !== postId);
  };

  const handleUpdatePost = (postId: number, postBody: string) => {
    setShowModal(true);
    setUpdatedPost({ postId, postBody });
  };

  return (
    <div className="all-posts-container">
      <IonContent>
        <IonList>
          {posts.length &&
            posts.map((post) => (
              <IonCard key={post?.id}>
                <IonGrid>
                  <IonRow className="ion-align-items-center ion-justify-content-center">
                    <IonCol size="auto" className="ion-padding">
                      <IonAvatar>
                        <IonImg src={avatarImgPath}></IonImg>
                      </IonAvatar>
                    </IonCol>

                    <IonCol>
                      <div className="full-name">Marat Alembikov</div>
                      <div className="role">JavaScript Developer</div>
                      <div className="meta-data">
                        1d <IonIcon icon={ellipse}></IonIcon> Edited
                        <IonIcon icon={ellipse}></IonIcon>
                        <IonIcon color="dark" icon={globeOutline}></IonIcon>
                      </div>
                    </IonCol>

                    {Number(auth?.user?.id) === post?.author && (
                      <IonCol
                        style={{ marginTop: "-32px", textAlign: "right" }}
                      >
                        <IonIcon
                          style={{ fontSize: "18px", cursor: "pointer" }}
                          color="dark"
                          icon={createOutline}
                          onClick={() => handleUpdatePost(post.id, post.body)}
                        />

                        <IonIcon
                          style={{ fontSize: "18px", cursor: "pointer" }}
                          color="danger"
                          icon={trashOutline}
                          onClick={() => hadleDeletePost(post?.id)}
                        />
                      </IonCol>
                    )}
                  </IonRow>
                  <p className="post-body">{post?.body} </p>
                </IonGrid>
              </IonCard>
            ))}
        </IonList>

        <IonInfiniteScroll onIonInfinite={fetchPosts} threshold="100px">
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more data..."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>

      <PostModal
        handleCloseModal={handleCloseModal}
        showModal={showModal}
        isUpdate
        post={updatedPost}
      />
    </div>
  );
});

export default AllPosts;
