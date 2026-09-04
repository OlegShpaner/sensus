import { useState } from "react";
import { User } from "../../types";
import styles from "./LifeClock.module.css";

type Props = {
  user: User;
};

export default function LifeClock({ user }: Props) {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const today = new Date();
    const birthday = new Date(user.birthday || today);
    const diffLife = today.getTime() - birthday.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const daysSinceBirth = Math.max(0, Math.floor(diffLife / oneDay));
    
    const totalLifeDays = 36525; 
    const lifeProgress = Math.min(100, Math.max(0, (daysSinceBirth / totalLifeDays) * 100));

    return (
        <>
            <section className={`card ${styles.section}`}>
                <div className={styles.label}>
                    Days Creating Your Story
                </div>
                <div className={styles.value}>
                    {daysSinceBirth.toLocaleString()}
                </div>
                
                <div className={styles.progressBarContainer}>
                    <div 
                        className={styles.progressFill}
                        style={{ width: `${lifeProgress}%` }}
                    />
                    <div 
                        className={styles.progressMarker}
                        style={{ left: `${lifeProgress}%` }}
                    >
                        <img 
                            src="/legionary.png" 
                            alt="Roman Legionary Progress" 
                            onClick={() => setIsQuoteModalOpen(true)}
                            className={styles.markerImage}
                        />
                    </div>
                </div>
            </section>

            {isQuoteModalOpen && (
                <div 
                    className={styles.modalOverlay}
                    onClick={() => setIsQuoteModalOpen(false)}
                >
                    <div 
                        className={`card ${styles.modalCard}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setIsQuoteModalOpen(false)}
                            className={styles.modalCloseBtn}
                        >
                            &times;
                        </button>
                        <img src="/legionary.png" alt="Legionary" className={styles.modalImage} />
                        <h3 className={styles.modalTitle}>Daily Wisdom</h3>
                        <p className={styles.modalQuote}>
                            "You have power over your mind — not outside events. Realize this, and you will find strength."
                        </p>
                        <p className={styles.modalAuthor}>
                            — Marcus Aurelius
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
