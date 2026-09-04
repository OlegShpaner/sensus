import { Link, Form, redirect, useActionData, useNavigation } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import { api } from "../services/api";
import styles from "./auth.module.css";

export async function loader() {
    const user = await api.getUser();
    if (user) return redirect("/home");
    return null;
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const nickname = formData.get("nickname") as string;
    const password = formData.get("password") as string;
    const birthday = formData.get("birthday") as string;

    if (!email || !nickname || !password || !birthday) {
        return { error: "All fields are required." };
    }

    await api.saveUser({
        email,
        nickname,
        password,
        birthday
    });

    return redirect("/home");
}

export default function Signup() {
    const actionData = useActionData() as { error?: string } | undefined;
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className={`container ${styles.authContainer}`}>
            <div className={`card text-center ${styles.authCard}`}>
                <h1 className={styles.title}>Sensus</h1>
                <h2 className={styles.subtitle}>Create Account</h2>

                {actionData?.error && (
                    <div className={styles.error}>
                        {actionData.error}
                    </div>
                )}

                <Form method="post" className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Nickname</label>
                        <input name="nickname" type="text" className="input" required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <input name="email" type="email" className="input" required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input name="password" type="password" className="input" required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Date of Birth</label>
                        <input name="birthday" type="date" className="input" required />
                    </div>

                    <button type="submit" className={`btn btn-primary ${styles.signupBtn}`} disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Get Started"}
                    </button>
                </Form>

                <p className={styles.footerText}>
                    Already have an account? <Link to="/login" className={styles.link}>Login</Link>
                </p>
            </div>
        </div>
    );
}
