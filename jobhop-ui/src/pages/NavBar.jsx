import { Link, useLocation } from "react-router-dom";

export default function NavBar({ me, onLogout }) {
  const location = useLocation();
  const active = (path) => (location.pathname === path ? { borderBottom: "2px solid #315a76" } : {});

  return (
    <ul className="navbar">
      <div className="left_side_nav">
        <li className="left_side"><span className="appLogo">JH</span></li>
        <li className="left_side"><span className="appName">JobHop</span></li>
      </div>

      {me ? (
        <div className="right_side_nav">
          <div className="navigation_buttons_div">
            <div className="myContacts_nav_div" style={active("/connections")}>
              <li style={{ listStyle: "none" }}>
                <Link to="/connections" style={{ textDecoration: "none", color: "#4682A9", fontFamily: "Fira Sans Condensed" }}>
                  Connections
                </Link>
              </li>
            </div>

            <div className="myJobs_nav_div" style={active("/messages")}>
              <li style={{ listStyle: "none" }}>
                <Link to="/messages" style={{ textDecoration: "none", color: "#4682A9", fontFamily: "Fira Sans Condensed" }}>
                  Messages
                </Link>
              </li>
            </div>
          </div>

          <li style={{ listStyle: "none", marginRight: 10, color: "#4682A9" }}>
            {me.displayName}
          </li>
          <li style={{ listStyle: "none" }}>
            <button className="button-primary" onClick={onLogout}>Logout</button>
          </li>
        </div>
      ) : null}
    </ul>
  );
}
