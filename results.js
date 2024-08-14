document.addEventListener('DOMContentLoaded', () => {
    const resultsContent = document.getElementById('resultsContent');
    const previousResultsContent = document.getElementById('previousResultsContent');
    const pdfViewer = document.getElementById('pdfViewer');

    const pdfUrl = localStorage.getItem('pdfUrl');
    if (pdfUrl) {
        pdfViewer.src = pdfUrl;
    }

    const currentResults = JSON.parse(localStorage.getItem('testAnswers') || '[]');
    displayResults(currentResults, resultsContent);

    const previousResults = JSON.parse(localStorage.getItem('allResults') || '[]');
    displayPreviousResults(previousResults, previousResultsContent);
});

function displayResults(results, container) {
    if (Object.keys(results).length === 0) {
        container.innerHTML = '<p>No results available.</p>';
        return;
    }

    let html = '<ul>';
    Object.entries(results).forEach(([question, answer]) => {
        html += `<li><strong>${question}:</strong> ${answer}</li>`;
    });
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
        result.forEach(res => {
            html += `<li><strong>${res.question}:</strong> ${res.answer}</li>`;
        });
        html += `</ul>
        </div>`;
    });

    container.innerHTML = html;
}
