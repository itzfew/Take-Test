document.addEventListener('DOMContentLoaded', () => {
    const addSubjectButton = document.getElementById('addSubjectButton');
    const startButton = document.getElementById('startButton');
    const submitButton = document.getElementById('submitButton');
    const questionsContainer = document.getElementById('questionsContainer');
    const testContainer = document.getElementById('testContainer');
    const timerElement = document.getElementById('timeLeft');
    let timerInterval;
    let remainingTime = 0;

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
        
        subjects.forEach((subject, index) => {
            const subjectName = subject.querySelector('.subjectName').value;
            const questionCount = parseInt(subject.querySelector('.questionCount').value);

            for (let i = 1; i <= questionCount; i++) {
                questionsHtml += `
                    <div class="question">
                        <h3>${subjectName} - Question ${i}</h3>
                        <input type="radio" name="q${index}_${i}" value="A"> Option A<br>
                        <input type="radio" name="q${index}_${i}" value="B"> Option B<br>
                        <input type="radio" name="q${index}_${i}" value="C"> Option C<br>
                        <input type="radio" name="q${index}_${i}" value="D"> Option D<br>
                    </div>
                `;
            }
        });

        questionsContainer.innerHTML = questionsHtml;
        testContainer.classList.remove('hidden');
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

        localStorage.setItem('testResults', JSON.stringify(answers));
        alert('Test submitted! Results have been saved.');
    });

    function startTimer() {
        const totalQuestions = document.querySelectorAll('.question').length;
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
});
