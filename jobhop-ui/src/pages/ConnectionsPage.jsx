import ConversationsPanel from "../components/ConversationsPanel";
// import ConnectionsPanel from "../components/ConnectionsPanel";

export default function ConnectionsPage() {
  return (
    <div className="wrap" style={{ justifyContent: "center" }}>
      <div className="panel" style={{ width: 800, padding: 12 }}>
        <ConversationsPanel />
      </div>
    </div>
  );
}
