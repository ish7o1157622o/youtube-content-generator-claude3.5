// Text-to-Speech functionality
function setupTTS() {
    const synth = window.speechSynthesis;
    let speaking = false;

    document.querySelectorAll('.tts-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const text = document.getElementById(targetId).textContent;
            
            if (speaking) {
                synth.cancel();
                speaking = false;
                button.querySelector('i').classList.replace('fa-volume-mute', 'fa-volume-up');
            } else {
                const utterance = new SpeechSynthesisUtterance(text);
                synth.speak(utterance);
                speaking = true;
                button.querySelector('i').classList.replace('fa-volume-up', 'fa-volume-mute');
                
                utterance.onend = () => {
                    speaking = false;
                    button.querySelector('i').classList.replace('fa-volume-mute', 'fa-volume-up');
                };
            }
        });
    });
}

// Random background color generator
function setRandomBackground() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    document.body.style.backgroundColor = `rgb(${r},${g},${b})`;
}

// Initialize features
document.addEventListener('DOMContentLoaded', () => {
    setupTTS();
    setRandomBackground();
});
