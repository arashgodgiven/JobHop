import AuthPanel from "../components/AuthPanel";

export default function AuthPage({ onAuthSuccess }) {
  return <AuthPanel onAuthSuccess={onAuthSuccess} />;
}
