import { useState, useEffect } from "react";
import { useLoaderData, useFetcher } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import { api } from "../services/api";
import { User } from "../types";
import styles from "./profile.module.css";

export async function loader() {
    const user = await api.getUser();
    return { user };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const nickname = formData.get("nickname") as string;
    const email = formData.get("email") as string;
    const birthday = formData.get("birthday") as string;

    const currentUser = await api.getUser();
    if (currentUser) {
        await api.saveUser({ ...currentUser, nickname, email, birthday });
    }
    return { success: true };
}

export default function Profile() {
    const { user } = useLoaderData() as { user: User };
    const [isEditing, setIsEditing] = useState(false);
    
    const fetcher = useFetcher<{ success: boolean }>();

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data?.success) {
            setIsEditing(false);
        }
    }, [fetcher.state, fetcher.data]);

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>Profile</h2>
                {!isEditing && (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
            </div>
            <div className="card">
                {isEditing ? (
                    <fetcher.Form method="post" className={styles.form}>
                        <div>
                            <label className={styles.label}>Name</label>
                            <input name="nickname" className="input" defaultValue={user.nickname} required />
                        </div>
                        <div>
                            <label className={styles.label}>Email</label>
                            <input name="email" type="email" className="input" defaultValue={user.email} required />
                        </div>
                        <div>
                            <label className={styles.label}>Birthday</label>
                            <input name="birthday" type="date" className="input" defaultValue={user.birthday || ""} required />
                        </div>

                        <div className={styles.actions}>
                            <button type="button" className="btn btn-text" onClick={handleCancel}>Cancel</button>
                            <button type="submit" className={`btn btn-primary ${styles.saveBtn}`} disabled={fetcher.state !== 'idle'}>
                                {fetcher.state !== 'idle' ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </fetcher.Form>
                ) : (
                    <>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Name</label>
                            <div className={styles.value}>{user.nickname}</div>
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Email</label>
                            <div className={styles.value}>{user.email}</div>
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Birthday</label>
                            <div className={styles.value}>{user.birthday || 'Not set'}</div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
