// Assuming you're using JavaScript to show the image preview
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

// Function to read the uploaded image and display it as a preview
imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});
