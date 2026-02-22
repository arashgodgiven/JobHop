import { useState } from "react";
import ConversationsPanel from "../components/ConversationsPanel";
import MessagesPanel from "../components/MessagesPanel";

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  return (
    <div className="wrap">
      <div className="panel panel-left">
        <ConversationsPanel
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
      </div>

      <div className="panel panel-right" style={{ height: 650 }}>
        <MessagesPanel conversationId={selectedConversationId} />
      </div>
    </div>
  );
}
