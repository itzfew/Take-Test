document.addEventListener('DOMContentLoaded', () => {
    const testContainer = document.getElementById('testContainer');
    const questionsContainer = document.getElementById('questionsContainer');
    const navigationContainer = document.getElementById('navigationContainer');
    const timerElement = document.getElementById('timeLeft');
    const submitButton = document.getElementById('submitButton');
    let timerInterval;
    let remainingTime = 0;

    // Load subjects and questions
    loadTest();

    submitButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        const answers = Array.from(document.querySelectorAll('input[type="radio"]:checked')).map(input => ({
            question: input.name,
            answer: input.value
        }));

        localStorage.setItem('testAnswers', JSON.stringify(answers));

        const allResults = JSON.parse(localStorage.getItem('allResults') || '[]');
        allResults.push(answers);
        localStorage.setItem('allResults', JSON.stringify(allResults));

        window.location.href = 'results.html';
    });

    function loadTest() {
        const subjectsData = JSON.parse(localStorage.getItem('subjectsData') || '[]');
        let questionsHtml = '';
        let navigationHtml = '';

        subjectsData.forEach((subject, index) => {
            for (let i = 1; i <= subject.questions; i++) {
                questionsHtml += `
                    <div class="question" id="question${index}_${i}" style="display:none;">
                        <h3>${subject.name} - Question ${i}</h3>
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

        document.querySelectorAll('.navigationButton').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                showQuestion(index);
            });
        });

        startTimer(subjectsData.reduce((total, subject) => total + subject.questions, 0) + 20);
    }

    function showQuestion(index) {
        document.querySelectorAll('.question').forEach(question => {
            question.style.display = 'none';
        });
        document.getElementById(`question${index}`).style.display = 'block';
    }

    function startTimer(totalQuestions) {
        const totalTime = totalQuestions * 60 + 20 * 60; // 1 min per question + 20 min extra
        remainingTime = totalTime;

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
