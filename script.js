// ========== ГЕНЕРАЦИЯ ПАРОЛЯ ==========
function generatePassword() {
    const length = parseInt(document.getElementById('length')?.value) || 12;
    const useUpper = document.getElementById('useUpper')?.checked || false;
    const useLower = document.getElementById('useLower')?.checked || false;
    const useDigits = document.getElementById('useDigits')?.checked || false;
    const useSpecial = document.getElementById('useSpecial')?.checked || false;

    if (!useUpper && !useLower && !useDigits && !useSpecial) {
        alert('Выберите хотя бы одну категорию символов!');
        return null;
    }

    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '!@#$%^&*()_+=-{}[]:;"\'<>,.?/|\\~';

    let charSets = [];
    if (useUpper) charSets.push(upper);
    if (useLower) charSets.push(lower);
    if (useDigits) charSets.push(digits);
    if (useSpecial) charSets.push(special);

    let allChars = charSets.join('');
    let passwordChars = [];

    // Гарантируем хотя бы один символ из каждой выбранной категории
    for (let set of charSets) {
        passwordChars.push(set[Math.floor(Math.random() * set.length)]);
    }

    // Добираем остальные символы
    for (let i = passwordChars.length; i < length; i++) {
        passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Перемешиваем
    for (let i = passwordChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }

    return passwordChars.join('');
}

// ========== ПРОВЕРКА НАДЁЖНОСТИ ==========
const commonPasswords = [
    'password', '123456', '12345678', '1234', 'qwerty', '12345', 'dragon',
    'baseball', 'football', 'letmein', 'monkey', '696969', 'abc123',
    'mustang', 'michael', 'shadow', 'master', 'jennifer', '111111',
    'superman', 'harley', '1234567', 'hunter', 'trustno1', 'ranger',
    'buster', 'thomas', 'tigger', 'robert', 'soccer', 'batman', 'test',
    'pass', 'hello', 'admin', 'welcome', 'qwerty123', '123qwe', '1q2w3e', 'q1w2e3'
];

function checkPasswordStrength(password) {
    if (!password) return null;

    let score = 0;
    let details = [];

    // Проверка на распространённые пароли
    if (commonPasswords.includes(password.toLowerCase())) {
        return {
            score: 0,
            strength: 'КРИТИЧЕСКИ СЛАБЫЙ',
            time: 'мгновенно',
            details: ['⚠ Пароль входит в список самых распространённых!']
        };
    }

    const length = password.length;
    if (length >= 12) {
        score += 2;
        details.push('✓ Отличная длина (12+)');
    } else if (length >= 8) {
        score += 1;
        details.push('✓ Хорошая длина (8-11)');
    } else {
        details.push('✗ Слишком короткий пароль (рекомендуется 8+)');
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/|\\~]/.test(password);

    if (hasUpper) { score += 1; details.push('✓ Есть прописные буквы'); }
    else details.push('✗ Нет прописных букв');

    if (hasLower) { score += 1; details.push('✓ Есть строчные буквы'); }
    else details.push('✗ Нет строчных букв');

    if (hasDigit) { score += 1; details.push('✓ Есть цифры'); }
    else details.push('✗ Нет цифр');

    if (hasSpecial) { score += 1; details.push('✓ Есть спецсимволы'); }
    else details.push('✗ Нет спецсимволов');

    // Проверка на разнообразие
    const uniqueChars = new Set(password).size;
    if (uniqueChars < length * 0.7) {
        details.push('⚠ Много повторяющихся символов');
        score -= 0.5;
    }

    let strength, time;
    if (score >= 6) {
        strength = 'ОТЛИЧНЫЙ';
        time = 'более 100 лет';
    } else if (score >= 4) {
        strength = 'ХОРОШИЙ';
        time = 'от нескольких месяцев до года';
    } else if (score >= 2) {
        strength = 'СРЕДНИЙ';
        time = 'от нескольких дней до недели';
    } else {
        strength = 'СЛАБЫЙ';
        time = 'от нескольких минут до часов';
    }

    return {
        score: Math.min(6, Math.max(0, score)),
        strength: strength,
        time: time,
        details: details
    };
}

// ========== ИНИЦИАЛИЗАЦИЯ СТРАНИЦ ==========
document.addEventListener('DOMContentLoaded', () => {
    
    // ========== СТРАНИЦА ГЕНЕРАЦИИ ==========
    const generateBtn = document.getElementById('generateBtn');
    const passwordResult = document.getElementById('passwordResult');
    const copyBtn = document.getElementById('copyBtn');

    if (generateBtn && passwordResult) {
        generateBtn.addEventListener('click', () => {
            const pwd = generatePassword();
            if (pwd) {
                passwordResult.textContent = pwd;
                // Глитч-эффект
                passwordResult.style.transform = 'skew(1deg)';
                setTimeout(() => { passwordResult.style.transform = ''; }, 150);
            }
        });
    }

    if (copyBtn && passwordResult) {
        copyBtn.addEventListener('click', () => {
            const pwd = passwordResult.textContent;
            if (pwd && pwd !== '••••••••') {
                navigator.clipboard.writeText(pwd);
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Копировать';
                }, 2000);
            } else {
                alert('Сначала сгенерируйте пароль!');
            }
        });
    }

    // ========== СТРАНИЦА ПРОВЕРКИ ==========
    const checkBtn = document.getElementById('checkBtn');
    const passwordInput = document.getElementById('passwordInput');
    const resultPanel = document.getElementById('resultPanel');

    if (checkBtn && passwordInput) {
        checkBtn.addEventListener('click', () => {
            const password = passwordInput.value;
            if (!password) {
                alert('Введите пароль для проверки!');
                return;
            }

            const result = checkPasswordStrength(password);
            if (!result) return;

            resultPanel.style.display = 'block';
            
            const fillPercent = (result.score / 6) * 100;
            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');
            const detailsDiv = document.getElementById('details');
            const timeInfo = document.getElementById('timeInfo');

            if (strengthFill) strengthFill.style.width = fillPercent + '%';
            if (strengthText) strengthText.textContent = result.strength;
            if (timeInfo) timeInfo.innerHTML = `<i class="fas fa-clock"></i> Примерное время взлома: ${result.time}`;
            
            if (detailsDiv) {
                detailsDiv.innerHTML = result.details.map(d => `<div>${d}</div>`).join('');
            }

            // Цвет прогресс-бара
            if (strengthFill) {
                if (result.score >= 4) strengthFill.style.background = '#00ff73';
                else if (result.score >= 2) strengthFill.style.background = '#ffaa44';
                else strengthFill.style.background = '#ff4444';
            }
            
            // Глитч-эффект
            resultPanel.style.transform = 'translateX(2px)';
            setTimeout(() => { resultPanel.style.transform = ''; }, 150);
        });
    }

    // ========== ПОКАЗ/СКРЫТИЕ ПАРОЛЯ ==========
    const togglePassword = document.getElementById('togglePassword');
    const passwordInputField = document.getElementById('passwordInput');

    if (togglePassword && passwordInputField) {
        togglePassword.addEventListener('click', () => {
            // Переключаем тип поля
            const type = passwordInputField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInputField.setAttribute('type', type);
            
            // Меняем иконку
            const icon = togglePassword.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                // Добавляем эффект свечения при открытом пароле
                togglePassword.style.textShadow = '0 0 8px #00ff73';
                // Добавляем небольшой эффект для поля ввода
                passwordInputField.style.borderColor = '#00ff73';
                passwordInputField.style.boxShadow = '0 0 10px rgba(0, 255, 115, 0.3)';
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                togglePassword.style.textShadow = 'none';
                passwordInputField.style.borderColor = '';
                passwordInputField.style.boxShadow = '';
            }
        });
    }

    // ========== ГЛИТЧ-ЭФФЕКТ НА ЗАГОЛОВКЕ ==========
    const neonTitle = document.querySelector('.neon-title');
    if (neonTitle) {
        document.addEventListener('mousemove', (e) => {
            let x = (e.clientX / window.innerWidth) * 4 - 2;
            let y = (e.clientY / window.innerHeight) * 2 - 1;
            neonTitle.style.transform = `translate(${x * 0.8}px, ${y * 0.5}px)`;
        });
    }

    // ========== ЭФФЕКТ СВЕЧЕНИЯ ДЛЯ КАРТОЧЕК ==========
    const cards = document.querySelectorAll('.cyber-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = '0.3s';
                entry.target.style.boxShadow = '0 0 25px rgba(0,255,255,0.6)';
                setTimeout(() => {
                    entry.target.style.boxShadow = '';
                }, 500);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(c => observer.observe(c));
});