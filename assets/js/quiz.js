(() => {
    const app = document.querySelector('#quiz-app');
    if (!app) return;

    const welcome = app.querySelector('[data-screen="0"]');
    const flow = app.querySelector('[data-screen="1"]');
    const screens = [...flow.querySelectorAll('[data-step]')];
    const progressArea = flow.querySelector('.quiz-progress-area');
    const progressTrack = flow.querySelector('.quiz-progress-track');
    const progressFill = flow.querySelector('.quiz-progress-fill');
    const progressAvatar = flow.querySelector('[data-progress-avatar]');
    const scoreOutput = flow.querySelector('[data-score]');
    const stepLabel = flow.querySelector('[data-step-label]');
    const progressLabel = flow.querySelector('[data-progress-label]');
    const continueButton = flow.querySelector('[data-action="continue"]');
    const storyButton = flow.querySelector('[data-action="continue-story"]');
    const regularControls = flow.querySelector('[data-controls]');
    const storyControls = flow.querySelector('[data-controls-story]');
    const validation = flow.querySelector('[data-validation]');
    const avatar = flow.querySelector('[data-avatar]');
    const answers = new Map();
    let current = 0;
    let profile = 'Praça';
    let gender = '';

    const updateScore = () => {
        const answeredProfileQuestions = [...answers.keys()].filter((step) => step >= 1 && step <= 5).length * 10;
        const decisionPoints = answers.get(6) === 'committed' ? 10 : 0;
        const questionPoints = answeredProfileQuestions + decisionPoints;
        const storyPoints = (current >= 8 ? 20 : 0) + (current >= 9 ? 20 : 0);
        const score = Math.min(100, questionPoints + storyPoints);
        scoreOutput.textContent = String(score);
        const resultScore = flow.querySelector('[data-result-score]');
        if (resultScore) {
            resultScore.textContent = String(score);
            if (current >= 9) {
                const isReady = score === 100;
                flow.querySelector('[data-result-title]').textContent = isReady ? 'APROVADO!' : 'VOCÊ ESTÁ QUASE LÁ!';
                flow.querySelector('[data-result-intro]').textContent = isReady
                    ? 'Seu perfil é ideal para ser'
                    : 'Estamos aqui para ajudar você a alcançar seus 100% de prontidão e buscar sua aprovação como';
                flow.querySelector('[data-result-suffix]').textContent = isReady ? '. Garanta sua vaga no método.' : '.';
            }
        }
    };

    const updateProfile = () => {
        flow.querySelectorAll('[data-profile]').forEach((el) => {
            el.textContent = profile;
        });
    };

    const updateProgress = () => {
        const percent = Math.round((current / screens.length) * 100);
        const position = 6 + ((current - 1) / (screens.length - 1)) * 88;
        progressFill.style.setProperty('--quiz-progress', `${percent}%`);
        progressTrack.style.setProperty('--quiz-progress', `${percent}%`);
        progressTrack.style.setProperty('--quiz-avatar-position', `${position}%`);
        progressTrack.setAttribute('aria-valuenow', String(percent));
        progressLabel.textContent = `${percent}%`;
        stepLabel.textContent = `Etapa ${current} de ${screens.length}`;
        progressAvatar.hidden = !gender;
        if (gender) avatar.src = `./assets/images/${gender}.webp`;
    };

    const updateControls = () => {
        const isQuestion = current >= 1 && current <= 6;
        const isStory = current === 7 || current === 8;
        regularControls.hidden = !isQuestion;
        storyControls.hidden = !isStory;
        continueButton.disabled = !answers.has(current);
        validation.textContent = '';
        if (current === 7) storyButton.textContent = 'Ver Solução';
        if (current === 8) storyButton.textContent = 'Quero Aprovação';
    };

    const render = (nextStep) => {
        current = nextStep;
        welcome.hidden = current !== 0;
        flow.hidden = current === 0;

        if (current === 0) return;

        screens.forEach((screen) => {
            screen.hidden = Number(screen.dataset.step) !== current;
        });
        updateProgress();
        updateScore();
        updateControls();

        const activeScreen = flow.querySelector(`[data-step="${current}"]`);
        const heading = activeScreen?.querySelector('h1');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus({ preventScroll: true });
        }
    };

    const restoreChoices = (step) => {
        const screen = flow.querySelector(`[data-step="${step}"]`);
        if (!screen) return;
        const stored = answers.get(step);
        screen.querySelectorAll('[data-choice]').forEach((button) => {
            const value = button.dataset.value || button.textContent.trim();
            button.setAttribute('aria-pressed', String(value === stored));
        });
    };

    flow.addEventListener('click', (event) => {
        const choice = event.target.closest('[data-choice]');
        if (!choice || choice.closest('[data-step]')?.dataset.step !== String(current)) return;

        const step = current;
        const value = choice.dataset.value || choice.textContent.trim();
        answers.set(step, value);
        choice.closest('[data-step]').querySelectorAll(`[data-choice="${choice.dataset.choice}"]`).forEach((button) => {
            button.setAttribute('aria-pressed', String(button === choice));
        });

        if (choice.dataset.choice === 'gender') {
            gender = value;
            progressAvatar.hidden = false;
            avatar.src = `./assets/images/${gender}.webp`;
        }
        if (choice.dataset.choice === 'education') {
            profile = value === 'oficial' ? 'Oficial' : 'Praça';
            updateProfile();
        }
        updateScore();
        continueButton.disabled = false;
        validation.textContent = '';
    });

    app.addEventListener('click', (event) => {
        const action = event.target.closest('[data-action]')?.dataset.action;
        if (action === 'start') {
            if (current === 0) {
                answers.clear();
                gender = '';
                profile = 'Praça';
                flow.querySelectorAll('[data-choice]').forEach((button) => button.setAttribute('aria-pressed', 'false'));
                updateProfile();
            }
            render(1);
            return;
        }
        if (action === 'back') {
            render(Math.max(0, current - 1));
            return;
        }
        if (action === 'continue') {
            if (!answers.has(current)) {
                validation.textContent = 'Selecione uma opção para continuar.';
                return;
            }
            render(current + 1);
            return;
        }
        if (action === 'continue-story') render(current + 1);
    });

    flow.querySelectorAll('[data-step]').forEach((screen) => {
        const step = Number(screen.dataset.step);
        screen.querySelectorAll('[data-choice]').forEach((button) => {
            button.setAttribute('aria-pressed', 'false');
        });
        restoreChoices(step);
    });

    progressArea.setAttribute('aria-label', 'Progresso do quiz');
})();
