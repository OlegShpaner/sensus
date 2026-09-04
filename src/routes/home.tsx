import { useLoaderData, useNavigate } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import { api } from "../services/api";
import { User, DayEntry } from "../types";
import LifeClock from "../components/features/LifeClock";
import TodayGreeting from "../components/features/TodayGreeting";
import styles from "./home.module.css";

export async function loader() {
    const user = await api.getUser();
    const todayStr = new Date().toISOString().split('T')[0];
    const entry = await api.getEntry(todayStr);
    return { user, entry };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const todayStr = new Date().toISOString().split('T')[0];

    if (intent === "toggle_goal") {
        const goalId = formData.get("goalId") as string;
        const entry = await api.getEntry(todayStr) || { date: todayStr, note: "", dailyGoals: [], gratitude: ['', '', ''] };
        entry.dailyGoals = entry.dailyGoals?.map(g => g.id === goalId ? { ...g, done: !g.done } : g) || [];
        await api.saveEntry(entry);
        return { success: true };
    }
    return null;
}

export default function Home() {
    const navigate = useNavigate();
    const { user, entry } = useLoaderData() as { user: User, entry: DayEntry | null };

    const today = new Date();
    
    // Calculations for Big Clock
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const year = today.getFullYear();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const totalDays = isLeap ? 366 : 365;
    
    const formatToday = today.toISOString().split('T')[0];

    return (
        <div className={`home-container ${styles.container}`}>
            <TodayGreeting 
                user={user} 
                today={today} 
                dailyGoals={entry?.dailyGoals || []} 
            />

            {/* Big Clock - Day of Year (Simple Numeric) */}
            <section
                className={`card ${styles.bigClock}`}
                onClick={() => navigate(`/day/${formatToday}`)}
            >
                <div className={styles.clockLabel}>
                    Day of the Year
                </div>
                <div className={styles.clockValue}>
                    {dayOfYear}
                </div>
                <div className={styles.clockSubValue}>
                    of {totalDays}
                </div>
                <div className={styles.journalPrompt}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                        <line x1="16" y1="8" x2="2" y2="22"></line>
                        <line x1="17.5" y1="15" x2="9" y2="15"></line>
                    </svg>
                    Tap to Journal
                </div>
            </section>

            <LifeClock user={user} />
        </div>
    );
}
