let qrCode;

document.addEventListener('DOMContentLoaded', function () {
    qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        data: "https://vmsd.in",
        dotsOptions: {
            color: "#000",
        },
        backgroundOptions: {
            color: "#fff",
        },
    });

    try {
        qrCode.append(document.getElementById("qrcode"));
        setupEventListeners(); // ✅ Attach all listeners
        showToast("QR code generator loaded!");
    } catch (error) {
        console.error("Error appending QR code:", error);
        showToast("Error loading QR code generator.", "error");
    }
});

function setupEventListeners() {
    document.getElementById('text').addEventListener('input', () => {
        qrCode.update({ data: document.getElementById('text').value });
        detectContentType();
        showToast("Content updated!");
    });

    document.getElementById('size').addEventListener('input', (e) => {
        const size = parseInt(e.target.value);
        document.getElementById('sizeValue').textContent = size + 'px';
        qrCode.update({ width: size, height: size });
        showToast("Size updated to " + size + "px!");
    });

    document.getElementById('margin').addEventListener('input', (e) => {
        const margin = parseInt(e.target.value);
        document.getElementById('marginValue').textContent = margin;
        qrCode.update({ imageOptions: { margin: margin } });
        showToast("Margin updated to " + margin + "!");
    });

    document.getElementById('dotsStyle').addEventListener('change', (e) => {
        qrCode.update({ dotsOptions: { type: e.target.value } });
        showToast("Dots style changed to " + e.target.value + "!");
    });

    document.getElementById('cornersSquareStyle').addEventListener('change', (e) => {
        qrCode.update({ cornersSquareOptions: { type: e.target.value } });
        showToast("Corners square style changed to " + e.target.value + "!");
    });

    document.getElementById('cornersDotStyle').addEventListener('change', (e) => {
        qrCode.update({ cornersDotOptions: { type: e.target.value } });
        showToast("Corners dot style changed to " + e.target.value + "!");
    });

    document.getElementById('foreground').addEventListener('change', updateColors);
    document.getElementById('color2').addEventListener('change', updateColors);
    document.getElementById('gradientType').addEventListener('change', updateColors);
    document.getElementById('gradientRotation').addEventListener('input', updateColors);

    document.getElementById('background').addEventListener('change', updateBackground);
    document.getElementById('background2').addEventListener('change', updateBackground);
    document.getElementById('backgroundGradientType').addEventListener('change', (e) => {
        const isRadial = e.target.value === 'radial';
        document.getElementById('backgroundGradientRotation').disabled = isRadial;
        updateBackground();
        showToast("Background gradient type changed to " + e.target.value + "!");
    });
    document.getElementById('backgroundGradientRotation').addEventListener('input', updateBackground);

    document.getElementById('bgImageInput').addEventListener('change', handleBgImageUpload);
    document.getElementById('removeBgImageBtn').addEventListener('click', removeBgImage);

    document.getElementById('logoInput').addEventListener('change', handleLogoUpload);
    document.getElementById('removeLogoBtn').addEventListener('click', removeLogo);

    document.getElementById('logoSize').addEventListener('input', (e) => {
        const size = parseInt(e.target.value) / 100;
        document.getElementById('logoSizeValue').textContent = (size * 100) + '%';
        qrCode.update({ imageOptions: { imageSize: size } });
        showToast("Logo size updated to " + (size * 100) + "%!");
    });

    document.getElementById('logoOpacity').addEventListener('input', (e) => {
        const opacity = parseFloat(e.target.value);
        document.getElementById('logoOpacityValue').textContent = (opacity * 100) + '%';
        qrCode.update({ imageOptions: { opacity: opacity } });
        showToast("Logo opacity updated to " + (opacity * 100) + "%!");
    });
}

function detectContentType() {
    const text = document.getElementById('text').value.trim();
    const iconElement = document.getElementById('contentIcon');
    const typeElement = document.getElementById('contentType');

    if (!text) {
        iconElement.textContent = '📝';
        typeElement.textContent = 'Enter content to generate QR code';
        typeElement.className = 'content-type';
        return;
    }

    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    const httpRegex = /^https?:\/\//i;

    if (urlRegex.test(text) || httpRegex.test(text)) {
        iconElement.textContent = '🌐';
        typeElement.textContent = 'Website URL detected';
        typeElement.className = 'content-type url';
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(text)) {
        iconElement.textContent = '📧';
        typeElement.textContent = 'Email address detected';
        typeElement.className = 'content-type email';
        return;
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d]{10,}$/;
    if (phoneRegex.test(text.replace(/[\s\-\(\) ]/g, ''))) {
        iconElement.textContent = '📞';
        typeElement.textContent = 'Phone number detected';
        typeElement.className = 'content-type phone';
        return;
    }

    if (text.toLowerCase().startsWith('wifi:')) {
        iconElement.textContent = '📶';
        typeElement.textContent = 'WiFi credentials detected';
        typeElement.className = 'content-type';
        return;
    }

    if (text.toLowerCase().startsWith('sms:') || text.toLowerCase().startsWith('smsto:')) {
        iconElement.textContent = '💬';
        typeElement.textContent = 'SMS message detected';
        typeElement.className = 'content-type';
        return;
    }

    iconElement.textContent = '📝';
    typeElement.textContent = 'Plain text content';
    typeElement.className = 'content-type text';
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            qrCode.update({ image: e.target.result });
            document.getElementById('logoPreview').src = e.target.result;
            document.getElementById('logoPreviewContainer').style.display = 'inline-block';
            showToast("Logo uploaded!");
        };
        reader.readAsDataURL(file);
    }
}

function removeLogo() {
    qrCode.update({ image: "" });
    document.getElementById('logoInput').value = '';
    document.getElementById('logoPreviewContainer').style.display = 'none';
    showToast("Logo removed!");
}

function updateColors() {
    const color1 = document.getElementById('foreground').value;
    const color2 = document.getElementById('color2').value;
    const type = document.getElementById('gradientType').value;
    const rotation = document.getElementById('gradientRotation').value;

    const gradient = {
        type,
        rotation,
        colorStops: [
            { offset: 0, color: color1 },
            { offset: 1, color: color2 }
        ]
    };

    qrCode.update({
        dotsOptions: { gradient },
        cornersSquareOptions: { gradient },
        cornersDotOptions: { gradient }
    });

    showToast("Colors updated!");
}

function updateBackground() {
    const color1 = document.getElementById('background').value;
    const color2 = document.getElementById('background2').value;
    const type = document.getElementById('backgroundGradientType').value;
    const rotation = parseFloat(document.getElementById('backgroundGradientRotation').value) * (Math.PI / 180);

    let backgroundOptions = {};

    if (color1 === color2) {
        // Solid color
        backgroundOptions = {
            color: color1
        };
    } else {
        // Gradient
        backgroundOptions = {
            gradient: {
                type,
                rotation,
                colorStops: [
                    { offset: 0, color: color1 },
                    { offset: 1, color: color2 }
                ]
            }
        };
    }

    qrCode.update({
        backgroundOptions: backgroundOptions
    });

    showToast("Background updated!");
}

function handleBgImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            qrCode.update({ backgroundOptions: { image: e.target.result } });
            document.getElementById('removeBgImageBtn').style.display = 'block';
            showToast("Background image uploaded!");
        };
        reader.readAsDataURL(file);
    }
}

function removeBgImage() {
    qrCode.update({ backgroundOptions: { image: "" } });
    document.getElementById('bgImageInput').value = '';
    document.getElementById('removeBgImageBtn').style.display = 'none';
    showToast("Background image removed!");
}

function downloadSVG() {
    qrCode.download({ name: "qrcode", extension: "svg" });
    showToast("Downloading SVG...");
}

function downloadPNG() {
    qrCode.download({ name: "qrcode", extension: "png" });
    showToast("Downloading PNG...");
}

// Toast Notification Function
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || (() => {
        const div = document.createElement('div');
        div.id = 'toast-container';
        document.body.appendChild(div);
        return div;
    })();

    // Limit to a maximum of 3 toasts
    while (toastContainer.children.length >= 3) {
        toastContainer.removeChild(toastContainer.children[0]);
    }

    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10); // Small delay to trigger CSS transition

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}