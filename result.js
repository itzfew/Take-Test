document.addEventListener('DOMContentLoaded', () => {
    const resultsContent = document.getElementById('resultsContent');
    const previousResultsContent = document.getElementById('previousResultsContent');
    const pdfViewer = document.getElementById('pdfViewer');

    // Load current results
    const currentResults = JSON.parse(localStorage.getItem('testResults') || '{}');
    displayResults(currentResults, resultsContent);

    // Load and display previous results
    const previousResults = JSON.parse(localStorage.getItem('allResults') || '[]');
    displayPreviousResults(previousResults, previousResultsContent);

    // Load the uploaded PDF
    const pdfUrl = localStorage.getItem('pdfUrl');
    if (pdfUrl) {
        pdfViewer.src = pdfUrl;
    }
});

function displayResults(results, container) {
    if (Object.keys(results).length === 0) {
        container.innerHTML = '<p>No results available.</p>';
        return;
    }

    let html = '<ul>';
    for (const [question, answer] of Object.entries(results)) {
        html += `<li><strong>${question}:</strong> ${answer}</li>`;
    }
    html += '</ul>';

    container.innerHTML = html;
}

function displayPreviousResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<p>No previous results available.</p>';
        return;
    }

    let html = '';
    results.forEach((result, index) => {
        html += `<div class="result">
            <h3>Result ${index + 1}</h3>
            <ul>`;
        for (const [question, answer] of Object.entries(result)) {
            html += `<li><strong>${question}:</strong> ${answer}</li>`;
        }
        html += `</ul>
        </div>`;
    });

    container.innerHTML = html;
}
