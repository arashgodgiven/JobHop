// src/components/ConversationsPanel.js
import { useEffect, useState } from "react";
import { getMyConversations, deleteConversation } from "../services/api";
import CreateConversationFromConnections from "./CreateConversationFromConnections";

export default function ConversationsPanel({ selectedConversationId, onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setError("");
    setLoading(true);

    try {
      const data = await getMyConversations();
      setConversations(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(conversationId) {
    const ok = window.confirm("Delete this conversation?");
    if (!ok) return;

    setError("");

    try {
      await deleteConversation(conversationId);

      if (selectedConversationId === conversationId) {
        onSelectConversation(null);
      }

      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  function handleCreated() {
    load();
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Header */}
      <div className="panel-header">
        <h3 style={{ margin: 0 }}>Conversations</h3>
        <button
          className="button-primary"
          onClick={load}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error ? (
        <div style={{ color: "crimson", padding: "0 10px" }}>
          {error}
        </div>
      ) : null}

      {/* Create conversation */}
      <div style={{ padding: "0 10px" }}>
        <CreateConversationFromConnections onCreated={handleCreated} />
      </div>

      {/* Conversation list */}
      <div style={{ padding: 10, display: "grid", gap: 8 }}>
        {conversations.length === 0 ? (
          <div style={{ padding: 8 }}>No conversations yet.</div>
        ) : (
          conversations.map((c) => {
            const isSelected = c.id === selectedConversationId;

            return (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => onSelectConversation(c.id)}
                  style={{
                    flex: 1,
                    textAlign: "left",
                    padding: 10,
                    borderRadius: 8,
                    border: isSelected
                      ? "2px solid #0a66c2"
                      : "1px solid #ddd",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <b>#{c.id}</b> {c.type}
                    {c.title ? ` — ${c.title}` : ""}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#555",
                      marginTop: 4,
                    }}
                  >
                    participants: {c.participantUserIds.join(", ")}
                  </div>
                </button>

                <button
                  onClick={() => handleDelete(c.id)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(0,0,0,0.2)",
                    background: "white",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}