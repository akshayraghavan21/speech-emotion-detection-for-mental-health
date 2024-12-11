import React, { useState, useEffect } from "react";
import axios from "axios";

function JournalPane({ refresh }) {
  const [journal, setJournal] = useState([]);
  const [editedNote, setEditedNote] = useState({});
  const [isEditing, setIsEditing] = useState({}); // Tracks editing state for each entry

  useEffect(() => {
    fetchJournal();
  }, [refresh]);

  const fetchJournal = async () => {
    try {
      const response = await axios.get("http://localhost:8001/journal");
      setJournal(response.data);
    } catch (error) {
      console.error("Error fetching journal:", error);
    }
  };

  const handleEditClick = (index) => {
    setIsEditing({ ...isEditing, [index]: true });
    setEditedNote({ ...editedNote, [index]: journal[index].note });
  };

  const handleSaveClick = async (index) => {
    try {
      const note = editedNote[index];
      console.log(`Saving ${index}`);
      await axios.put(`http://localhost:8001/journal/${index}`, { note });
      console.log(`Put Trued for  ${index}`);
      setJournal((prevJournal) =>
        prevJournal.map((entry, i) =>
          i === index ? { ...entry, note } : entry
        )
      );
      setIsEditing({ ...isEditing, [index]: false });
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleCancelClick = (index) => {
    setIsEditing({ ...isEditing, [index]: false });
    setEditedNote({ ...editedNote, [index]: "" });
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#e9d9b0",
        padding: "1.5rem",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        overflowY: "auto",
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#333",
          marginBottom: "1.5rem",
        }}
      >
        My Journal
      </h2>
      {journal.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          No journal entries yet. Upload or record audio to get started!
        </p>
      ) : (
        journal.map((entry, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            {/* <p
              style={{
                margin: "0.5rem 0",
                fontSize: "1rem",
                color: "#555",
              }}
            >
              <strong>Emotion:</strong> {entry.emotion}
            </p>
            <p
              style={{
                margin: "0.5rem 0",
                fontSize: "1rem",
                color: "#555",
                justifyContent: "right",
              }}
            >
              <strong>Date:</strong> {entry.date}
            </p> */}
            <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0.5rem 0",
    fontSize: "1rem",
    color: "#555",
  }}
>
  <p style={{ margin: 0 }}>
    <strong>Emotion:</strong> {entry.emotion}
  </p>
  <p style={{ margin: 0 }}>
    <strong>Date:</strong> {entry.date}
  </p>
</div>

            <audio
              controls
              style={{
                marginTop: "1rem",
                width: "100%",
                outline: "none",
              }}
            >
              <source
                src={`http://localhost:8001/audio/${entry.audio_file}`}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
            <p
              style={{
                margin: "0.5rem 0",
                fontSize: "1rem",
                color: "#555",
              }}
            >
              <strong>Note: </strong>
              {isEditing[index] ? (
                <textarea
                  value={editedNote[index]}
                  onChange={(e) =>
                    setEditedNote({ ...editedNote, [index]: e.target.value })
                  }
                  style={{
                    width: "100%",
                    marginTop: "0.5rem",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                  }}
                />
              ) : (
                <span>{entry.note}</span>
              )}
            </p>
            <div>
              {isEditing[index] ? (
                <>
                  <button
                    onClick={() => handleSaveClick(index)}
                    style={{
                      marginTop: "0.5rem",
                      marginRight: "0.5rem",
                      padding: "0.5rem 1rem",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      backgroundColor: "#2196f3",
                      color: "#ffffff",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleCancelClick(index)}
                    style={{
                      marginTop: "0.5rem",
                      marginRight: "0.5rem",
                      padding: "0.5rem 1rem",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      backgroundColor: "#f44336",
                      color: "#ffffff",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEditClick(index)}
                  style={{
                    marginTop: "0.5rem",
                    marginRight: "0.5rem",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    backgroundColor: "#4caf50",
                    color: "#ffffff",
                    transition: "background-color 0.2s ease, color 0.2s ease",
                  }}
                >
                  Edit Note
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default JournalPane;
