//set up variables

const body = document.querySelector('body');

const button = document.querySelector('#record');
//variable to track the state of center button
let startState = true;
let audioCtx;
//main block for doing the audio recording
if (navigator.mediaDevices.getUserMedia) {
    const constraints = { audio: true };
    let chunks = [];

    let onSuccess = function(stream) {
        const mediaRecorder = new MediaRecorder(stream);       
        
        visualize(stream)
        
        button.onclick = function() {
            const recording = document.getElementById("record")
            recording.classList.toggle("rec");
            recording.classList.toggle("notRec");
            if (startState) {
                mediaRecorder.start();
                console.log("recorder started");
                startState = false;
            } else {
                mediaRecorder.stop();
                startState = true;
            }
        }
        mediaRecorder.onstop = function(e) {
            const blob = new Blob(chunks, { 'type' : 'audio/wav' });
            chunks = [];
            console.log("recorder stopped");

            let data = new FormData()
            data.append('file', blob , 'file')

            fetch('http://localhost:8080/receive', {
                method: 'POST',
                body: data
            }).then(response => response.json()
            ).then(response => {
                let result = document.getElementById("result");
                let node = document.createTextNode(response);
                if (result.firstChild) {
                    result.removeChild(result.firstChild);
                }
                result.appendChild(node)
            });
        }
        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }
    }

    let onError = function(err) {
        console.error('The following error occured: ' + err);
    }

    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
    console.error('getUserMedia not supported on your browser!');
}
function visualize(stream) {
    if(!audioCtx) {
        audioCtx = new AudioContext();
    }

    const source = audioCtx.createMediaStreamSource(stream);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const visualizerArray = document.getElementsByClassName("listener");
    source.connect(analyser);
    renderFrame()
    function renderFrame() {
        analyser.getByteFrequencyData(dataArray);
        for( let i = 0; i < bufferLength; i++ ) {
            const fd = dataArray[i];
            const visualizer = visualizerArray[i];
            if( !visualizer ) {
                continue;
            }
            const visualizerHeight = Math.floor(Math.max(5, fd || 0)/5);
            visualizer.style.height = visualizerHeight + "vw";

        }
        window.requestAnimationFrame(renderFrame);
    }
}


// Images for description

let activeIndex = 0;
const images = document.getElementsByClassName("image");


function changeImage(int) {
	const currentSlide = document.querySelector(`[data-index="${activeIndex}"]`);
	if (int == "-1") {
		const nextIndex = activeIndex - 1 >= 0 ? activeIndex - 1 : images.length - 1;
		currentSlide.dataset.status = "after";
		const nextSlide = document.querySelector(`[data-index="${nextIndex}"]`);
		nextSlide.dataset.status = "becoming-active-from-before";

		setTimeout(() => {
			nextSlide.dataset.status = "active";
			activeIndex = nextIndex;
		});
	} else if (int == "1") {
		const nextIndex = activeIndex + 1 <= images.length - 1 ? activeIndex + 1 : 0;
		currentSlide.dataset.status = "before";
		const nextSlide = document.querySelector(`[data-index="${nextIndex}"]`);
		nextSlide.dataset.status = "becoming-active-from-after";

		setTimeout(() => {
			nextSlide.dataset.status = "active";
			activeIndex = nextIndex;
		});
	} else {
		console.error("Received bad input.")
	}
}

