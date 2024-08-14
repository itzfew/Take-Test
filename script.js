document.addEventListener('DOMContentLoaded', () => {
    const addSubjectButton = document.getElementById('addSubjectButton');
    const startButton = document.getElementById('startButton');
    const submitButton = document.getElementById('submitButton');
    const questionsContainer = document.getElementById('questionsContainer');
    const navigationContainer = document.getElementById('navigationContainer');
    const testContainer = document.getElementById('testContainer');
    const timerElement = document.getElementById('timeLeft');
    let timerInterval;
    let remainingTime = 0;
    let totalQuestions = 0;

    // Load default subjects
    loadDefaultSubjects();

    addSubjectButton.addEventListener('click', () => {
        const subjectsContainer = document.getElementById('subjectsContainer');
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
        const subjects = document.querySelectorAll('.subject');
        let questionsHtml = '';
        let navigationHtml = '';

        subjects.forEach((subject, index) => {
            const subjectName = subject.querySelector('.subjectName').value;
            const questionCount = parseInt(subject.querySelector('.questionCount').value);

            for (let i = 1; i <= questionCount; i++) {
                questionsHtml += `
                    <div class="question" id="question${index}_${i}">
                        <h3>${subjectName} - Question ${i}</h3>
                        <input type="radio" name="q${index}_${i}" value="A"> Option A<br>
                        <input type="radio" name="q${index}_${i}" value="B"> Option B<br>
                        <input type="radio" name="q${index}_${i}" value="C"> Option C<br>
                        <input type="radio" name="q${index}_${i}" value="D"> Option D<br>
                    </div>
                `;
                navigationHtml += `
                    <button class="navigationButton" data-index="${index}_${i}">Q${i}</button>
                `;
            }
        });

        questionsContainer.innerHTML = questionsHtml;
        navigationContainer.innerHTML = navigationHtml;
        testContainer.classList.remove('hidden');

        // Add event listeners to navigation buttons
        document.querySelectorAll('.navigationButton').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                showQuestion(index);
            });
        });

        totalQuestions = document.querySelectorAll('.question').length;
        startTimer();
    });

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
        window.location.href = 'result.html';  // Redirect to results page
    });

    function startTimer() {
        const totalTime = totalQuestions + 20; // 1 minute per question + 20 minutes extra
        remainingTime = totalTime * 60;

        timerInterval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                alert('Time is up!');
                return;
            }
            remainingTime--;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 1000);
    }

    function showQuestion(index) {
        document.querySelectorAll('.question').forEach(question => {
            question.style.display = 'none';
        });
        document.getElementById(`question${index}`).style.display = 'block';
    }

    function loadDefaultSubjects() {
        const subjectsContainer = document.getElementById('subjectsContainer');
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
