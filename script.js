// Matrix Background Effect
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()'.split('');
const fontSize = 10;
const columns = canvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'var(--accent-neon)';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

// CodeMirror Setup
const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: 'python',
    theme: 'material-darker',
    lineNumbers: true,
    matchBrackets: true,
    indentUnit: 4,
    smartIndent: true,
    extraKeys: {
        'Ctrl-Space': 'autocomplete'
    }
});

// Backend Integration
const outputConsole = document.getElementById('output-console');
const runBtn = document.getElementById('run-btn');
const saveBtn = document.getElementById('save-btn');
const loadingSpinner = document.getElementById('loading-spinner');

runBtn.addEventListener('click', () => {
    const code = editor.getValue();

    // Clear previous output and show loading
    outputConsole.innerHTML = '';
    loadingSpinner.style.display = 'block';
    runBtn.disabled = true;

    // Send code to backend
    fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code })
    })
    .then(response => response.json())
    .then(data => {
        loadingSpinner.style.display = 'none';
        runBtn.disabled = false;

        if (data.success) {
            outputConsole.innerHTML = data.output;
        } else {
            outputConsole.innerHTML = `Execution Error:\n${data.output}`;
        }
    })
    .catch(error => {
        loadingSpinner.style.display = 'none';
        runBtn.disabled = false;
        outputConsole.innerHTML = `Network Error: ${error.message}`;
    });
});

saveBtn.addEventListener('click', () => {
    const code = editor.getValue();
    localStorage.setItem('savedPythonSnippet', code);
    outputConsole.innerHTML = 'Code snippet saved successfully!\n';
});

// Load saved snippet on page load
const savedSnippet = localStorage.getItem('savedPythonSnippet');
if (savedSnippet) {
    editor.setValue(savedSnippet);
} else {
    editor.setValue(`# Welcome to PyCode Editor
# Try some Python code below

# Print statements
print("Hello, World!")
print(42)

# List operations
numbers = [1, 2, 3, 4, 5]
print(numbers)
print(len(numbers))

# String formatting
name = "Developer"
print(f"Welcome, {name}!")
`);
}
// Vertical Resizing Logic (Between Question and Editor Container)
const questionSection = document.getElementById('question-section');
const editorContainer = document.getElementById('editor-container');
const verticalDivider = document.getElementById('vertical-divider');

let isVerticalDragging = false;

verticalDivider.addEventListener('mousedown', (e) => {
    isVerticalDragging = true;
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isVerticalDragging) return;

    const containerRect = document.getElementById('app-container').getBoundingClientRect();
    const newQuestionWidth = e.clientX - containerRect.left;

    if (newQuestionWidth > 200 && newQuestionWidth < containerRect.width * 0.5) {
        questionSection.style.width = `${newQuestionWidth}px`;
        editorContainer.style.flex = `1 1 0px`;
    }
});

document.addEventListener('mouseup', () => {
    if (isVerticalDragging) {
        isVerticalDragging = false;
        document.body.style.cursor = '';
    }
});

// Horizontal Resizing Logic (Between Code Editor and Output Console)
const codeEditorContainer = document.getElementById('code-editor-container');
const outputConsoleContainer = document.getElementById('output-console-container');
const horizontalDivider = document.getElementById('horizontal-divider');

let isHorizontalDragging = false;

horizontalDivider.addEventListener('mousedown', (e) => {
  console.log('Horizontal divider mousedown triggered');
  isHorizontalDragging = true;
  document.body.style.cursor = 'ns-resize';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isHorizontalDragging) return;

  console.log('Horizontal dragging in progress');

  const editorContainerRect = editorContainer.getBoundingClientRect();
  const newEditorHeight = e.clientY - editorContainerRect.top;

  console.log('New editor height:', newEditorHeight);
  console.log('Editor container height:', editorContainerRect.height);

  // Constrain resizing within valid height ranges
  const minHeight = 100; // Minimum height for the code editor
  const maxHeight = editorContainerRect.height - minHeight - 5; // Leave space for the output console

  console.log('Min height:', minHeight);
  console.log('Max height:', maxHeight);

  if (newEditorHeight >= minHeight && newEditorHeight <= maxHeight) {
      console.log('Applying new heights');
      codeEditorContainer.style.height = `${newEditorHeight}px`;
      outputConsoleContainer.style.height = `${editorContainerRect.height - newEditorHeight - 5}px`;
  }
});

document.addEventListener('mouseup', () => {
  console.log('Horizontal dragging ended');
  if (isHorizontalDragging) {
      isHorizontalDragging = false;
      document.body.style.cursor = '';
  }
});


