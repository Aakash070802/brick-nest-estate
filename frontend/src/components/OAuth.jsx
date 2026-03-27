import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";

const OAuth = () => {
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const res = await axios.post("http://localhost:5000/api/auth/google", {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });

      const data = res.data;

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return <button onClick={handleGoogleClick}>Continue with Google</button>;
};

export default OAuth;
