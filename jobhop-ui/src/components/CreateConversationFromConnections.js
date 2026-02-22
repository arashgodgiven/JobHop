import { useEffect, useState } from "react";
import { createConversation, getMyConnections } from "../services/api";

export default function CreateConversationFromConnections({ onCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [connections, setConnections] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [type, setType] = useState("DM");
  const [title, setTitle] = useState("");

  async function loadConnections() {
    setError("");
    setLoading(true);
    try {
      const data = await getMyConnections();
      // Only accepted
      const accepted = data.filter((c) => c.status === "ACCEPTED");
      setConnections(accepted);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConnections();
  }, []);

  function toggleUser(userId) {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) return prev.filter((x) => x !== userId);
      return [...prev, userId];
    });
  }

  async function handleCreate() {
    setError("");

    if (type === "DM" && selectedUserIds.length !== 1) {
      setError("DM must have exactly 1 selected connection.");
      return;
    }

    if (type === "GROUP" && selectedUserIds.length < 2) {
      setError("Group must have at least 2 selected connections.");
      return;
    }

    try {
      const payloadTitle = type === "GROUP" ? (title.trim() || null) : null;
      const convo = await createConversation(type, payloadTitle, selectedUserIds);
      setSelectedUserIds([]);
      setTitle("");
      onCreated(convo);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <b>New conversation</b>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="DM">DM</option>
            <option value="GROUP">GROUP</option>
          </select>
        </div>

        <button className="button-primary" onClick={loadConnections} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error ? <div style={{ color: "crimson", marginTop: 8 }}>{error}</div> : null}

      {type === "GROUP" ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Group title (optional)"
          style={{ width: "100%", marginTop: 10, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
      ) : null}

      <div style={{ marginTop: 10, maxHeight: 180, overflowY: "auto", border: "1px solid #eee", borderRadius: 8 }}>
        {connections.length === 0 ? (
          <div style={{ padding: 10, color: "#555" }}>
            No accepted connections yet. Accept a connection first.
          </div>
        ) : (
          connections.map((c) => {
            // For now we only have IDs; later we’ll show names/emails.
            const otherUserId = c.contactUserId;
            const checked = selectedUserIds.includes(otherUserId);

            return (
              <label
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 10,
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleUser(otherUserId)}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>User #{otherUserId}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>connection #{c.id}</div>
                </div>
              </label>
            );
          })
        )}
      </div>

      <button
        className="button-primary"
        onClick={handleCreate}
        style={{ marginTop: 10, width: "100%" }}
        disabled={connections.length === 0}
      >
        Create
      </button>

      <div style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
        DM: select 1 connection • Group: select 2+ connections
      </div>
    </div>
  );
}