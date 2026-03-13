import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../Firebase";

function TeacherRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subjects, setSubjects] = useState("");

  const registerTeacher = async () => {
    if (!name || !email || !password || !subjects) {
      alert("All fields are required");
      return;
    }

    try {
      // 🔥 1. Create Authentication Account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );

      const user = userCredential.user;

      // convert comma separated subjects into array
      const subjectsArray = subjects.split(",").map(s => s.trim());

      // 🔥 2. Add in users collection
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "teacher",
        createdAt: serverTimestamp(),
      });

      // 🔥 3. Add in teachers collection
      await setDoc(doc(db, "teachers", user.uid), {
        name,
        email,
        subjects: subjectsArray, // important
        approved: true,
        createdAt: serverTimestamp(),
      });

      alert("Teacher registered successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setSubjects("");

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Teacher Registration</h2>

      <input
        type="text"
        placeholder="Teacher Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

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

      <input
        type="text"
        placeholder="Subjects (comma separated e.g. DSA, DBMS)"
        value={subjects}
        onChange={(e) => setSubjects(e.target.value)}
      />

      <br /><br />

      <button onClick={registerTeacher}>
        Register Teacher
      </button>
    </div>
  );
}

export default TeacherRegister;