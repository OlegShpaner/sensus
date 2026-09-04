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
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    const existing = await api.getUser();
    const storedIdentifier = existing?.email || (existing as any)?.username;

    if (!existing || storedIdentifier !== email) {
        return { error: "Incorrect email or no account found." };
    }

    if (existing.password && existing.password !== password) {
        return { error: "Incorrect password." };
    }

    return redirect("/home");
}

export default function Login() {
    const actionData = useActionData() as { error?: string } | undefined;
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <div className={`container ${styles.authContainer}`}>
            <div className={`card text-center ${styles.authCard}`}>
                <h1 className={styles.title}>Sensus</h1>
                <h2 className={styles.subtitle}>Welcome Back</h2>

                {actionData?.error && (
                    <div className={styles.error}>
                        {actionData.error}
                    </div>
                )}

                <Form method="post" className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            name="email"
                            type="email"
                            className={`input ${styles.inputFull}`}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            name="password"
                            type="password"
                            className={`input ${styles.inputFull}`}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </Form>

                <p className={styles.footerText}>
                    New here? <Link to="/signup" className={styles.link}>Create an account</Link>
                </p>
            </div>
        </div>
    );
}
