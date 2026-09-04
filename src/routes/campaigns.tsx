import { Link, useLoaderData } from "react-router-dom";
import { api } from "../services/api";
import { Campaign } from "../types";
import styles from "./campaigns.module.css";

export async function loader() {
    const campaigns = await api.getCampaigns();
    return { campaigns };
}

export default function Campaigns() {
    const { campaigns } = useLoaderData() as { campaigns: Campaign[] };

    return (
        <div className={`container ${styles.container}`}>
            <h2 className={styles.title}>Campaigns</h2>
            <p className={styles.subtitle}>Your grand conquests and long-term goals.</p>

            <div className={styles.grid}>
                {campaigns.map(campaign => (
                    <Link
                        key={campaign.id}
                        to={`/campaigns/edit/${campaign.id}`}
                        className={`card ${styles.campaignCard}`}
                    >
                        {campaign.image ? (
                            <img src={campaign.image} alt={campaign.title} className={styles.campaignImage} />
                        ) : (
                            <img src="/roman-placeholder-wide.png" alt="Placeholder" className={`${styles.campaignImage} ${styles.campaignPlaceholder}`} />
                        )}
                        <h3 className={styles.campaignTitle}>{campaign.title}</h3>
                        {campaign.friends.length > 0 && <span className={styles.campaignFriends}>with {campaign.friends.length} friends</span>}
                    </Link>
                ))}

                {/* Add Campaign Button Tile */}
                <Link
                    to="/campaigns/add"
                    className={`card ${styles.addCampaignCard}`}
                >
                    <span className={styles.addIcon}>+</span>
                    <span className={styles.addLabel}>Add Campaign</span>
                </Link>
            </div>
        </div>
    );
}
