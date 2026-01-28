console.log('[onboarding.js] Script loaded successfully');

const state = {
    currentStep: 1,
    name: '',
    knowledge_level: '',
    life_stage: '',
    goal: '',
    income: 0
};

const INCOME_PRESETS = [10000, 15000, 25000, 40000, 60000, 100000];
const MIN_INCOME = 5000;
const MAX_INCOME = 200000;

function updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < state.currentStep) {
            step.classList.add('completed');
        } else if (index + 1 === state.currentStep) {
            step.classList.add('active');
        }
    });
    document.getElementById('currentStep').textContent = state.currentStep;
}

function showStep(stepNum) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`.step[data-step="${stepNum}"]`).classList.add('active');
    state.currentStep = stepNum;
    updateProgressBar();
}

function setupRadioGroup(groupId, stateKey, nextBtnId) {
    const group = document.getElementById(groupId);
    const nextBtn = document.getElementById(nextBtnId);
    
    group.querySelectorAll('.radio-option').forEach(option => {
        option.addEventListener('click', () => {
            group.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            option.querySelector('input').checked = true;
            state[stateKey] = option.dataset.value;
            if (nextBtn) nextBtn.disabled = false;
            checkStep3();
        });
    });
}

function checkStep3() {
    const step3Next = document.getElementById('step3Next');
    if (state.life_stage && state.goal) {
        step3Next.disabled = false;
    }
}

function updateSummary() {
    document.getElementById('summaryName').textContent = state.name;
    document.getElementById('summaryKnowledge').textContent = state.knowledge_level;
    document.getElementById('summaryLifeStage').textContent = state.life_stage;
    document.getElementById('summaryGoal').textContent = state.goal;
    
    document.getElementById('summaryIncome').textContent = `₹${state.income.toLocaleString('en-IN')}`;
}

function validateOnboarding() {
    if (!state.name || state.name.trim() === '') {
        return { valid: false, message: 'Please enter your name' };
    }
    if (!state.knowledge_level) {
        return { valid: false, message: 'Please select your knowledge level' };
    }
    if (!state.life_stage) {
        return { valid: false, message: 'Please select your life stage' };
    }
    if (!state.goal) {
        return { valid: false, message: 'Please select your primary goal' };
    }
    if (!state.income || state.income < MIN_INCOME || state.income > MAX_INCOME) {
        return { valid: false, message: 'Please select a valid income' };
    }
    return { valid: true };
}

async function submitOnboarding() {
    const validation = validateOnboarding();
    if (!validation.valid) {
        alert(validation.message);
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span> Creating...';

    try {
        const response = await fetch('/users/onboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: state.name,
                knowledge_level: state.knowledge_level,
                life_stage: state.life_stage,
                primary_goal: state.goal,
                income: state.income
            })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || 'Failed to create profile');
        }

        localStorage.setItem('finplay_profile', JSON.stringify(data));
        window.location.href = '/dashboard';
    } catch (error) {
        console.error('Error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Start My Journey <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        alert('Something went wrong. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const step1Next = document.getElementById('step1Next');

    nameInput.focus();

    nameInput.addEventListener('input', () => {
        state.name = nameInput.value.trim();
        step1Next.disabled = state.name.length < 2;
    });

    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && state.name.length >= 2) {
            showStep(2);
        }
    });

    step1Next.addEventListener('click', () => showStep(2));

    setupRadioGroup('knowledgeGroup', 'knowledge_level', 'step2Next');
    setupRadioGroup('lifeStageGroup', 'life_stage', null);
    setupRadioGroup('goalGroup', 'goal', null);

    document.getElementById('step2Back').addEventListener('click', () => showStep(1));
    document.getElementById('step2Next').addEventListener('click', () => showStep(3));

    document.getElementById('step3Back').addEventListener('click', () => showStep(2));
    document.getElementById('step3Next').addEventListener('click', () => showStep(4));

    const incomePresets = document.getElementById('incomePresets');
    const customIncomeContainer = document.getElementById('customIncomeContainer');
    const customIncomeInput = document.getElementById('customIncome');
    const step4Next = document.getElementById('step4Next');

    incomePresets.querySelectorAll('.income-preset').forEach(preset => {
        preset.addEventListener('click', () => {
            incomePresets.querySelectorAll('.income-preset').forEach(p => p.classList.remove('selected'));
            preset.classList.add('selected');
            
            const value = preset.dataset.value;
            if (value === 'custom') {
                customIncomeContainer.style.display = 'block';
                customIncomeInput.focus();
                const customVal = parseInt(customIncomeInput.value);
                if (customVal >= MIN_INCOME && customVal <= MAX_INCOME) {
                    state.income = customVal;
                    step4Next.disabled = false;
                } else {
                    state.income = 0;
                    step4Next.disabled = true;
                }
            } else {
                customIncomeContainer.style.display = 'none';
                state.income = parseInt(value);
                step4Next.disabled = false;
            }
        });
    });

    customIncomeInput.addEventListener('input', () => {
        const value = parseInt(customIncomeInput.value);
        if (value >= MIN_INCOME && value <= MAX_INCOME) {
            state.income = value;
            step4Next.disabled = false;
        } else {
            state.income = 0;
            step4Next.disabled = true;
        }
    });

    document.getElementById('step4Back').addEventListener('click', () => showStep(3));
    document.getElementById('step4Next').addEventListener('click', () => {
        updateSummary();
        showStep(5);
    });

    document.getElementById('step5Back').addEventListener('click', () => showStep(4));
    document.getElementById('submitBtn').addEventListener('click', submitOnboarding);
});
