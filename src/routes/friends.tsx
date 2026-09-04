import { useState, useEffect } from "react";
import { useLoaderData, useFetcher } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import styles from "./friends.module.css";

export async function loader() {
    // Simulate fetching friends from API
    return { friends: ['Julius Caesar', 'Marcus Aurelius', 'Seneca'] };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get("email");
    // Simulate sending an invite
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, email };
}

export default function Friends() {
    const { friends } = useLoaderData() as { friends: string[] };
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetcher = useFetcher<{ success: boolean; email: string }>();

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data?.success) {
            alert(`Invitation sent to ${fetcher.data.email}!`);
            setIsModalOpen(false);
            // clear data or rely on unmount
            fetcher.data = undefined; 
        }
    }, [fetcher.state, fetcher.data]);

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>Friends</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Invite Friend</button>
            </div>

            <div className="card">
                {friends.length === 0 ? (
                    <p className={styles.emptyState}>You haven't added any friends yet.</p>
                ) : (
                    <ul className={styles.list}>
                        {friends.map((friend, idx) => (
                            <li key={idx} className={styles.listItem}>
                                <div className={styles.avatar}>
                                    {friend[0]}
                                </div>
                                <span className={styles.name}>{friend}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <fetcher.Form method="post" className={`card ${styles.modalCard}`}>
                        <h3 className={styles.modalTitle}>Invite a Friend</h3>
                        <input 
                            name="email"
                            type="email" 
                            className={`input ${styles.modalInput}`}
                            placeholder="Friend's email address"
                            required
                        />
                        <div className={styles.modalActions}>
                            <button type="button" className="btn btn-text" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={fetcher.state !== 'idle'}>
                                {fetcher.state !== 'idle' ? 'Sending...' : 'Send Invite'}
                            </button>
                        </div>
                    </fetcher.Form>
                </div>
            )}
        </div>
    );
}
