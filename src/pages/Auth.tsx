import { useRef, useState } from "react";
import {
  IonButton,
  IonCard,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";

import "./Auth.css";
import { NewUser } from "../models/newUser";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Auth = () => {
  const history = useHistory();
  const formRef = useRef<any>(null);
  const auth = useAuth();
  const [submissionType, setSubmissionType] = useState<"login" | "join">(
    "login"
  );

  const toggleText = () => {
    if (submissionType === "login") {
      setSubmissionType("join");
    } else if (submissionType === "join") {
      setSubmissionType("login");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { current } = formRef;

    if (submissionType === "join") {
      const { firstName, lastName, email, password } = current;

      if (!firstName?.value || !lastName?.value) return;

      const newUser: NewUser = {
        firstName: firstName?.value,
        lastName: lastName?.value,
        email: email?.value,
        password: password?.value,
      };

      await auth?.signup(newUser);

      toggleText();
    } else {
      const { email, password } = current;

      await auth?.signin(email?.value, password?.value);

      history.push("/");
    }
  };

  return (
    <IonContent>
      <div className="titile-container">
        <IonText className="my-social-text">MySocial</IonText>
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
        <IonCard>
          {submissionType === "join" && (
            <>
              <IonItem>
                <IonLabel position="floating">First Name</IonLabel>
                <IonInput type="text" name="firstName" required />
              </IonItem>
              <IonText color="danger">Please enter your First Name.</IonText>
              <IonItem>
                <IonLabel position="floating">Last Name</IonLabel>
                <IonInput type="text" name="lastName" required />
              </IonItem>
              <IonText color="danger">Please enter your Last Name.</IonText>)
            </>
          )}

          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput type="email" name="email" required />
          </IonItem>

          <IonText color="danger">Please enter your email address.</IonText>

          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput type="password" name="password" required />
          </IonItem>
          <IonText color="danger">Please enter your password.</IonText>

          {submissionType === "join" && (
            <p className="terms-and-conditions">
              By clicking Agree & Join you agree to the MySocial &nbsp;
              <IonText color="primary">User Agreement</IonText>
              <IonText color="primary">Primary Policy</IonText>
              <IonText color="primary">Cookie Policy</IonText>
            </p>
          )}

          <IonButton type="submit" shape="round" expand="block">
            Accept & Join
          </IonButton>
        </IonCard>
      </form>

      <div className="toggle-text">
        {submissionType === "login" ? "New to MySocial" : "Already on MySocial"}
        <IonText onClick={toggleText}>
          {submissionType === "login" ? "Join now" : "Sign in"}
        </IonText>
      </div>
    </IonContent>
  );
};

export default Auth;
