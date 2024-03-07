document.addEventListener('DOMContentLoaded', function () {
    const captureButton = document.querySelector('.capture-button');
    const cameraFeed = document.getElementById('camera-feed');
    const textOutput = document.getElementById('text-output');

    // Event listener for the capture button
    captureButton.addEventListener('click', function () {
        // Access the camera feed
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                cameraFeed.srcObject = stream;
                cameraFeed.onloadedmetadata = function (e) {
                    cameraFeed.play();
                    captureImageFromCamera();
                };
            })
            .catch(function (err) {
                console.error('Error accessing camera:', err);
            });
    });

    // Function to capture image from camera feed and recognize text
    function captureImageFromCamera() {
        // Create a canvas element to capture the current frame from the video feed
        const canvas = document.createElement('canvas');
        canvas.width = cameraFeed.videoWidth;
        canvas.height = cameraFeed.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

        // Convert the captured image to a base64 encoded data URL
        const imageDataURL = canvas.toDataURL('image/jpeg');

        // Use Tesseract.js to recognize text from the captured image
        Tesseract.recognize(
            imageDataURL,
            'eng',
            { logger: m => console.log(m) } // Optional logger
        ).then(({ data: { text } }) => {
            displayText(text);
        }).catch(err => {
            console.error('Error recognizing text:', err);
        });
    }

    // Display extracted text
    function displayText(text) {
        textOutput.textContent = text;
    }
});
