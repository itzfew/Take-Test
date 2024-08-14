document.addEventListener('DOMContentLoaded', () => {
    const examTitle = document.getElementById('examTitle');
    const pdfViewer = document.getElementById('pdfViewer');
    const subjectList = document.getElementById('subjectList');
    const questionContainer = document.getElementById('questionContainer');
    const timerElement = document.getElementById('timeLeft');
    const submitButton = document.getElementById('submitButton');
    
    const subjectsData = JSON.parse(localStorage.getItem('subjectsData') || '[]');
    const pdfUrl = localStorage.getItem('pdfUrl');
    const answers = {};
    let timerInterval;
    let remainingTime;

    examTitle.textContent = 'Test';
    if (pdfUrl) {
        loadPDF(pdfUrl);
    }

    let questionIndex = 0;
    subjectsData.forEach((subject, index) => {
        // Add to subject list
        const subjectItem = document.createElement('li');
        subjectItem.textContent = subject.name;
        subjectItem.addEventListener('click', () => {
            displayQuestions(subject, index);
        });
        subjectList.appendChild(subjectItem);
    });

    function loadPDF(url) {
        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(pdf => {
            const numPages = pdf.numPages;
            const viewer = document.getElementById('pdfViewer');
            viewer.innerHTML = ''; // Clear previous pages

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                pdf.getPage(pageNum).then(page => {
                    const scale = 1.5;
                    const viewport = page.getViewport({ scale });

                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    viewer.appendChild(canvas);

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                });
            }
        }).catch(error => {
            console.error('Error loading PDF:', error);
        });
    }

    function displayQuestions(subject, subjectIndex) {
        let questionsHtml = '';
        for (let i = 1; i <= subject.questions; i++) {
            questionsHtml += `
                <div class="question" id="question${subjectIndex}_${i}">
                    <h3>${subject.name} - Question ${i}</h3>
                    <input type="radio" name="q${subjectIndex}_${i}" value="A"> Option A<br>
                    <input type="radio" name="q${subjectIndex}_${i}" value="B"> Option B<br>
                    <input type="radio" name="q${subjectIndex}_${i}" value="C"> Option C<br>
                    <input type="radio" name="q${subjectIndex}_${i}" value="D"> Option D<br>
                </div>
            `;
        }
        questionContainer.innerHTML = questionsHtml;
        startTimer(subjectsData.reduce((total, subject) => total + subject.questions, 0) + 20);
    }

    function startTimer(totalQuestions) {
        const totalTime = totalQuestions * 60 + 20 * 60; // 1 min per question + 20 min extra
        remainingTime = totalTime;

        timerInterval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                submitTest();
                return;
            }
            remainingTime--;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 1000);
    }

    submitButton.addEventListener('click', submitTest);

    function submitTest() {
        clearInterval(timerInterval);
        const selectedOptions = Array.from(document.querySelectorAll('input[type=radio]:checked'));
        selectedOptions.forEach(option => {
            const questionId = option.name;
            answers[questionId] = option.value;
        });

        localStorage.setItem('testAnswers', JSON.stringify(answers));

        // Save result and navigate to results page
        const allResults = JSON.parse(localStorage.getItem('allResults') || '[]');
        allResults.push(Object.keys(answers).map(key => ({
            question: key,
            answer: answers[key]
        })));
        localStorage.setItem('allResults', JSON.stringify(allResults));
        
        window.location.href = 'results.html';
    }
});
