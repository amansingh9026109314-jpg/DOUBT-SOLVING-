import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebase";
import { useNavigate } from "react-router-dom";

function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginTeacher = async () => {
    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      // 1️⃣ Firebase Auth login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2️⃣ Get role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        alert("User record not found");
        return;
      }

      const userData = userDoc.data();

      // 3️⃣ Check role
      if (userData.role !== "teacher") {
        alert("Access denied. Not a teacher.");
        return;
      }

      navigate("/teacher-dashboard");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Teacher Login</h2>

      <input
        type="email"
        placeholder="Teacher Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={loginTeacher}>
        Login
      </button>
    </div>
  );
}

export default TeacherLogin;