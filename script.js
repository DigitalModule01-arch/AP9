window.onload = function() {
    const savedName = localStorage.getItem('student_name');
    const savedSection = localStorage.getItem('student_section');
    if (savedName && savedSection) {
        const loginOverlay = document.getElementById('login-overlay');
        const displayInfo = document.getElementById('display-student-info');
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (displayInfo) displayInfo.innerText = `${savedName} (${savedSection})`;
    }
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
    ['A', 'G', 'D', 'A', 'G', 'E', 'G', 'E', 'Q', 'L', 'P'],
    ['H', 'S', 'E', 'I', 'B', 'I', 'G', 'A', 'P', 'A', 'A'],
    ['A', 'R', 'M', 'R', 'A', 'L', 'B', 'A', 'N', 'K', 'N'],
    ['Y', 'I', 'A', 'P', 'I', 'R', 'U', 'A', 'L', 'T', 'L'],
    ['D', 'N', 'N', 'H', 'J', 'U', 'N', 'C', 'B', 'B', 'A'],
    ['E', 'D', 'D', 'C', 'U', 'R', 'V', 'E', 'K', 'O', 'S'],
    ['M', 'Z', 'U', 'F', 'L', 'C', 'N', 'V', 'U', 'H', 'A'],
    ['A', 'V', 'R', 'A', 'W', 'U', 'A', 'S', 'R', 'F', 'P'],
    ['N', 'R', 'P', 'C', 'Y', 'N', 'R', 'W', 'B', 'K', 'P'],
    ['D', 'F', 'U', 'N', 'C', 'T', 'I', 'O', 'N', 'P', 'P'],
    ['A', 'K', 'I', 'T', 'A', 'R', 'E', 'P', 'N', 'O', 'K']
];

const targetWords = {
    'DEMAND': [[4,0], [5,0], [6,0], [7,0], [8,0], [9,0]],
    'CURVE': [[5,3], [5,4], [5,5], [5,6], [5,7]],
    'KITA': [[10,1], [10,2], [10,3], [10,4]],
    'FUNCTION': [[9,1], [9,2], [9,3], [9,4], [9,5], [9,6], [9,7], [9,8]]
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
        report += `Row ${r} - Salik: ${localStorage.getItem(`g1_r${r}_c1`) || ''} | Katangian: ${localStorage.getItem(`g1_r${r}_c2`) || ''} | Halimbawa: ${localStorage.getItem(`g1_r${r}_c3`) || ''}\n`;
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
            // Kusang mag-lalog out pagkatapos ma-send
            handleLogout();
        } else {
            alert('Nagkaproblema sa pag-send. Subukang muli.');
        }
    }).catch(error => {
        alert('May error sa koneksyon sa internet.');
    });
} // <-- NAWALA ANG PANANDANG ITO KAYA NAG-ERROR; IDINAGDAG NA DITO

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
        }
    }
}

function resetPuzzle() {
    renderPuzzle();
    for (let word in targetWords) {
        const el = document.getElementById(`word-${word}`);
        if (el) el.classList.remove('found-word');
    }
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
}

// --- 1. DARK / LIGHT MODE TOGGLE ---
function toggleTheme() {
    if (document.body.style.backgroundColor === 'rgb(255, 255, 255)') {
        document.body.style.backgroundColor = '#0f172a';
        document.body.style.color = '#f8fafc';
    } else {
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#1e293b';
    }
}

// --- 2. AUDIO / SUBTLE SOUND EFFECT (Web Audio API - walang external file na kailangan) ---
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
        // Safe fallback kung hindi suportado ng browser
    }
}

document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.classList.contains('grid-cell')) {
        playClickSound();
    }
});

// --- 3. PROGRESS TRACKER & CERTIFICATE UPDATER ---
document.addEventListener('input', function() {
    updateProgress();
});

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
    
    // Kung 100% na nasagutan, i-update ang pangalan sa Certificate
    if (percentage >= 100) {
        const certName = document.getElementById('cert-student-name');
        const certDate = document.getElementById('cert-date');
        if (certName) certName.innerText = localStorage.getItem('student_name') || 'Estudyante';
        if (certDate) certDate.innerText = new Date().toLocaleDateString();
    }
}

// Tawagin ang progress sa simula para ma-load ang porsyento
window.addEventListener('load', () => {
    updateProgress();
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
});