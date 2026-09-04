import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
import styles from "./Header.module.css";

type Props = {
    user: User;
    handleLogout: () => void;
};

export default function Header({ user, handleLogout }: Props) {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContainer}`}>
                <div 
                    onClick={() => navigate('/home')}
                    className={styles.logoContainer}
                >
                    <img
                        src="/logo.png"
                        alt="Sensus Logo"
                        className={styles.logoImage}
                    />
                    <h1 className={styles.logo}>Sensus</h1>
                </div>
                
                <div className={styles.profileContainer} ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                        className={styles.profileButton}
                    >
                        <div className={styles.avatar}>
                            {user?.nickname?.[0]?.toUpperCase()}
                        </div>
                        <span className={styles.nickname}>{user?.nickname}</span>
                    </button>

                    {isDropdownOpen && (
                        <div className={styles.dropdownWrapper}>
                            <div className={styles.dropdown}>
                                <button 
                                    onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }} 
                                    className={styles.dropdownItem}
                                >
                                    Profile
                                </button>
                                <button 
                                    onClick={() => { setIsDropdownOpen(false); navigate('/friends'); }} 
                                    className={styles.dropdownItem}
                                >
                                    Friends
                                </button>
                                <button 
                                    onClick={() => { setIsDropdownOpen(false); handleLogout(); }} 
                                    className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
