import { Link, useLoaderData } from "react-router-dom";
import { api } from "../services/api";
import { DayEntry } from "../types";
import styles from "./history.module.css";

export async function loader() {
    const allEntries = await api.getEntries();
    // Convert object to array and sort by date desc
    const sorted = Object.values(allEntries).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return { entries: sorted };
}

export default function History() {
    const { entries } = useLoaderData() as { entries: DayEntry[] };

    return (
        <div className={`container ${styles.container}`}>
            <h2 className={styles.title}>History</h2>

            {entries.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No days recorded yet.</p>
                    <Link to="/home" className={`btn btn-primary ${styles.emptyStateBtn}`}>Go to Today</Link>
                </div>
            ) : (
                <div className={styles.list}>
                    {entries.map(entry => {
                        const dateObj = new Date(entry.date);
                        return (
                            <Link
                                key={entry.date}
                                to={`/day/${entry.date}`}
                                className={`card ${styles.historyCard}`}
                            >
                                <div className={styles.dateBadge}>
                                    <span className={styles.dateMonth}>
                                        {dateObj.toLocaleDateString(undefined, { month: 'short' })}
                                    </span>
                                    <span className={styles.dateDay}>
                                        {dateObj.getDate()}
                                    </span>
                                </div>

                                <div className={styles.content}>
                                    <p className={styles.notePreview}>
                                        {entry.note || "No notes"}
                                    </p>
                                    {(entry.images || entry.image) && <span className={styles.photoBadge}>Has photo</span>}
                                </div>

                                <div className={styles.arrow}>&rarr;</div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
