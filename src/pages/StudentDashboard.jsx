import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Firebase";

function StudentDashboard() {
  const [doubts, setDoubts] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [showForm, setShowForm] = useState(false);

  const studentUID = localStorage.getItem("studentUID");
  const studentName = localStorage.getItem("studentName") || "Student";

  const fetchTeachers = async () => {
    const snapshot = await getDocs(collection(db, "teachers"));
    const teacherList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTeachers(teacherList);
  };

  const fetchDoubts = async () => {
    const q = query(
      collection(db, "doubts"),
      where("studentUID", "==", studentUID)
    );
    const snapshot = await getDocs(q);
    const doubtsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDoubts(doubtsList);
  };

  useEffect(() => {
    fetchTeachers();
    fetchDoubts();
  }, []);

  const handleTeacherChange = (teacherId) => {
    setSelectedTeacher(teacherId);
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    if (teacher.subjects && teacher.subjects.length > 1) {
      setSubjects(teacher.subjects);
      setSelectedSubject("");
    } else if (teacher.subjects && teacher.subjects.length === 1) {
      setSubjects(teacher.subjects);
      setSelectedSubject(teacher.subjects[0]);
    } else if (teacher.subject) {
      setSubjects([teacher.subject]);
      setSelectedSubject(teacher.subject);
    }
  };

  const postDoubt = async () => {
    if (!question || !selectedTeacher || !selectedSubject) {
      alert("All fields required");
      return;
    }
    const teacher = teachers.find((t) => t.id === selectedTeacher);
    await addDoc(collection(db, "doubts"), {
      question,
      studentUID,
      studentName,
      teacherName: teacher.name,
      teacherId: selectedTeacher,
      subject: selectedSubject,
      status: "pending",
      answer: "",
      createdAt: serverTimestamp(),
    });
    setQuestion("");
    setSelectedTeacher("");
    setSelectedSubject("");
    setShowForm(false);
    fetchDoubts();
  };

  // --- UPDATED FULL-WIDTH STYLES ---
  const styles = {
    layout: {
      display: "flex",
      width: "100vw", // Use full viewport width
      minHeight: "100vh",
      backgroundColor: "#F0F5FA", // Light blue tint background
      margin: 0,
      padding: 0,
      overflowX: "hidden",
    },
    sidebar: {
      width: "260px",
      backgroundColor: "#FFFFFF",
      borderRight: "1px solid #E2E8F0",
      padding: "30px 20px",
      display: "flex",
      flexDirection: "column",
      position: "fixed", // Keeps sidebar locked
      height: "100vh",
      zIndex: 10,
    },
    main: {
      flex: 1,
      marginLeft: "260px", // Pushes content past the sidebar
      padding: "40px 5%", // Responsive side padding
      width: "calc(100% - 260px)", // Ensures main takes remaining space
      boxSizing: "border-box",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "800",
      color: "#2D60FF", // Bright blue like your screenshot
      margin: 0,
    },
    btnPrimary: {
      backgroundColor: "#2D60FF",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      boxShadow: "0 4px 10px rgba(45, 96, 255, 0.25)",
    },
    statsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "40px",
    },
    statBox: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "15px",
        textAlign: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: "25px",
    },
    doubtCard: {
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      borderLeft: "6px solid #2D60FF", // Accent line
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    badge: (status) => ({
      backgroundColor: status === "resolved" ? "#DCFCE7" : "#FFF7ED",
      color: status === "resolved" ? "#166534" : "#9A3412",
      padding: "4px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "700",
      textTransform: "uppercase",
    }),
    formCard: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "16px",
        marginBottom: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    },
    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #E2E8F0",
        marginBottom: "15px",
        fontSize: "15px",
        outline: "none",
    }
  };

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={{ color: "#2D60FF", marginBottom: "40px" }}>Learnify</h2>
        <div style={{ fontWeight: "600", color: "#2D60FF", background: "#F0F5FA", padding: "12px", borderRadius: "8px" }}>📊 Dashboard</div>
        <div style={{ padding: "12px", color: "#718096", marginTop: "10px" }}>📚 My Courses</div>
        <div style={{ padding: "12px", color: "#718096" }}>⚙️ Settings</div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Student Dashboard</h1>
          <button 
            style={{...styles.btnPrimary, backgroundColor: showForm ? "#EDF2F7" : "#2D60FF", color: showForm ? "#4A5568" : "white"}} 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Cancel" : "+ New Doubt"}
          </button>
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
            <div style={styles.statBox}>
                <p style={{color: "#718096", margin: 0}}>Total Doubts</p>
                <h2 style={{margin: "10px 0", color: "#2D3748"}}>{doubts.length}</h2>
            </div>
            <div style={styles.statBox}>
                <p style={{color: "#718096", margin: 0}}>Pending</p>
                <h2 style={{margin: "10px 0", color: "#C05621"}}>{doubts.filter(d => d.status !== 'resolved').length}</h2>
            </div>
            <div style={styles.statBox}>
                <p style={{color: "#718096", margin: 0}}>Resolved</p>
                <h2 style={{margin: "10px 0", color: "#2F855A"}}>{doubts.filter(d => d.status === 'resolved').length}</h2>
            </div>
        </div>

        {/* FORM SECTION */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={{marginTop: 0, marginBottom: "20px"}}>Ask a Question</h3>
            <div style={{display: "flex", gap: "20px"}}>
                <select style={styles.input} value={selectedTeacher} onChange={(e) => handleTeacherChange(e.target.value)}>
                    <option value="">Select Teacher</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <div style={{flex: 1}}>
                    {subjects.length > 1 ? (
                        <select style={styles.input} value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                            <option value="">Select Subject</option>
                            {subjects.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
                        </select>
                    ) : (
                        <input disabled style={{...styles.input, background: "#F7FAFC"}} value={selectedSubject || "Subject"} />
                    )}
                </div>
            </div>
            <textarea 
                style={{...styles.input, minHeight: "120px", fontFamily: "inherit"}} 
                placeholder="What are you struggling with?" 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
            />
            <button style={styles.btnPrimary} onClick={postDoubt}>Submit Doubt</button>
          </div>
        )}

        <h3 style={{ color: "#4A5568", marginBottom: "20px" }}>Recent Activity</h3>

        {/* DOUBT GRID */}
        <div style={styles.cardGrid}>
          {doubts.map((doubt) => (
            <div key={doubt.id} style={styles.doubtCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <span style={{ fontSize: "18px", fontWeight: "700", color: "#1A202C" }}>{doubt.subject}</span>
                <span style={styles.badge(doubt.status)}>{doubt.status}</span>
              </div>
              
              <p style={{ color: "#4A5568", fontSize: "15px", lineHeight: "1.6", margin: "10px 0" }}>{doubt.question}</p>
              
              <div style={{ borderTop: "1px solid #EDF2F7", paddingTop: "15px", marginTop: "5px", fontSize: "14px", color: "#718096" }}>
                Mentor: <b style={{ color: "#2D3748" }}>{doubt.teacherName}</b>
              </div>

              {doubt.status === "resolved" && (
                <button 
                    style={{ background: "#F0F5FA", border: "none", color: "#2D60FF", padding: "10px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", marginTop: "10px" }}
                    onClick={() => alert(doubt.answer)}
                >
                  View Solution
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;