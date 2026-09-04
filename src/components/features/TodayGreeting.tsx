import { useFetcher } from "react-router-dom";
import { User, DailyGoal } from "../../types";
import styles from "./TodayGreeting.module.css";

type Props = {
    user: User;
    today: Date;
    dailyGoals: DailyGoal[];
};

function toRoman(num: number): string {
    const romanNumerals = [
        ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
        ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
        ["X", 10], ["IX", 9], ["V", 5], ["IV", 4],
        ["I", 1]
    ] as const;
    let result = "";
    for (let i = 0; i < romanNumerals.length; i++) {
        while (num >= romanNumerals[i][1]) {
            result += romanNumerals[i][0];
            num -= romanNumerals[i][1] as number;
        }
    }
    return result;
}

export default function TodayGreeting({ user, today, dailyGoals }: Props) {
    const fetcher = useFetcher();

    const toggleGoal = (id: string) => {
        fetcher.submit({ intent: 'toggle_goal', goalId: id }, { method: 'post' });
    };

    return (
        <section className={styles.greetingContainer}>
            <h2 className={styles.greeting}>
                Hello, <strong className={styles.nickname}>{user.nickname || (user as any).username}</strong>
            </h2>
            <p className={styles.date}>
                {today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>

            {dailyGoals && dailyGoals.length > 0 && (
                <div className={styles.goalsContainer}>
                    {dailyGoals.map((goal, index) => {
                        // Optimistic UI for toggling
                        const isToggling = fetcher.formData?.get("intent") === "toggle_goal" && fetcher.formData?.get("goalId") === goal.id;
                        const isDone = isToggling ? !goal.done : goal.done;

                        return (
                            <div key={goal.id} className={styles.goalItem}>
                                <input
                                    type="checkbox"
                                    checked={isDone}
                                    onChange={() => toggleGoal(goal.id)}
                                    className={styles.goalCheckbox}
                                />
                                <span className={`${styles.goalText} ${isDone ? styles.goalTextDone : ''}`}>
                                    <span className={styles.romanNumeral}>{toRoman(index + 1)}.</span> {goal.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
