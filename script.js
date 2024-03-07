document.addEventListener('DOMContentLoaded', function () {
    const captureButton = document.querySelector('.capture-button');
    const cameraFeed = document.getElementById('camera-feed');
    const outputContainer = document.getElementById('output-container');

    // Initialize Tesseract.js worker
    const worker = Tesseract.createWorker({
        logger: m => console.log(m) // Optional logger
    });

    // Event listener for the capture button
    captureButton.addEventListener('click', async function () {
        try {
            // Access the camera feed
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraFeed.srcObject = stream;
            cameraFeed.onloadedmetadata = function (e) {
                cameraFeed.play();
                startTextRecognition();
            };
        } catch (err) {
            console.error('Error accessing camera:', err);
        }
    });

    // Start text recognition process
    async function startTextRecognition() {
        try {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');

            setInterval(async () => {
                const { data: { text } } = await worker.recognize(cameraFeed);
                displayText(text);
            }, 1000); // Adjust the interval as needed
        } catch (err) {
            console.error('Error initializing text recognition:', err);
        }
    }

    // Display extracted text
    function displayText(text) {
        // Create a new paragraph element
        const newText = document.createElement('p');
        newText.textContent = text;

        // Append the new text to the output container
        outputContainer.appendChild(newText);
    }
});
