const pictureElements = document.querySelectorAll('.cursor-pointer');
let isImageVisible = false;
let centeredImg;

function toggleImageDisplay(event) {
    const pic = event.currentTarget.querySelector('img');
    if (isImageVisible) {
        centeredImg.remove(); 
    } else {
        centeredImg = document.createElement('img');
        centeredImg.src = pic.src;
        centeredImg.alt = pic.alt;
        centeredImg.classList.add('centered-image');
        document.body.appendChild(centeredImg);
    }
    isImageVisible = !isImageVisible; 
}

pictureElements.forEach((element) => {
    element.addEventListener('click', toggleImageDisplay);
});

document.addEventListener('click', (event) => {
    if (isImageVisible && event.target === centeredImg) {
        toggleImageDisplay(event);
    }
});
