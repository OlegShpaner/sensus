import { Outlet, NavLink, useNavigate, useLoaderData, redirect } from "react-router-dom";
import { api } from "../services/api";
import { User } from "../types";
import Header from "./Header";
import styles from "./Layout.module.css";

export async function loader() {
  const user = await api.getUser();
  if (!user) {
    throw redirect('/login');
  }
  return { user };
}

export default function Layout() {
  const navigate = useNavigate();
  const { user } = useLoaderData() as { user: User };

  const handleLogout = async () => {
    await api.logout();
    navigate('/login');
  };

  return (
    <div className={styles.appLayout}>
      <Header user={user} handleLogout={handleLogout} />

      <main className={`container ${styles.mainContent}`}>
        <Outlet />
      </main>

      <nav className={styles.bottomNav}>
        <div className="container flex justify-between">
          <NavLink to="/home" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}>
            Home
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}>
            History
          </NavLink>
          <NavLink to="/campaigns" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}>
            Campaigns
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
