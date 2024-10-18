let canvas = new fabric.Canvas('presentationCanvas', {
  width: 800,
  height: 600,
  backgroundColor: '#fff',
});

let slides = [];
let currentSlideIndex = 0;

// Save current canvas to slide array and add thumbnail to sidebar
function saveCurrentSlide() {
  const slideJSON = JSON.stringify(canvas);
  slides[currentSlideIndex] = slideJSON;
  updateSlideList();
}

// Load the selected slide into the canvas
function loadSlide(index) {
  currentSlideIndex = index;
  canvas.clear();
  canvas.loadFromJSON(slides[index], canvas.renderAll.bind(canvas));
  updateSlideList();  // Update the sidebar to highlight the current slide
}

// Add a new slide to the presentation
function addNewSlide() {
  saveCurrentSlide();
  currentSlideIndex = slides.length;
  slides.push(JSON.stringify(canvas)); // Add the new slide
  canvas.clear();
  updateSlideList();
}

// Update the sidebar with thumbnails of slides
function updateSlideList() {
  const slideList = document.getElementById('slideList');
  slideList.innerHTML = ''; // Clear existing list
  
  slides.forEach((slide, index) => {
    const li = document.createElement('li');
    li.innerText = `Slide ${index + 1}`;
    li.onclick = () => loadSlide(index);

    if (index === currentSlideIndex) {
      li.style.backgroundColor = '#666'; // Highlight the active slide
    }

    slideList.appendChild(li);
  });

  document.getElementById('currentSlideIndex').innerText = currentSlideIndex + 1;
  document.getElementById('totalSlides').innerText = slides.length;
}

// Handle the image upload
function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(f) {
    const data = f.target.result;
    fabric.Image.fromURL(data, function(img) {
      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
      });
      canvas.add(img);
      canvas.renderAll();
    });
  };

  reader.readAsDataURL(file);
}

// Trigger file upload dialog
function triggerFileUpload() {
  document.getElementById('imageLoader').click();
}

// Add a text box to the canvas
function addTextBox() {
  const text = new fabric.IText('Edit text', {
    left: 150,
    top: 150,
    fontFamily: 'Arial',
    fontSize: 24,
    fill: '#000',
  });
  canvas.add(text);
  canvas.setActiveObject(text);
}

// Add a rectangle to the canvas
function addRectangle() {
  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    width: 200,
    height: 100,
    fill: 'red',
  });
  canvas.add(rect);
}

// Add a circle to the canvas
function addCircle() {
  const circle = new fabric.Circle({
    left: 150,
    top: 150,
    radius: 50,
    fill: 'green',
  });
  canvas.add(circle);
}

// Bring the selected object forward
function bringForward() {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.bringForward(activeObject);
  }
}

// Send the selected object backward
function sendBackward() {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.sendBackwards(activeObject);
  }
}

// Delete the selected object
function deleteObject() {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.remove(activeObject);
  }
}

// Save the canvas as an image
function saveAsImage(type) {
  const dataURL = canvas.toDataURL({ format: type });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `slide-${currentSlideIndex + 1}.${type}`;
  link.click();
}

// Enter full-screen presentation mode
function enterPresentationMode() {
  const dataURL = canvas.toDataURL();
  const newWindow = window.open();
  newWindow.document.write(`<img src="${dataURL}" style="width:100%;height:100%">`);
}

// Go to the previous slide
function goToPreviousSlide() {
  if (currentSlideIndex > 0) {
    saveCurrentSlide();
    currentSlideIndex--;
    loadSlide(currentSlideIndex);
  }
}

// Go to the next slide
function goToNextSlide() {
  if (currentSlideIndex < slides.length - 1) {
    saveCurrentSlide();
    currentSlideIndex++;
    loadSlide(currentSlideIndex);
  }
}

// Delete the current slide
function deleteCurrentSlide() {
  if (slides.length > 1) {
    slides.splice(currentSlideIndex, 1);
    currentSlideIndex = Math.max(0, currentSlideIndex - 1);
    loadSlide(currentSlideIndex);
    updateSlideList();
  }
}

// Handle font size, family, and color changes
function changeFontSize() {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'i-text') {
    activeObject.set('fontSize', parseInt(document.getElementById('fontSize').value));
    canvas.renderAll();
  }
}

function changeFontFamily() {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'i-text') {
    activeObject.set('fontFamily', document.getElementById('fontFamily').value);
    canvas.renderAll();
  }
}

function changeFontColor() {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'i-text') {
    activeObject.set('fill', document.getElementById('fontColor').value);
    canvas.renderAll();
  }
}

// Add fade-in animation
function fadeIn() {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.set({ opacity: 0 });
    canvas.renderAll();
    fabric.util.animate({
      startValue: 0,
      endValue: 1,
      duration: 1000,
      onChange: function(value) {
        activeObject.set({ opacity: value });
        canvas.renderAll();
      }
    });
  }
}

// Add fade-out animation
function fadeOut() {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    fabric.util.animate({
      startValue: 1,
      endValue: 0,
      duration: 1000,
      onChange: function(value) {
        activeObject.set({ opacity: value });
        canvas.renderAll();
      },
      onComplete: function() {
        canvas.remove(activeObject);
      }
    });
  }
}

// Initialize the first slide
slides.push(JSON.stringify(canvas));
updateSlideList();
