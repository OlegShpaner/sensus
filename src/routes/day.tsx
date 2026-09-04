import { useState } from "react";
import { useParams, useNavigate, Form, redirect, useLoaderData, useFetcher, useNavigation } from "react-router-dom";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { api } from "../services/api";
import { DayEntry, DailyGoal } from "../types";
import styles from "./day.module.css";

export async function loader({ params }: LoaderFunctionArgs) {
    const date = params.date!;
    let entry = await api.getEntry(date);
    
    if (!entry) {
        entry = { date, note: "", dailyGoals: [], gratitude: ['', '', ''] };
    }
    
    return { entry };
}

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const date = params.date!;
    
    const entry = (await api.getEntry(date)) || { date, note: "", dailyGoals: [], gratitude: ['', '', ''] };

    if (intent === "toggle_goal") {
        const goalId = formData.get("goalId") as string;
        entry.dailyGoals = entry.dailyGoals?.map(g => g.id === goalId ? { ...g, done: !g.done } : g) || [];
        await api.saveEntry(entry);
        return { success: true };
    }
    
    if (intent === "add_goal") {
        const text = formData.get("text") as string;
        if (text.trim()) {
            entry.dailyGoals = [...(entry.dailyGoals || []), { id: Date.now().toString(), text: text.trim(), done: false }];
            await api.saveEntry(entry);
        }
        return { success: true };
    }
    
    if (intent === "edit_goal") {
        const goalId = formData.get("goalId") as string;
        const text = formData.get("text") as string;
        if (text.trim()) {
            entry.dailyGoals = entry.dailyGoals?.map(g => g.id === goalId ? { ...g, text: text.trim() } : g) || [];
            await api.saveEntry(entry);
        }
        return { success: true };
    }
    
    if (intent === "delete_goal") {
        const goalId = formData.get("goalId") as string;
        entry.dailyGoals = entry.dailyGoals?.filter(g => g.id !== goalId) || [];
        await api.saveEntry(entry);
        return { success: true };
    }
    
    if (intent === "save_entry") {
        entry.note = formData.get("note") as string;
        
        const gratitude = formData.getAll("gratitude") as string[];
        entry.gratitude = gratitude.some(g => g.trim() !== '') ? gratitude : undefined;
        
        const imagesStr = formData.get("images") as string;
        const images = imagesStr ? JSON.parse(imagesStr) : [];
        entry.images = images.length > 0 ? images : undefined;
        
        await api.saveEntry(entry);
        return redirect("/history");
    }

    return null;
}

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

export default function Day() {
    const { date } = useParams<{ date: string }>(); // YYYY-MM-DD
    const navigate = useNavigate();
    const { entry } = useLoaderData() as { entry: DayEntry };
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const isSaving = navigation.state === "submitting" && navigation.formData?.get("intent") === "save_entry";

    // Local UI state for images (before save)
    const [images, setImages] = useState<string[]>(
        entry.images ? entry.images : (entry.image ? [entry.image] : [])
    );
    
    // Goal UI states
    const [newGoalText, setNewGoalText] = useState("");
    const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
    const [editGoalText, setEditGoalText] = useState("");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            const promise = new Promise<string>((resolve) => {
                reader.onloadend = () => resolve(reader.result as string);
            });
            reader.readAsDataURL(file);
            newImages.push(await promise);
        }
        setImages(prev => [...prev, ...newImages]);
    };

    const addGoal = () => {
        if (!newGoalText.trim()) return;
        fetcher.submit({ intent: 'add_goal', text: newGoalText }, { method: 'post' });
        setNewGoalText("");
    };

    const toggleGoal = (id: string) => {
        fetcher.submit({ intent: 'toggle_goal', goalId: id }, { method: 'post' });
    };

    const startEditing = (goal: DailyGoal) => {
        setEditingGoalId(goal.id);
        setEditGoalText(goal.text);
    };

    const saveEditGoal = () => {
        if (editingGoalId) {
            fetcher.submit({ intent: 'edit_goal', goalId: editingGoalId, text: editGoalText }, { method: 'post' });
            setEditingGoalId(null);
            setEditGoalText("");
        }
    };

    const deleteGoal = (id: string) => {
        fetcher.submit({ intent: 'delete_goal', goalId: id }, { method: 'post' });
    }

    if (!date) return null;

    const dailyGoals = entry.dailyGoals || [];
    const gratitude = entry.gratitude || ['', '', ''];

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={`btn-text ${styles.backBtn}`}>&larr; Back</button>
                <h2 className={styles.dateTitle}>{date}</h2>
                <div className={styles.headerSpacer}></div> {/* Spacer */}
            </div>

            <div className={`card ${styles.cardContainer}`}>

                {/* Daily Goals Section - Instant Mutations via Fetcher */}
                <div>
                    <label className={styles.sectionLabel}>Daily Goals</label>
                    <div className={styles.goalsList}>
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
                                    {editingGoalId === goal.id ? (
                                        <div className={styles.goalEditContainer}>
                                            <input
                                                type="text"
                                                value={editGoalText}
                                                onChange={(e) => setEditGoalText(e.target.value)}
                                                className={`input ${styles.goalEditInput}`}
                                                autoFocus
                                            />
                                            <button onClick={saveEditGoal} className={`btn btn-primary ${styles.goalSaveBtn}`}>Save</button>
                                        </div>
                                    ) : (
                                        <span
                                            onClick={() => startEditing(goal)}
                                            className={`${styles.goalText} ${isDone ? styles.goalTextDone : ''}`}
                                        >
                                            <span className={styles.romanNumeral}>{toRoman(index + 1)}.</span> {goal.text}
                                        </span>
                                    )}
                                    <button onClick={() => deleteGoal(goal.id)} className={`btn-text ${styles.goalDeleteBtn}`}>&times;</button>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.addGoalContainer}>
                        <input
                            type="text"
                            className={`input ${styles.addGoalInput}`}
                            placeholder="Add a new goal..."
                            value={newGoalText}
                            onChange={(e) => setNewGoalText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                        />
                        <button onClick={addGoal} className={`btn btn-primary ${styles.addGoalBtn}`} disabled={fetcher.state !== "idle"}>
                            {fetcher.state !== "idle" && fetcher.formData?.get("intent") === "add_goal" ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </div>

                <hr className={styles.divider} />

                <Form method="post" className={styles.mainForm}>
                    <input type="hidden" name="intent" value="save_entry" />
                    <input type="hidden" name="images" value={JSON.stringify(images)} />
                    
                    {/* Pictures Section */}
                    <div>
                        <label className={styles.sectionLabel}>Memories</label>
                        <div className={styles.imagesGrid}>
                            {images.map((img, idx) => (
                                <div key={idx} className={styles.imagePreviewWrapper}>
                                    <img src={img} alt={`Day memory ${idx + 1}`} className={styles.imagePreview} />
                                    <button
                                        type="button"
                                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                        className={styles.removeImageBtn}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <div
                                className={styles.addImageBtn}
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                <span className={styles.addIcon}>+</span>
                                <span className={styles.addLabel}>Add Photo</span>
                            </div>
                        </div>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className={styles.hiddenInput}
                            onChange={handleImageUpload}
                        />
                    </div>

                    <hr className={styles.divider} />

                    {/* Notes Section */}
                    <div className={styles.notesSection}>
                        <label className={styles.sectionLabel}>Notes</label>
                        <textarea
                            name="note"
                            className={`input ${styles.notesTextarea}`}
                            placeholder="How was your day? What did you achieve?"
                            defaultValue={entry.note}
                        />
                    </div>
                    
                    <hr className={styles.divider} />

                    {/* Gratitude Section */}
                    <div>
                        <label className={styles.sectionLabel}>3 Things I'm Grateful For</label>
                        <div className={styles.gratitudeList}>
                            {[0, 1, 2].map(index => (
                                <input
                                    key={index}
                                    name="gratitude"
                                    className="input"
                                    placeholder={`${toRoman(index + 1)}. `}
                                    defaultValue={gratitude[index] || ""}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary ${styles.submitBtn}`}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Entry'}
                    </button>
                </Form>
            </div>
        </div>
    );
}
