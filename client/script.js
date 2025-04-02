console.log("Client script loaded.");

const gameOutput = document.getElementById('gameOutput');
const commandInput = document.getElementById('commandInput');

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
        updateGameOutput(event.data);
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

function updateGameOutput(message) {
    gameOutput.innerHTML += `<p>${message}</p>`;
}

commandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const command = commandInput.value;
        console.log('Command entered:', command);
        updateGameOutput(`> ${command}`); // Display the command in the game output
        websocket.send(command); // Send the command to the server
        commandInput.value = ''; // Clear the input field
    }
});

connectWebSocket(); // Establish WebSocket connection when script loads
updateGameOutput("Welcome to the text-based RPG!"); // Initial game message