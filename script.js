let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let currentStream;
let isFrontCamera = false;
let zoomLevel = 1;
let isInverted = false;
let isFlashOn = false;

// Access the camera
function startCamera(facingMode) {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
    }).then(stream => {
        currentStream = stream;
        video.srcObject = stream;
    }).catch(error => {
        console.error("Error accessing the camera: ", error);
    });
}

// Switch between front and rear camera
document.getElementById('switch-camera').addEventListener('click', () => {
    isFrontCamera = !isFrontCamera;
    startCamera(isFrontCamera ? "user" : "environment");
});

// Capture image
document.getElementById('capture').addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (isInverted) {
        invertColors();
    }
});

// Save image
document.getElementById('save').addEventListener('click', () => {
    let image = canvas.toDataURL('image/png');
    let link = document.createElement('a');
    link.href = image;
    link.download = 'photo.png';
    link.click();
});

// Zoom in
document.getElementById('zoom-in').addEventListener('click', () => {
    zoomLevel += 0.1;
    video.style.transform = `scale(${zoomLevel})`;
});

// Zoom out
document.getElementById('zoom-out').addEventListener('click', () => {
    zoomLevel -= 0.1;
    if (zoomLevel < 1) zoomLevel = 1;
    video.style.transform = `scale(${zoomLevel})`;
});

// Invert colors
document.getElementById('invert-color').addEventListener('click', () => {
    isInverted = !isInverted;
    if (isInverted) {
        invertColors();
    } else {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
});

function invertColors() {
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];     // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
    }

    context.putImageData(imageData, 0, 0);
}

// Toggle flash (not supported in all browsers)
document.getElementById('flash').addEventListener('click', () => {
    isFlashOn = !isFlashOn;
    if (isFlashOn) {
        video.style.filter = 'brightness(150%)';
    } else {
        video.style.filter = 'brightness(100%)';
    }
});

// Start with the rear camera by default
startCamera("environment");