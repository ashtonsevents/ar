document.addEventListener('DOMContentLoaded', function () {
    const introText = document.querySelector('.introtext');
    const captureButton = document.querySelector('.capture-button');
    const cameraContainer = document.getElementById('camera-container');
    const cameraFeed = document.getElementById('camera-feed');
    const textOutput = document.getElementById('text-output');

    // Initialize Tesseract.js worker
    const worker = Tesseract.createWorker({
        logger: m => console.log(m) // Optional logger
    });

    // Event listener for the capture button
    captureButton.addEventListener('click', function () {
        // Fade out intro text
        introText.style.transition = 'opacity 0.5s';
        introText.style.opacity = 0;

        // Fade in camera container
        cameraContainer.style.display = 'block';
        cameraContainer.style.transition = 'opacity 0.5s';
        cameraContainer.style.opacity = 1;

        // Access the camera feed
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                cameraFeed.srcObject = stream;
                cameraFeed.onloadedmetadata = function (e) {
                    cameraFeed.play();
                    startTextRecognition();
                };
            })
            .catch(function (err) {
                console.error('Error accessing camera:', err);
            });
    });

    // Start text recognition process
    async function startTextRecognition() {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        setInterval(async () => {
            const { data: { text } } = await worker.recognize(cameraFeed);
            processText(text);
        }, 1000); // Adjust the interval as needed
    }

    // Process extracted text
    function processText(text) {
        // Output the extracted text to the website
        textOutput.textContent = text;
    }
});
