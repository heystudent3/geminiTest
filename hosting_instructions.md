# Hosting Instructions for Text Quest RPG

This guide explains how to deploy the Text Quest RPG client (frontend) and server (backend) to separate hosting platforms: Netlify for the client and Render for the server.

## Prerequisites

*   **Git:** Installed on your local machine.
*   **Node.js & npm:** Installed on your local machine (for potential local testing, though not strictly required for deployment itself).
*   **GitHub Account:** Your project code should be hosted in a GitHub repository.
*   **Netlify Account:** Sign up for free at [https://www.netlify.com/](https://www.netlify.com/).
*   **Render Account:** Sign up for free at [https://render.com/](https://render.com/).

## Part 1: Hosting the Client (Frontend) on Netlify

Netlify is excellent for hosting static websites like our HTML, CSS, and JavaScript client.

1.  **Push Code to GitHub:**
    *   Ensure your latest project code (including the `client/` directory) is committed and pushed to your main branch on GitHub.

2.  **Create Netlify Site:**
    *   Log in to your Netlify account.
    *   Click "Add new site" > "Import an existing project".
    *   Choose "Deploy with GitHub" and authorize Netlify to access your repositories.
    *   Select the GitHub repository containing your Text Quest RPG project.

3.  **Configure Netlify Build Settings:**
    *   Netlify will likely ask for build settings. Configure them as follows:
        *   **Repository:** Should already be selected.
        *   **Branch to deploy:** `main` (or your primary branch).
        *   **Base directory:** (Leave blank unless your project has a more complex monorepo structure).
        *   **Build command:** (Leave blank). Our client is static and doesn't need a build step.
        *   **Publish directory:** `client`
            *   **IMPORTANT:** This tells Netlify that your website files (`index.html`, `styles.css`, `script.js`) are located inside the `client` folder within your repository. **If this is not set correctly, you will get a "Page not found" error.**
    *   Click "Deploy site".

4.  **Wait for Deployment:**
    *   Netlify will deploy the contents of your `client` directory.
    *   Once finished (it should say "Published"), Netlify will provide you with a URL (e.g., `your-site-name.netlify.app`). This is where your game client will be accessible.

## Part 2: Hosting the Server (Backend) on Render

Render can host Node.js applications like our WebSocket server.

1.  **Create Render Web Service:**
    *   Log in to your Render account.
    *   Click the "New +" button and select "Web Service".
    *   Choose "Build and deploy from a Git repository" and click "Next".
    *   Connect your GitHub account if you haven't already.
    *   Select the GitHub repository containing your Text Quest RPG project and click "Connect".

2.  **Configure Render Web Service:**
    *   **Name:** Give your service a unique name (e.g., `text-quest-server`). This name will be part of its URL.
    *   **Region:** Choose a region geographically close to you or your players.
    *   **Branch:** `main` (or your primary branch).
    *   **Root Directory:** `server`
        *   **IMPORTANT:** This tells Render that the code for this service (including `package.json` and `server.js`) is located inside the `server` folder within your repository.
    *   **Runtime:** `Node`.
    *   **Build Command:** `npm install` (Render runs this command within the Root Directory).
    *   **Start Command:** `node server.js` (This command runs `server.js` to start your application).
    *   **Instance Type:** Choose `Free`. Be aware of the limitations (spinning down after inactivity).

3.  **Deploy:**
    *   Click "Create Web Service".

4.  **Wait for Deployment:**
    *   Render will build your server (running `npm install`) and then start it (running `node server.js`).
    *   Monitor the logs for any errors during build or startup.
    *   Once live, Render will provide you with a URL for your service (e.g., `your-service-name.onrender.com`). **Note this URL down.**

## Part 3: Connecting Client to Server (Production URL)

Now you need to tell the deployed client (on Netlify) how to connect to the deployed server (on Render).

1.  **Edit Client Code:**
    *   Open the `client/script.js` file in your local project code.
    *   Find the line that defines the `websocketURL`:
        ```javascript
        // TODO: Replace with your production Render WebSocket URL (wss://...) when deploying
        // See hosting_instructions.txt for details.
        const websocketURL = 'ws://localhost:3000'; // Connect to local server (for development)
        ```
    *   **Replace** the `'ws://localhost:3000'` with the WebSocket URL of your **Render** server.
        *   Use the URL Render gave you, but change `https://` to `wss://` (WebSocket Secure).
        *   Example: If your Render URL is `https://text-quest-server.onrender.com`, the WebSocket URL will be `wss://text-quest-server.onrender.com`.
        *   The line should look like this (replace with your actual URL):
            ```javascript
            const websocketURL = 'wss://your-service-name.onrender.com'; // Connect to PRODUCTION server
            ```

2.  **Commit and Push:**
    *   Save the changes to `client/script.js`.
    *   Commit the change to Git: `git commit -am "Update WebSocket URL for production"`
    *   Push the commit to GitHub: `git push origin main`

3.  **Netlify Auto-Redeploy:**
    *   Netlify automatically detects changes pushed to your connected GitHub branch.
    *   It will trigger a new deployment of your client with the updated server URL. Wait for this new deployment to finish (check the "Deploys" section on Netlify).

## Part 4: Testing the Deployed Game

1.  **Open Client:** Navigate to your Netlify URL (e.g., `your-site-name.netlify.app`) in your browser.
2.  **Check Connection:**
    *   You should see the initial welcome message and menu prompt ("Welcome to Text Quest RPG!...") displayed in the game output area.
    *   Open your browser's developer console (usually F12). You should see "Client script loaded." and "WebSocket connection opened".
    *   Check your Render server logs (on the Render dashboard). You should see "Client connected".
3.  **Play:**
    *   Type `start` in the input field and press Enter.
    *   You should receive the starting game message.
    *   Try other commands like `look`, `north`, `inv`, etc.
4.  **Troubleshooting:**
    *   **Client Errors:** Check the browser console for any JavaScript errors.
    *   **Connection Errors:** If the WebSocket doesn't connect, double-check the `websocketURL` in `client/script.js` and ensure your Render server is running without errors (check Render logs).
    *   **Server Errors:** Check the Render server logs for any errors related to command processing or game logic.

## Important Notes

*   **Render Free Tier:** The free tier service may "spin down" after 15 minutes of inactivity. The first connection after it spins down might take 30 seconds or more to wake the server up. This is normal for the free tier.
*   **Security:** This setup has minimal security. For a real game, consider authentication, input validation, and protecting against common web vulnerabilities.
*   **Multiplayer State:** The current server implementation (as of this rewrite stage) might still have issues with truly independent states if multiple users connect simultaneously (e.g., items/enemies disappearing globally). This requires more advanced state management.