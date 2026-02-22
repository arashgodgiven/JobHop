// src/components/MessagesPanel.js
import { useEffect, useState } from "react";
import {
  listMessages,
  sendMessage,
  editMessage,
  deleteMessage,
} from "../services/api";

export default function MessagesPanel({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");

  async function load() {
    if (!conversationId) return;

    setError("");
    setLoading(true);

    try {
      const data = await listMessages(conversationId);
      setMessages(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    setEditingMessageId(null);
    setEditingText("");
  }, [conversationId]);

  async function handleSend() {
    if (!conversationId) return;

    const text = draft.trim();
    if (text.length === 0) return;

    setError("");

    try {
      await sendMessage(conversationId, text);
      setDraft("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleSaveEdit(messageId) {
    const text = editingText.trim();
    if (text.length === 0) return;

    try {
      await editMessage(conversationId, messageId, text);
      setEditingMessageId(null);
      setEditingText("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(messageId) {
    const ok = window.confirm("Delete this message?");
    if (!ok) return;

    try {
      await deleteMessage(conversationId, messageId);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateRows: "auto 1fr auto", height: "100%" }}>
      <div className="panel-header">
        <h3 style={{ margin: 0 }}>
          Messages {conversationId ? `(#${conversationId})` : ""}
        </h3>
        <button
          className="button-primary"
          onClick={load}
          disabled={!conversationId || loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error ? (
        <div style={{ color: "crimson", padding: 10 }}>{error}</div>
      ) : null}

      <div
        style={{
          padding: 10,
          overflowY: "auto",
          display: "grid",
          gap: 10,
        }}
      >
        {!conversationId ? (
          <div>Select a conversation.</div>
        ) : messages.length === 0 ? (
          <div>No messages yet.</div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 10,
                background: "white",
              }}
            >
              <div style={{ fontSize: 12, color: "#555" }}>
                #{m.id} • user {m.senderUserId} •{" "}
                {new Date(m.sentAt).toLocaleString()}
                {m.editedAt ? " (edited)" : ""}
                {m.deletedAt ? " (deleted)" : ""}
              </div>

              {editingMessageId === m.id ? (
                <div style={{ marginTop: 8 }}>
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 6,
                      marginBottom: 6,
                      borderRadius: 4,
                      border: "1px solid #ccc",
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="button-primary"
                      onClick={() => handleSaveEdit(m.id)}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingMessageId(null);
                        setEditingText("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginTop: 6 }}>{m.body}</div>

                  <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
                    <button
                      onClick={() => {
                        setEditingMessageId(m.id);
                        setEditingText(m.body);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#0a66c2",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(m.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "crimson",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ padding: 10, display: "flex", gap: 8 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            conversationId
              ? "Type a message..."
              : "Select a conversation first"
          }
          disabled={!conversationId}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
          className="button-primary"
          onClick={handleSend}
          disabled={!conversationId}
        >
          Send
        </button>
      </div>
    </div>
  );
}
