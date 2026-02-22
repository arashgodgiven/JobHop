import { useState } from "react";
import { createConversation } from "../services/api";

export default function CreateConversationForm({ onCreated }) {
  const [type, setType] = useState("DM");
  const [title, setTitle] = useState("");
  const [participantIdsText, setParticipantIdsText] = useState("1,2");
  const [error, setError] = useState("");

  function parseIds(text) {
    return text
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x.length > 0)
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n));
  }

  async function handleCreate() {
    setError("");
    try {
      const ids = parseIds(participantIdsText);
      if (ids.length === 0) {
        setError("Provide at least one participant user id");
        return;
      }

      const payloadTitle = title.trim().length === 0 ? null : title.trim();
      const data = await createConversation(type, payloadTitle, ids);
      onCreated(data);
      setTitle("");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <b>Create</b>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="DM">DM</option>
          <option value="GROUP">GROUP</option>
        </select>
      </div>

      {error ? <div style={{ color: "crimson", marginTop: 8 }}>{error}</div> : null}

      <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title (optional)" />
        <input
          value={participantIdsText}
          onChange={(e) => setParticipantIdsText(e.target.value)}
          placeholder="participant ids (comma separated) e.g. 1,2"
        />
        <button onClick={handleCreate}>Create Conversation</button>
      </div>
    </div>
  );
}
