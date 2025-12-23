# Links

A modern, responsive, and customizable link management page built with **SvelteKit** and **TailwindCSS**. Perfect for a personal portfolio landing page to showcase your social links.

## 🚀 Getting Started

Follow these steps to get a copy of the project up and running on your local machine.

### Prerequisites

-   Use a package manager like `pnpm` (recommended), `npm`, or `yarn`.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MannuVilasara/links.git
    cd links
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or npm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    # or npm run dev
    ```

4.  Open `http://localhost:5173` in your browser to see the result.

## 🛠️ Customization

You can easily customize this page to make it your own.

### 1. Update Profile & Links

Open `src/lib/data.ts`. This file serves as the single source of truth for your data.

-   **Profile**: Update the `profile` object with your name, role, bio, location, and status.
-   **Links**: Update the `links` array with your social links.

```typescript
export const profile: Profile = {
    name: 'Your Name',
    role: 'Your Role',
    // ...
};

export const links: LinkItem[] = [
    {
        title: 'GitHub',
        url: 'https://github.com/yourusername',
        icon: Github, // Import from lucide-svelte or svelte-simple-icons
        color: 'text-white',
        // ...
    },
    // ...
];
```

### 2. Update Images

-   **Profile Picture**: Replace `static/avatar.png` with your own image.
-   **Favicon**: Replace `static/favicon.png` with your own icon.

### 3. Icons

This project uses:
-   [Lucide Svelte](https://lucide.dev/guide/packages/lucide-svelte) for general icons.
-   [Simple Icons](https://simpleicons.org/) (via `svelte-simple-icons`) for brand icons.

To add a new icon:
1.  Import it in `src/lib/data.ts`.
2.  Add it to your link object.

## 📦 Deployment

Deploying to **Vercel** is the easiest way to host your links page.

1.  **Push your code to GitHub.**
2.  Go to [Vercel](https://vercel.com) and log in.
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your `links` repository.
5.  Vercel will automatically detect `SvelteKit`.
6.  Click **"Deploy"**.

That's it! Your site will be live in seconds.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
Made with love ❤️ using SvelteKit by [MannuVilasara](https://github.com/MannuVilasara)
