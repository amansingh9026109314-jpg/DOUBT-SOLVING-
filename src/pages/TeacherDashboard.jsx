import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../Firebase";

function TeacherDashboard() {
  const [doubts, setDoubts] = useState([]);

  const fetchDoubts = async () => {
    const querySnapshot = await getDocs(collection(db, "doubts"));
    const doubtsArray = querySnapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
    setDoubts(doubtsArray);
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  const handleAnswerChange = (id, value) => {
    setDoubts((prev) =>
      prev.map((doubt) =>
        doubt.id === id ? { ...doubt, answer: value } : doubt
      )
    );
  };

  const resolveDoubt = async (id, answerText) => {
    if (!answerText || answerText.trim() === "") {
      alert("Please write an answer before resolving.");
      return;
    }
    const doubtRef = doc(db, "doubts", id);
    await updateDoc(doubtRef, {
      answer: answerText,
      status: "resolved",
      resolvedAt: new Date(),
    });
    alert("Doubt resolved successfully!");
    fetchDoubts();
  };

  const pendingDoubts = doubts.filter((d) => d.status === "pending");
  const resolvedDoubts = doubts.filter((d) => d.status === "resolved");

  // --- MODERN TEACHER UI STYLES ---
  const styles = {
    layout: {
      display: "flex",
      width: "100vw",
      minHeight: "100vh",
      backgroundColor: "#F8FAFC",
      fontFamily: "'Inter', sans-serif",
    },
    sidebar: {
      width: "280px",
      backgroundColor: "#1E293B", // Darker sidebar for Teacher portal
      color: "white",
      padding: "40px 24px",
      position: "fixed",
      height: "100vh",
    },
    main: {
      flex: 1,
      marginLeft: "280px",
      padding: "40px 50px",
      width: "calc(100% - 280px)",
      boxSizing: "border-box",
    },
    header: {
      marginBottom: "40px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr", // Split view for work efficiency
      gap: "30px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#475569",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      border: "1px solid #E2E8F0",
    },
    studentInfo: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "15px",
    },
    badge: {
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: "#F1F5F9",
      color: "#64748B",
    },
    textarea: {
      width: "100%",
      padding: "15px",
      borderRadius: "12px",
      border: "1px solid #CBD5E1",
      fontSize: "14px",
      fontFamily: "inherit",
      marginTop: "15px",
      resize: "vertical",
      boxSizing: "border-box",
      outline: "none",
    },
    btnResolve: {
      backgroundColor: "#10B981",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "15px",
      width: "100%",
      transition: "background 0.2s",
    },
    answerText: {
      backgroundColor: "#F8FAFC",
      padding: "15px",
      borderRadius: "10px",
      fontSize: "14px",
      color: "#334155",
      borderLeft: "4px solid #10B981",
      marginTop: "10px",
    }
  };

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={{ color: "#38BDF8", marginBottom: "40px", fontSize: "24px" }}>Learnify</h2>
        <div style={{ color: "#94A3B8", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Instructor View</div>
        <div style={{ marginTop: "30px", fontWeight: "600", color: "#38BDF8", display: "flex", alignItems: "center", gap: "10px" }}>📝 All Doubts</div>
        <div style={{ marginTop: "20px", color: "#94A3B8", cursor: "pointer" }}>📊 Performance</div>
        <div style={{ marginTop: "20px", color: "#94A3B8", cursor: "pointer" }}>👤 Profile</div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={{ color: "#1E293B", fontSize: "32px", margin: 0 }}>Teacher Dashboard</h1>
          <p style={{ color: "#64748B", marginTop: "5px" }}>Manage and respond to student inquiries in real-time.</p>
        </header>

        <div style={styles.grid}>
          
          {/* LEFT: PENDING SECTION */}
          <div>
            <h3 style={styles.sectionTitle}>
              <span style={{ color: "#F59E0B" }}>●</span> Pending Doubts ({pendingDoubts.length})
            </h3>
            
            {pendingDoubts.length === 0 && (
              <div style={{...styles.card, textAlign: 'center', color: '#94A3B8'}}>All caught up! No pending doubts.</div>
            )}

            {pendingDoubts.map((doubt) => (
              <div key={doubt.id} style={styles.card}>
                <div style={styles.studentInfo}>
                  <span style={{fontWeight: '700', color: '#1E293B'}}>{doubt.studentName}</span>
                  <span style={styles.badge}>{doubt.subject}</span>
                </div>
                
                <p style={{fontSize: '15px', color: '#475569', lineHeight: '1.5'}}>
                  <span style={{color: '#94A3B8', fontWeight: '600'}}>Q:</span> {doubt.question}
                </p>

                <textarea
                  placeholder="Type your explanation here..."
                  value={doubt.answer || ""}
                  onChange={(e) => handleAnswerChange(doubt.id, e.target.value)}
                  rows="4"
                  style={styles.textarea}
                />

                <button 
                  style={styles.btnResolve}
                  onClick={() => resolveDoubt(doubt.id, doubt.answer)}
                >
                  Send Answer
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT: RESOLVED SECTION */}
          <div>
            <h3 style={styles.sectionTitle}>
              <span style={{ color: "#10B981" }}>●</span> Resolved History
            </h3>

            {resolvedDoubts.length === 0 && (
              <div style={{...styles.card, textAlign: 'center', color: '#94A3B8'}}>No history available yet.</div>
            )}

            {resolvedDoubts.map((doubt) => (
              <div key={doubt.id} style={{...styles.card, opacity: 0.9}}>
                <div style={styles.studentInfo}>
                  <span style={{fontWeight: '700', color: '#1E293B'}}>{doubt.studentName}</span>
                  <span style={{...styles.badge, backgroundColor: '#DCFCE7', color: '#166534'}}>Solved</span>
                </div>
                
                <p style={{fontSize: '14px', color: '#64748B', marginBottom: '10px'}}>
                  <strong>Subject:</strong> {doubt.subject}
                </p>

                <p style={{fontSize: '14px', color: '#1E293B', fontStyle: 'italic'}}>"{doubt.question}"</p>
                
                <div style={styles.answerText}>
                  <strong>Response:</strong><br />
                  {doubt.answer}
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;