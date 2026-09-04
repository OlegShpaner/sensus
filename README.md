# Sensus

*Note: This is an app for an AI coding contest.*

Sensus is a digital sanctuary for those drawn to the timeless wisdom of Stoic philosophy. Grounded in the principle of *Memento Mori*, it serves as a daily mirror reflecting the profound beauty and transience of human existence. By visually charting your journey—measuring life not just in days passed, but in moments truly lived—Sensus teaches us to anchor ourselves in the present, value the fleeting nature of time, and cultivate a life of purpose, resilience, and gratitude.

Built with React Router v7, it features a unique "Roman Empire" aesthetic—complete with Tyrian purple, gold accents, marble textures, and classic typography.

## Features

*   **Roman Empire Theme**: A beautifully designed UI featuring classic typography (Cinzel, Lora) and a rich color palette.
*   **Home Dashboard**: 
    *   **Roman Year Clock**: A sundial-style visualization showing your progress through the current year ("Day X of Y").
    *   **Life Clock**: Displays the total number of days you've been alive (based on the birthday you enter during signup).
*   **Daily Journal**:
    *   **Daily Goals**: Add, check off, edit, and delete your specific tasks for the day.
    *   **Memories**: Upload multiple photos to visually capture your day.
    *   **Notes**: A spacious text area to reflect on your daily achievements and thoughts.
    *   **Gratitude**: A dedicated section to log 3 things you are grateful for each day.
*   **History**: A chronological timeline view of all your past journal entries.
*   **Goals Dashboard**: A grid layout to manage and track your broader, long-term goals.

## Tech Stack

*   **Framework**: React Router v7
*   **Bundler**: Vite
*   **Styling**: Vanilla CSS (utilizing CSS Variables for the design system)
*   **Storage**: Browser LocalStorage API

## Getting Started

To run Sensus locally on your machine, follow these steps:

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   npm (or yarn/pnpm)

### Installation & Running

1.  Navigate to the project directory:
    ```bash
    cd /Users/olehshpaner/Projects/sensus
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Start the local development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to the local server address (usually `http://localhost:5173` or `http://localhost:3000`).

## Usage

1.  **Sign Up**: Create a mock account and enter your birthday to initialize your Life Clock.
2.  **Dashboard**: Tap the Roman Year Clock (or the feather icon) to start your daily entry.
3.  **Journal**: Add your daily goals, express gratitude, upload photos, and write your daily reflection.
4.  **Save**: Your entry will automatically save to your device's local storage and redirect you to your History log.
