import { useEffect, useState } from "react"; 
//useState → stores data. useEffect → runs code automatically while loading.

import { collection, addDoc, getDocs } from "firebase/firestore";
//addDoc → saves new data. getDocs → reads existing data

import { db } from "../Firebase";


function Doubt() 
{
   const [teachers, setTeachers] = useState([]);
   const [selectedTeacher, setSelectedTeacher] = useState("");
   const [studentName, setStudentName] = useState("");
   const [doubt, setDoubt] = useState("");
   const [loadingTeachers, setLoadingTeachers] = useState(true);

   useEffect(() => {
     fetchTeachers();
   }, []);
   //it'll fetch the teachers as soon as the page loads. [] is a dependency array, means it'll run only once when the component loads.

   const fetchTeachers = async () => {
     
     try{
        const snapshot = await getDocs(collection(db, "teachers"));
        console.log("Snapshot docs:", snapshot.docs);
        // collection(db, "teachers") → points to the teachers collection in your Firebase database.getDocs(...) → fetches all documents in that collection.  await → waits for Firebase to finish fetching before moving to the next line

        //snapshot is a special Firebase object representing all the documents fetched.
        //snapshot.docs → an array of all documents inside that collection.  
        //.map() → loops through each document to convert it into a regular JavaScript object.
        //doc.id → the Firebase-generated unique ID for that teacher.                ...doc.data() → all the actual fields stored in Firebase (like name, subject, etc.).

        const teacherlist = snapshot.docs.map(doc => ({
           id: doc.id,
           ...doc.data()
        }));

        console.log("Fetched teachers:", teacherlist);
        setTeachers(teacherlist);  
        setLoadingTeachers(false); }  //try block closed

        catch (error) {
           console.error("Error fetching teachers:", error);
            setLoadingTeachers(false);
        }
   };


   const submitDoubt = async () => {
      if(
          studentName.trim() === "" ||  selectedTeacher === "" || doubt.trim() === "" ) return; 
        //checking if any of the above is empty, then return. || is logical OR it's checking if any of these conditions are true then the code stops executing.

        try{
           await addDoc(collection(db, "doubts"), {
            studentName,
            teacher: selectedTeacher,
            question: doubt,
            createdAt: new Date()
           });

          setStudentName("");
          setSelectedTeacher("");
          setDoubt("");  //it clears each of the input box after submit.
        } 

        catch (error) {
           console.error("Error submitting doubt:", error);
        }
   };

    return (
      <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>

      <h2>Ask a Doubt</h2>

      <input
        placeholder="Your Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

       <select
         value={selectedTeacher}
         onChange={(e) => setSelectedTeacher(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
       >

        <option value="">Select Teacher</option>

        {loadingTeachers
          ? <option disabled>Loading teachers...</option>
          : teachers.length > 0
            ? teachers.map(t => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.subject})
                </option>
              ))
            : <option disabled>No teachers found</option>
        }
      </select>

      <textarea
        placeholder="Type your doubt..."
        value={doubt}
        onChange={(e) => setDoubt(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={submitDoubt}>
        Submit Doubt
      </button>

      </div>
    );
}

export default Doubt;

