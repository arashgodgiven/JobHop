const BASE_URL = "http://localhost:8080";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const headers = options.headers ? { ...options.headers } : {};
  headers["Content-Type"] = "application/json";

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.error || data?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export function register(email, password, displayName) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName }),
  });
}

export function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMyConversations() {
  return request("/conversations", { method: "GET" });
}

export function createConversation(type, title, participantUserIds) {
  return request("/conversations", {
    method: "POST",
    body: JSON.stringify({ type, title, participantUserIds }),
  });
}

export function listMessages(conversationId) {
  return request(`/conversations/${conversationId}/messages`, { method: "GET" });
}

export function sendMessage(conversationId, body) {
  return request(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export function deleteConversation(conversationId) {
  return request(`/conversations/${conversationId}`, { method: "DELETE" });
}

export function editMessage(conversationId, messageId, body) {
  return request(`/conversations/${conversationId}/messages/${messageId}`, {
    method: "PUT",
    body: JSON.stringify({ body })
  });
}

export function deleteMessage(conversationId, messageId) {
  return request(`/conversations/${conversationId}/messages/${messageId}`, {
    method: "DELETE"
  });
}

export function getMyConnections() {
  return request("/connections", { method: "GET" });
}
