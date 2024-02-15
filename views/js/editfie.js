// Assuming you're using JavaScript to show the image preview
const imageInput = document.getElementById('imageInput');
const selectedFile = document.getElementById('selectedFile');

// Trigger file input click event when the button is clicked
selectedFile.addEventListener('click', function() {
    imageInput.click();
});

// Function to update the selected file name in the label
imageInput.addEventListener('change', function() {
    if (this.files.length > 0) {
        selectedFile.textContent = this.files[0].name;
    } else {
        selectedFile.textContent = 'Choose file';
    }
});
