console.log("Client script loaded.");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerSize = 20; // Size of the player square
const playerColor = 'blue'; // Color of the player
let playerX = 50; // Initial player X position
let playerY = 50; // Initial player Y position

let websocket;

function connectWebSocket() {
    websocket = new WebSocket('ws://localhost:3000'); // Connect to local server (for development)
    // For production, you'll need to change this to your deployed server URL (e.g., ws://your-render-app-url.onrender.com)

    websocket.onopen = () => {
        console.log('WebSocket connection opened');
        websocket.send('Hello from client!'); // Send a test message to the server on connection
    };

    websocket.onmessage = (event) => {
        console.log('Received message:', event.data);
        // --- Handle messages from server here ---
        // For now, just log them
    };

    websocket.onclose = () => {
        console.log('WebSocket connection closed');
        // --- Handle connection closed ---
        // Optionally, attempt to reconnect after a delay
        setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
    };

    websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // --- Handle WebSocket errors ---
    };
}

function drawPlayer() {
    ctx.fillStyle = playerColor;
    ctx.fillRect(playerX, playerY, playerSize, playerSize);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas each frame
    drawPlayer();
}

function gameLoop() {
    render();
    requestAnimationFrame(gameLoop);
}

connectWebSocket(); // Establish WebSocket connection when script loads
gameLoop(); // Start the game loop