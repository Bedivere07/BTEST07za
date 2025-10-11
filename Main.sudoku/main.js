

// -------------------- สร้างกระดาน Sudoku --------------------
const board = document.getElementById('board');
const cells = [];
let selectedCell = null; // ช่องที่เลือกอยู่

for (let i = 0; i < 81; i++) {
    const cell = document.createElement('input');
    cell.type = 'text';
    cell.maxLength = 1;
    cell.className = 'cell';
    cell.oninput = () => {
        cell.value = cell.value.replace(/[^1-9]/g, '');
    };
    cell.addEventListener('click', () => {
        // เมื่อคลิกช่อง ให้จำว่าเลือกช่องไหน
        if (selectedCell) selectedCell.classList.remove('selected');
        selectedCell = cell;
        cell.classList.add('selected');
    });
    board.appendChild(cell);
    cells.push(cell);
}

// -------------------- ตัวแปรหลัก --------------------
let timerElement = document.querySelector('.timer');
let timerInterval = null;
let seconds = 0;
let isGameRunning = false;
let sudokuPuzzle = [];
let sudokuSolution = [];

// -------------------- ฟังก์ชันนับเวลา --------------------
function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        timerElement.textContent = `${minutes}:${secs}`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// -------------------- ฟังก์ชันสร้าง Sudoku --------------------
function generateSudoku() {
    const base = 3;
    const side = base * base;

    const range = n => [...Array(n).keys()];
    const pattern = (r, c) => (base * (r % base) + Math.floor(r / base) + c) % side;
    const shuffle = arr => arr.sort(() => Math.random() - 0.5);

    const rows = [].concat(...shuffle(range(base)).map(g => shuffle(range(base)).map(r => g * base + r)));
    const cols = [].concat(...shuffle(range(base)).map(g => shuffle(range(base)).map(c => g * base + c)));
    const nums = shuffle(range(side).map(n => n + 1));

    const board = rows.map(r => cols.map(c => nums[pattern(r, c)]));
    const puzzle = board.map(row => row.map(val => (Math.random() < 0.6 ? 0 : val)));
    return { solution: board, puzzle };
}

// -------------------- แสดง Sudoku --------------------
function renderBoard(puzzle) {
    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const value = puzzle[row][col];
        cells[i].value = value === 0 ? '' : value;
        cells[i].disabled = value !== 0;
        cells[i].classList.remove('selected');

        // ⬇️ ใส่โค้ดเพิ่มตรงนี้เลย
        cells[i].classList.remove('prefilled'); 
        if (value !== 0) {
            cells[i].classList.add('prefilled');
        }
    }
    selectedCell = null;
}

// -------------------- ตรวจสอบ Sudoku --------------------
function checkSudoku() {
    const userBoard = [];
    for (let i = 0; i < 9; i++) {
        userBoard.push(cells.slice(i * 9, i * 9 + 9).map(cell => Number(cell.value) || 0));
    }

    const validSet = arr => {
        const nums = arr.filter(n => n !== 0);
        return new Set(nums).size === nums.length && nums.every(n => n >= 1 && n <= 9);
    };

    for (let r = 0; r < 9; r++) if (!validSet(userBoard[r])) return false;
    for (let c = 0; c < 9; c++) {
        const col = userBoard.map(row => row[c]);
        if (!validSet(col)) return false;
    }
    for (let br = 0; br < 3; br++) {
        for (let bc = 0; bc < 3; bc++) {
            const block = [];
            for (let r = 0; r < 3; r++)
                for (let c = 0; c < 3; c++)
                    block.push(userBoard[br * 3 + r][bc * 3 + c]);
            if (!validSet(block)) return false;
        }
    }
    return true;
}

// -------------------- ฟังก์ชันนับจำนวนแต่ละเลข --------------------
function countNumber(num) {
    return cells.filter(c => c.value == num).length;
}

// -------------------- ระบบแถบตัวเลข --------------------
const tap = document.getElementById('tap');
tap.addEventListener('click', e => {
    if (!selectedCell || selectedCell.disabled) return;
    if (e.target.tagName !== 'P') return;

    const val = e.target.textContent.trim();

    if (val === '❌') {
        selectedCell.value = '';
    } else if (/^[1-9]$/.test(val)) {
        selectedCell.value = val;
    }

    // เช็กว่าตัวเลขนี้ครบ 9 ตัวหรือยัง ถ้าครบให้ซ่อนปุ่มเลขนั้น
    for (let n = 1; n <= 9; n++) {
        const numBtn = tap.querySelector(`.${['zero','one','two','three','four','five','six','seven','eight','nine'][n]}`);
        if (numBtn) {
            const count = countNumber(n);
            numBtn.style.visibility = count >= 9 ? 'hidden' : 'visible';
        }
    }
});

// -------------------- ปุ่ม START --------------------
document.querySelector('.btnstart').addEventListener('click', () => {
    const { solution, puzzle } = generateSudoku();
    sudokuPuzzle = puzzle;
    sudokuSolution = solution;
    renderBoard(puzzle);
    startTimer();
    isGameRunning = true;

    // แสดงตัวเลขทั้งหมดใหม่ทุกครั้งที่เริ่ม
    tap.querySelectorAll('p').forEach(p => (p.style.visibility = 'visible'));
});

// -------------------- ปุ่ม CHECK --------------------
document.querySelector('.btncheck').addEventListener('click', () => {
    if (!isGameRunning) return;

    const correct = checkSudoku();
    if (correct) {
        stopTimer();
        timerElement.textContent = "00:00";
        isGameRunning = false;
        showOverlay('🎉 YOU WIN!', '#4caf50'); // ✅ ใช้ overlay
    } else {
        showOverlay('❌ TRY AGAIN!', '#e53935'); // สีแดงสำหรับผิด
    }

        // ✅ ตรวจว่ามีช่องว่างหรือไม่
    let isComplete = true;
    for (let i = 0; i < 81; i++) {
        if (cells[i].value === '') {
            isComplete = false;
            break;
        }
    }

    // ถ้ายังใส่ไม่ครบ → แจ้งเตือนแล้วออกจากฟังก์ชัน
    if (!isComplete) {
        showOverlay('ยังใส่เลขไม่ครบเลยน้า!', '#ffa500'); // สีส้มเตือน
        return;
    }



});

// -------------------- ปุ่ม GIVE UP --------------------
document.querySelector('.btngiveup').addEventListener('click', () => {
    if (!isGameRunning) return;

    for (let i = 0; i < 81; i++) {
        const r = Math.floor(i / 9);
        const c = i % 9;
        cells[i].value = sudokuSolution[r][c];
        cells[i].disabled = true;
    }

    stopTimer();
    timerElement.textContent = "00:00";
    isGameRunning = false;
    showOverlay('GAME OVER', '#ff4444');
});

// -------------------- ส่วนแสดงผล Overlay --------------------
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlay-text');
const overlayBtn = document.getElementById('overlay-btn');

// ฟังก์ชันแสดง Overlay
function showOverlay(message, color = "#4caf50") {
    overlayText.textContent = message;
    overlayText.style.color = color;
    overlay.style.display = 'flex'; // แสดง overlay
}

// ปุ่ม OK บน overlay
overlayBtn.addEventListener('click', () => {
    overlay.style.display = 'none'; // ปิด overlay
});

