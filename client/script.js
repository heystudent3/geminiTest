console.log("Client script loaded.");

const gameOutput = document.getElementById('gameOutput');
const commandInput = document.getElementById('commandInput');

let websocket;

function connectWebSocket() {
    // TODO: Replace with your production Render WebSocket URL (wss://...) when deploying
    // See hosting_instructions.txt for details.
    const websocketURL = 'ws://localhost:3000'; // Connect to local server (for development)
    websocket = new WebSocket(websocketURL);

    websocket.onopen = () => {
        console.log('WebSocket connection opened');
        // Server will send initial state upon connection
    };

    websocket.onmessage = (event) => {
        console.log('Received message:', event.data);
        updateGameOutput(event.data);
    };

    websocket.onclose = () => {
        console.log('WebSocket connection closed');
        updateGameOutput("Connection closed. Reconnecting...");
        setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
    };

    websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        updateGameOutput(`WebSocket error: ${error}`);
    };
}

function updateGameOutput(message) {
    // Handle potential multi-line messages
    const lines = message.split('\n');
    lines.forEach(line => {
        const messageElement = document.createElement('p');
        // Use non-breaking space for empty lines to ensure they take up space
        messageElement.textContent = line || '\u00A0';
        gameOutput.appendChild(messageElement);
    });
    gameOutput.scrollTop = gameOutput.scrollHeight; // Scroll to bottom
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
// Server will send the initial welcome message/state