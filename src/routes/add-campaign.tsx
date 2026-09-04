import { useState } from "react";
import { useNavigate, Form, redirect, useNavigation } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import { api } from "../services/api";
import { Campaign } from "../types";
import styles from "./campaigns.module.css";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const friendsStr = formData.get("friends") as string;

    if (!title.trim()) return null;

    const newCampaign: Campaign = {
        id: Date.now().toString(),
        title,
        description,
        image: image || undefined,
        friends: friendsStr ? friendsStr.split(',').map(f => f.trim()).filter(Boolean) : []
    };

    await api.addCampaign(newCampaign);
    return redirect("/campaigns");
}

export default function AddCampaign() {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    
    // Local state just for image preview before submission
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={`btn-text ${styles.backBtn}`}>&larr; Back</button>
                <h2 className={styles.headerTitle}>New Campaign</h2>
                <div className={styles.headerSpacer}></div>
            </div>

            <Form method="post" className={`card ${styles.form}`}>
                
                {/* Hidden input to pass base64 image data to action */}
                <input type="hidden" name="image" value={imagePreview || ""} />

                {/* Image */}
                <div>
                    <label className={styles.label}>Campaign Cover</label>
                    {imagePreview ? (
                        <div className={styles.imagePreviewContainer}>
                            <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                            <button
                                type="button"
                                onClick={() => setImagePreview(null)}
                                className={styles.removeImageBtn}
                            >
                                &times;
                            </button>
                        </div>
                    ) : (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={styles.fileInput}
                        />
                    )}
                </div>

                {/* Title */}
                <div>
                    <label className={styles.label}>Campaign Title</label>
                    <input
                        name="title"
                        type="text"
                        className="input"
                        placeholder="e.g., Run a Marathon"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className={styles.label}>Description</label>
                    <textarea
                        name="description"
                        className={`input ${styles.textarea}`}
                        placeholder="Describe your campaign..."
                    />
                </div>

                {/* Friends */}
                <div>
                    <label className={styles.label}>Add Friends</label>
                    <input
                        name="friends"
                        type="text"
                        className="input"
                        placeholder="Name 1, Name 2 (comma separated)"
                    />
                    <p className={styles.hint}>
                        Simulated by just saving names
                    </p>
                </div>

                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Campaign"}
                </button>

            </Form>
        </div>
    );
}
