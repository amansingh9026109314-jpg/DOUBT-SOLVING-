import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase";

function StudentRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerStudent = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2️⃣ Create entry in 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "student",
        createdAt: new Date(),
      });

      // 3️⃣ Create entry in 'students' directory
      await setDoc(doc(db, "students", user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

      alert("Student registered successfully!");
      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Student Registration</h2>

      <input
        type="text"
        placeholder="Student Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Student Email"
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

      <button onClick={registerStudent}>
        Register Student
      </button>
    </div>
  );
}

export default StudentRegister;