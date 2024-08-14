document.addEventListener('DOMContentLoaded', () => {
    const addSubjectButton = document.getElementById('addSubjectButton');
    const startButton = document.getElementById('startButton');
    const subjectsContainer = document.getElementById('subjectsContainer');
    
    // Load default subjects
    loadDefaultSubjects();

    addSubjectButton.addEventListener('click', () => {
        const newSubject = document.createElement('div');
        newSubject.className = 'subject';
        newSubject.innerHTML = `
            <label for="subjectName">Subject Name:</label>
            <input type="text" class="subjectName">
            <label for="questionCount">Number of Questions:</label>
            <input type="number" class="questionCount">
        `;
        subjectsContainer.appendChild(newSubject);
    });

    startButton.addEventListener('click', () => {
        const subjects = Array.from(document.querySelectorAll('.subject'));
        const subjectsData = subjects.map(subject => ({
            name: subject.querySelector('.subjectName').value,
            questions: parseInt(subject.querySelector('.questionCount').value)
        }));

        const pdfFile = document.getElementById('pdfUpload').files[0];
        const pdfUrl = pdfFile ? URL.createObjectURL(pdfFile) : '';

        localStorage.setItem('subjectsData', JSON.stringify(subjectsData));
        localStorage.setItem('pdfUrl', pdfUrl);

        window.location.href = 'test.html';
    });

    function loadDefaultSubjects() {
        const defaultSubjects = [
            { name: 'Biology', count: 100 },
            { name: 'Physics', count: 50 },
            { name: 'Chemistry', count: 50 }
        ];

        defaultSubjects.forEach(subject => {
            const subjectDiv = document.createElement('div');
            subjectDiv.className = 'subject';
            subjectDiv.innerHTML = `
                <label for="subjectName">Subject Name:</label>
                <input type="text" class="subjectName" value="${subject.name}">
                <label for="questionCount">Number of Questions:</label>
                <input type="number" class="questionCount" value="${subject.count}">
            `;
            subjectsContainer.appendChild(subjectDiv);
        });
    }
});
