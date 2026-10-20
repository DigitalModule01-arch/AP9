window.onload = function() {
    const savedName = localStorage.getItem('student_name');
    const savedSection = localStorage.getItem('student_section');
    if (savedName && savedSection) {
        const loginOverlay = document.getElementById('login-overlay');
        const displayInfo = document.getElementById('display-student-info');
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (displayInfo) displayInfo.innerText = `${savedName} (${savedSection})`;
    }
    calculateScore();
};

function handleLogin(event) {
    event.preventDefault();
    const nameInput = document.getElementById('input-name');
    const sectionInput = document.getElementById('input-section');
    
    if (!nameInput || !sectionInput) return;
    
    const name = nameInput.value.trim();
    const section = sectionInput.value.trim();

    if (name && section) {
        localStorage.setItem('student_name', name);
        localStorage.setItem('student_section', section);
        const loginOverlay = document.getElementById('login-overlay');
        const displayInfo = document.getElementById('display-student-info');
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (displayInfo) displayInfo.innerText = `${name} (${section})`;
        calculateScore();
    }
}

// Para sa awtomatikong pag-log out
function handleLogout() {
    localStorage.removeItem('student_name');
    localStorage.removeItem('student_section');
    
    const nameInput = document.getElementById('input-name');
    const sectionInput = document.getElementById('input-section');
    if (nameInput) nameInput.value = '';
    if (sectionInput) sectionInput.value = '';
    
    const loginOverlay = document.getElementById('login-overlay');
    if (loginOverlay) loginOverlay.style.display = 'flex';
    
    closeModal();
}

const puzzleGrid = [
    ['D', 'M', 'Q', 'J', 'Q', 'L', 'C', 'Z', 'X', 'H', 'S'],
    ['A', 'E', 'P', 'A', 'H', 'T', 'T', 'U', 'U', 'A', 'Y'],
    ['M', 'Z', 'M', 'Z', 'L', 'S', 'F', 'H', 'R', 'V', 'J'],
    ['A', 'F', 'A', 'A', 'Y', 'B', 'X', 'J', 'N', 'V', 'M'],
    ['N', 'P', 'U', 'L', 'N', 'X', 'K', 'Q', 'A', 'C', 'E'],
    ['D', 'O', 'F', 'N', 'X', 'D', 'B', 'P', 'S', 'Z', 'X'],
    ['K', 'U', 'F', 'X', 'C', 'X', 'V', 'A', 'T', 'L', 'N'],
    ['X', 'I', 'T', 'B', 'G', 'T', 'A', 'X', 'U', 'Q', 'H'],
    ['W', 'J', 'T', 'K', 'L', 'S', 'I', 'B', 'H', 'T', 'U'],
    ['Q', 'X', 'X', 'A', 'X', 'X', 'Q', 'O', 'X', 'X', 'E'],
    ['O', 'Y', 'P', 'C', 'H', 'F', 'T', 'V', 'N', 'X', 'A']
];

const targetWords = {
    // DEMAND: Pa-diagonal pababa (D-E-M-A-N-D)
    'DEMAND': [[0,0], [1,1], [2,2], [3,3], [4,4], [5,5]],

    // CURVE: Pa-diagonal pababa (C-U-R-V-E)
    'CURVE': [[0,6], [1,7], [2,8], [3,9], [4,10]],

    // KITA: Pa-diagonal pababa (K-I-T-A)
    'KITA': [[6,0], [7,1], [8,2], [9,3]],

    // FUNCTION: Pa-diagonal pababa (F-U-N-C-T-I-O-N)
    'FUNCTION': [[3,1], [4,2], [5,3], [6,4], [7,5], [8,6], [9,7], [10,8]]
};

let selectedCells = [];
let foundWords = new Set();

function openModal(key) {
    const sections = document.querySelectorAll('.modal-section');
    sections.forEach(sec => sec.style.display = 'none');

    const activeSection = document.getElementById('content-' + key);
    if(activeSection) {
        activeSection.style.display = 'block';
    }

    const modal = document.getElementById('modal');
    if(modal) modal.style.display = 'block';
    
    if (key === 'balikan') renderPuzzle();
    restoreInputs();
    calculateScore();
}

function closeModal() {
    const modal = document.getElementById('modal');
    if(modal) modal.style.display = 'none';
}

document.addEventListener('input', function(e) {
    if (e.target.classList.contains('saved-input') || e.target.classList.contains('user-input')) {
        if (e.target.dataset.id) {
            localStorage.setItem(e.target.dataset.id, e.target.value);
        }
    }
    updateProgress();
    calculateScore();
});

function restoreInputs() {
    const inputs = document.querySelectorAll('.saved-input, .user-input');
    inputs.forEach(input => {
        const id = input.dataset.id;
        if (id && localStorage.getItem(id) !== null) {
            input.value = localStorage.getItem(id);
            if(input.classList.contains('user-input')) {
                checkAnswer(input);
            }
        }
    });
    calculateScore();
}

function submitAndDownload() {
    const name = localStorage.getItem('student_name') || 'Mag-aaral';
    const section = localStorage.getItem('student_section') || 'Walang Seksiyon';

    let report = `=========================================\n`;
    report += ` ULAT NG MGA SAGOT - ARALING PANLIPUNAN 9\n`;
    report += `=========================================\n`;
    report += `Pangalan: ${name}\n`;
    report += `Seksiyon: ${section}\n`;
    report += `Petsa / Oras: ${new Date().toLocaleString()}\n`;
    report += `=========================================\n\n`;

    report += `--- TUKLASIN (4 PICS 1 WORD) & PAMPROSESONG TANONG ---\n`;
    report += `4 Pics 1 Word - Paninda: P${localStorage.getItem('pic1_l2') || '_' }N${localStorage.getItem('pic1_l4') || '_' }N${localStorage.getItem('pic1_l6') || '_' }A${localStorage.getItem('pic1_l8') || '_' }\n`;
    report += `4 Pics 1 Word - Negosyante: NE${localStorage.getItem('pic2_l3') || '_' }${localStorage.getItem('pic2_l4') || '_' }_${localStorage.getItem('pic2_l6') || '_' }SY${localStorage.getItem('pic2_l9') || '_' }E${localStorage.getItem('pic2_l11') || '_' }\n`;
    report += `4 Pics 1 Word - Pamilihan: PA${localStorage.getItem('pic3_l3') || '_' }${localStorage.getItem('pic3_l5') || '_' }_${localStorage.getItem('pic3_l7') || '_' }I${localStorage.getItem('pic3_l9') || '_' }${localStorage.getItem('pic3_l11') || '_' }A${localStorage.getItem('pic3_l13') || '_' }\n`;
    report += `4 Pics 1 Word - Pabrika: P${localStorage.getItem('pic4_l2') || '_' }_${localStorage.getItem('pic4_l4') || '_' }B${localStorage.getItem('pic4_l6') || '_' }I${localStorage.getItem('pic4_l8') || '_' }${localStorage.getItem('pic4_l10') || '_' }${localStorage.getItem('pic4_l12') || '_' }\n\n`;

    report += `Pamprosesong Tanong 1: ${localStorage.getItem('pampro_1') || ''}\n`;
    report += `Pamprosesong Tanong 2: ${localStorage.getItem('pampro_2') || ''}\n`;
    report += `Pamprosesong Tanong 3: ${localStorage.getItem('pampro_3') || ''}\n\n`;

    report += `--- PAGYAMANIN GAWAIN 1 (SA-KAT-HA) ---\n`;
    for(let r = 1; r <= 5; r++) {
        report += `Row ${r} Salik: ${localStorage.getItem(`g1_r${r}_c1`) || ''} | Katangian: ${localStorage.getItem(`g1_r${r}_c2`) || ''} | Halimbawa: ${localStorage.getItem(`g1_r${r}_c3`) || ''}\n`;
    }

    report += `\n--- PAGYAMANIN GAWAIN 2 (DESISYON MO) ---\n`;
    report += `Tanong 1: ${localStorage.getItem('g2_q1') || ''}\n`;
    report += `Tanong 2: ${localStorage.getItem('g2_q2') || ''}\n`;
    report += `Tanong 3: ${localStorage.getItem('g2_q3') || ''}\n`;

    // IPINADALA DIREKTA SA FORMSPREE EMAIL NG GURO
    fetch('https://formspree.io/f/xrpbloaz', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            section: section,
            message: report
        })
    }).then(response => {
        if (response.ok) {
            alert(`Tagumpay! Nai-send na ang iyong mga sagot kay Sir/Ma'am.`);
            handleLogout();
        } else {
            alert('Nagkaproblema sa pag-send. Subukang muli.');
        }
    }).catch(error => {
        alert('May error sa koneksyon sa internet.');
    });
}

function renderPuzzle() {
    const gridContainer = document.getElementById('grid');
    if(!gridContainer) return;
    gridContainer.innerHTML = '';
    selectedCells = [];
    foundWords.clear();

    for (let r = 0; r < 11; r++) {
        for (let c = 0; c < 11; c++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.innerText = puzzleGrid[r][c];
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.onclick = () => toggleCell(cell, r, c);
            gridContainer.appendChild(cell);
        }
    }
    calculateScore();
}

function toggleCell(cell, r, c) {
    const index = selectedCells.findIndex(item => item.r === r && item.c === c);
    if (index > -1) {
        selectedCells.splice(index, 1);
        if (!cell.classList.contains('found')) cell.classList.remove('selected');
    } else {
        selectedCells.push({ r, c, cell });
        cell.classList.add('selected');
    }
    checkWords();
}

function checkWords() {
    for (let word in targetWords) {
        if (foundWords.has(word)) continue;
        const coords = targetWords[word];
        const isWordComplete = coords.every(coord => 
            selectedCells.some(selected => selected.r === coord[0] && selected.c === coord[1])
        );
        if (isWordComplete) {
            foundWords.add(word);
            coords.forEach(coord => {
                const cellEl = document.querySelector(`.grid-cell[data-row="${coord[0]}"][data-col="${coord[1]}"]`);
                if (cellEl) {
                    cellEl.classList.remove('selected');
                    cellEl.classList.add('found');
                }
            });
            const wordEl = document.getElementById(`word-${word}`);
            if (wordEl) wordEl.classList.add('found-word');
            
            // AGAD NA MAG-UPDATE ANG SCORE KAPAG MAY NAHANAP NA SALITA
            calculateScore();
        }
    }
}

function resetPuzzle() {
    renderPuzzle();
    for (let word in targetWords) {
        const el = document.getElementById(`word-${word}`);
        if (el) el.classList.remove('found-word');
    }
    calculateScore();
}

function checkAnswer(inputEl) {
    const parent = inputEl.parentElement;
    if (!parent) return;
    const targetAnswer = parent.dataset.answer;
    const inputs = Array.from(parent.querySelectorAll('.letter-box'));
    if (inputEl.value.length === 1) {
        const nextInput = inputs[inputs.indexOf(inputEl) + 1];
        if (nextInput && !nextInput.hasAttribute('readonly')) nextInput.focus();
    }
    const currentAnswer = inputs.map(i => i.value.toUpperCase()).join('');
    
    const cardStatus = parent.closest('.game-card') || parent.parentElement;
    const statusEl = cardStatus ? cardStatus.querySelector('.card-status') : null;
    
    if (currentAnswer.length === targetAnswer.length) {
        if (currentAnswer === targetAnswer) {
            inputs.forEach(i => { i.classList.remove('wrong'); i.classList.add('correct'); });
            if (statusEl) {
                statusEl.style.color = '#34d399';
                statusEl.innerHTML = '✓ TAMA ANG SAGOT!';
            }
        } else {
            inputs.forEach(i => { if(!i.classList.contains('given')) i.classList.add('wrong'); });
            if (statusEl) {
                statusEl.style.color = '#f87171';
                statusEl.innerHTML = '✗ MALI, SUBUKAN ULI';
            }
        }
    } else {
        inputs.forEach(i => i.classList.remove('correct', 'wrong'));
        if (statusEl) statusEl.innerHTML = '';
    }

    // AGAD NA MAG-UPDATE ANG SCORE
    calculateScore();
}

// --- AUDIO / SUBTLE SOUND EFFECT ---
function playClickSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        // Fallback
    }
}

document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.classList.contains('grid-cell')) {
        playClickSound();
    }
});

// --- PROGRESS TRACKER & CERTIFICATE UPDATER ---
function updateProgress() {
    const inputs = document.querySelectorAll('.saved-input, .user-input');
    let filled = 0;
    inputs.forEach(input => {
        if (input.value && input.value.trim() !== '') {
            filled++;
        }
    });
    const percentage = inputs.length > 0 ? Math.round((filled / inputs.length) * 100) : 0;
    const progressBar = document.getElementById('module-progress');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    
    if (percentage >= 100) {
        const certName = document.getElementById('cert-student-name');
        const certDate = document.getElementById('cert-date');
        if (certName) certName.innerText = localStorage.getItem('student_name') || 'Estudyante';
        if (certDate) certDate.innerText = new Date().toLocaleDateString();
    }
}

window.addEventListener('load', () => {
    updateProgress();
    calculateScore();
});

function toggleTheme() {
    document.documentElement.classList.toggle('dark-mode');
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
    }
    calculateScore();
}); 

// --- LIVE SCORING SYSTEM (1 Point per item) ---
function calculateScore() {
    let totalScore = 0;
    let maxScore = 0;

    // 1. Scoring para sa Word Puzzle (Bawat natagpuang salita ay 1 point)
    if (typeof targetWords !== 'undefined') {
        const puzzleWordsKeys = Object.keys(targetWords);
        maxScore += puzzleWordsKeys.length;
        puzzleWordsKeys.forEach(word => {
            if (foundWords.has(word)) {
                totalScore++;
            }
        });
    }

    // 2. Scoring para sa 4 Pics 1 Word (1 point bawat card kapag tama ang sagot)
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        maxScore++;
        const statusEl = card.querySelector('.card-status');
        if (statusEl && statusEl.innerHTML.includes('TAMA')) {
            totalScore++;
        }
    });

    // 3. Scoring para sa mga text input / gawain (1 point bawat sinagutang field)
    const textInputs = document.querySelectorAll('.saved-input');
    textInputs.forEach(input => {
        maxScore++;
        if (input.value && input.value.trim() !== '') {
            totalScore++;
        }
    });

    // I-display sa screen sa header
    const scoreDisplay = document.getElementById('live-score-display');
    if (scoreDisplay) {
        scoreDisplay.innerText = `Score: ${totalScore} / ${maxScore}`;
    }

    return { totalScore, maxScore };
}