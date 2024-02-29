const pic1 = document.getElementById('pic1');
let isImageVisible = false;
let centeredImg;

function toggleImageDisplay() {
    if (isImageVisible) {
        centeredImg.remove(); 
    } else {
       
        centeredImg = document.createElement('img');
        centeredImg.src = pic1.src;
        centeredImg.alt = pic1.alt;
        centeredImg.classList.add('centered-image');
        document.body.appendChild(centeredImg);
    }
    isImageVisible = !isImageVisible; 
}


pic1.addEventListener('click', toggleImageDisplay);


document.addEventListener('click', (event) => {
    if (isImageVisible && event.target === centeredImg) {
        toggleImageDisplay();
    }
});
