submitButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    const formData = new FormData(document.querySelector('form'));
    const answers = {};

    for (const [key, value] of formData.entries()) {
        if (value) {
            answers[key] = value;
        }
    }

    // Save current test results
    localStorage.setItem('testResults', JSON.stringify(answers));

    // Save test results to allResults
    const allResults = JSON.parse(localStorage.getItem('allResults') || '[]');
    allResults.push(answers);
    localStorage.setItem('allResults', JSON.stringify(allResults));

    // Save the PDF URL
    const pdfFile = document.getElementById('pdfUpload').files[0];
    if (pdfFile) {
        const pdfUrl = URL.createObjectURL(pdfFile);
        localStorage.setItem('pdfUrl', pdfUrl);
    }

    alert('Test submitted! Results have been saved.');
});
