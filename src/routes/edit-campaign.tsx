import { useState } from "react";
import { useNavigate, Form, redirect, useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { api } from "../services/api";
import { Campaign } from "../types";
import styles from "./campaigns.module.css";

export async function loader({ params }: LoaderFunctionArgs) {
    const campaigns = await api.getCampaigns();
    const campaign = campaigns.find(g => g.id === params.id);
    if (!campaign) throw redirect("/campaigns");
    return { campaign };
}

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "delete") {
        if (params.id) {
            await api.deleteCampaign(params.id);
        }
        return redirect("/campaigns");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const friendsStr = formData.get("friends") as string;

    if (!title.trim() || !params.id) return null;

    const updatedFields: Partial<Campaign> = {
        title,
        description,
        image: image || undefined,
        friends: friendsStr ? friendsStr.split(',').map(f => f.trim()).filter(Boolean) : []
    };

    await api.updateCampaign(params.id, updatedFields);
    return redirect("/campaigns");
}

export default function EditCampaign() {
    const navigate = useNavigate();
    const submit = useSubmit();
    const navigation = useNavigation();
    const { campaign } = useLoaderData() as { campaign: Campaign };
    const isSubmitting = navigation.state === "submitting";

    const [imagePreview, setImagePreview] = useState<string | null>(campaign.image || null);

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

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this campaign?")) {
            submit({ intent: "delete" }, { method: "post" });
        }
    }

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.header}>
                <button type="button" onClick={() => navigate(-1)} className={`btn-text ${styles.backBtn}`}>&larr; Back</button>
                <h2 className={styles.headerTitle}>Edit Campaign</h2>
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
                        defaultValue={campaign.title}
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
                        defaultValue={campaign.description}
                    />
                </div>

                {/* Friends */}
                <div>
                    <label className={styles.label}>Friends</label>
                    <input
                        name="friends"
                        type="text"
                        className="input"
                        placeholder="Name 1, Name 2 (comma separated)"
                        defaultValue={campaign.friends.join(", ")}
                    />
                    <p className={styles.hint}>
                        Simulated by just saving names
                    </p>
                </div>

                <div className={styles.actions}>
                    <button type="submit" name="intent" value="save" className={`btn btn-primary ${styles.actionBtn}`} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={handleDelete} className={`btn ${styles.actionBtn} ${styles.deleteBtn}`} disabled={isSubmitting}>
                        Delete Campaign
                    </button>
                </div>

            </Form>
        </div>
    );
}
