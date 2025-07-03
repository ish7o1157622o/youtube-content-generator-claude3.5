const API_KEY = 'AIzaSyDmrIoEC6smBiVe2DwkP-IlGw-T0eSfKMA';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Form Submission
const form = document.getElementById('contentForm');
const generateBtn = document.getElementById('generateBtn');
const spinner = document.querySelector('.spinner');
const results = document.getElementById('results');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const videoTitle = document.getElementById('videoTitle').value;
    const videoLength = document.getElementById('videoLength').value;
    const videoDescription = document.getElementById('videoDescription').value;

    // Show loading state
    generateBtn.disabled = true;
    spinner.classList.remove('hidden');
    generateBtn.querySelector('.btn-text').classList.add('hidden');

    try {
        const prompt = `Generate YouTube content for a video with the following details:
            Topic: ${videoTitle}
            Length: ${videoLength} minutes
            Description: ${videoDescription}
            
            Please provide:
            1. An SEO-optimized title (under 70 characters)
            2. A full description including:
               - Introduction (100-150 words)
               - Timestamps (based on ${videoLength} minutes)
               - Relevant search queries
               - 15-20 hashtags
               - Call to action
            3. SEO-friendly tags`;

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();
        
        // Parse and display results
        const content = data.candidates[0].content.parts[0].text;
        displayResults(content);
        
        // Show results section
        results.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while generating content. Please try again.');
    } finally {
        // Reset loading state
        generateBtn.disabled = false;
        spinner.classList.add('hidden');
        generateBtn.querySelector('.btn-text').classList.remove('hidden');
    }
});

function displayResults(content) {
    // Parse the content and split into sections
    const sections = content.split('\n\n');
    
    document.getElementById('generatedTitle').textContent = sections[0];
    document.getElementById('generatedDescription').innerHTML = sections[1];
    document.getElementById('generatedTags').textContent = sections[2];
}

// Copy buttons
document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.dataset.target;
        const content = document.getElementById(targetId).textContent;
        
        navigator.clipboard.writeText(content).then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        });
    });
});

// Export button
document.getElementById('exportBtn').addEventListener('click', () => {
    const title = document.getElementById('generatedTitle').textContent;
    const description = document.getElementById('generatedDescription').textContent;
    const tags = document.getElementById('generatedTags').textContent;
    
    const content = `YouTube Content\n\nTitle:\n${title}\n\nDescription:\n${description}\n\nTags:\n${tags}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youtube-content.txt';
    a.click();
    window.URL.revokeObjectURL(url);
});
