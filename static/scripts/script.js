//set up variables

const body = document.querySelector('body');

const button = document.querySelector('#record');
//variable to track the state of center button
let startState = true;

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.')
    const constraints = { audio: true };
    let chunks = [];

    let onSuccess = function(stream) {
        const mediaRecorder = new MediaRecorder(stream);        
        button.onclick = function() {
            if (startState) {
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");
                body.style.backgroundColor = "#307D92";
                button.style.backgroundColor = "#8BE451";
                startState = false;
            } else {
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                console.log("recorder stopped");
                body.style.backgroundColor = "#8BE451"; //AEE13F
                button.style.backgroundColor = "#318BB1";    
                startState = true;
            }
        }
        
        mediaRecorder.onstop = function(e) {
            console.log("data available after MediaRecorder.stop() called.");
            
            const blob = new Blob(chunks, { 'type' : 'audio/wav' });
            chunks = [];
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            //audio.play();
            console.log("recorder stopped");

            let data = new FormData()
            data.append('file', blob , 'file')

            fetch('http://127.0.0.1:8080/receive', {
                method: 'POST',
                body: data

            }).then(response => response.json()
            ).then(response => {
                let para = document.createElement("p");
                let node = document.createTextNode(response);
                para.appendChild(node);
                para.setAttribute(
                    'style',
                    'font-size: 60px;color: #FFFFFF;justify-self:center',
                );
                
                console.log(response)
            });
            

        }

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }
    }

    let onError = function(err) {
        console.log('The following error occured: ' + err);
    }

    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
    console.log('getUserMedia not supported on your browser!');
}

function record() {
    const recording = document.getElementById("record")
	recording.classList.toggle("rec");
	recording.classList.toggle("notRec");
	allVisualizers = document.getElementsByClassName("listener");
	for (i = 0; i < allVisualizers.length; i++) {
		randVal = Math.floor(Math.random() * 11 + 1)
		allVisualizers.item(i).style.height = randVal.toString() + "vw"
	};
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

