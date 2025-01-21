// Initialize CodeMirror
// Initialize CodeMirror
let editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
    mode: "python",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    indentUnit: 4,
    matchBrackets: true,
    lineWrapping: true,
    viewportMargin: Infinity,
    autofocus: true,
    styleActiveLine: true,
    tabSize: 4,
    indentWithTabs: false,
});

// Force editor refresh after initialization
setTimeout(() => {
    editor.refresh();
}, 100);

// Add resize handler
window.addEventListener('resize', () => {
    editor.refresh();
});

let currentProblemId = 1;
const totalProblems = 5;

// Function to format sample cases for display
function formatSampleCases(inputs, outputs) {
    let formattedHtml = '<div class="sample-cases">';
    formattedHtml += '<h3>Sample Test Cases:</h3>';
    
    // Format inputs
    formattedHtml += '<h4>Sample Inputs:</h4>';
    inputs.forEach((input, index) => {
        formattedHtml += `<pre>Test ${index + 1}: ${Array.isArray(input) ? input.join(' ') : input}</pre>`;
    });
    
    // Format outputs
    formattedHtml += '<h4>Sample Outputs:</h4>';
    outputs.forEach((output, index) => {
        formattedHtml += `<pre>Test ${index + 1}: ${output}</pre>`;
    });
    
    formattedHtml += '</div>';
    return formattedHtml;
}

// Function to load a problem
async function loadProblem(problemId) {
    try {
        const response = await fetch(`http://localhost:5000/problems/${problemId}`);
        if (!response.ok) {
            throw new Error('Problem loading data');
        }
        const problem = await response.json();
        
        // Update the problem title and description
        document.getElementById('problem-title').innerHTML = `<h2>${problem.title}</h2>`;
        document.getElementById('problem-description').innerHTML = `
            <div class="problem-desc">
                <p>${problem.description}</p>
            </div>
        `;
        
        // Update sample cases
        const sampleCasesHtml = formatSampleCases(problem.sample_inputs, problem.sample_outputs);
        document.getElementById('sample-cases').innerHTML = sampleCasesHtml;
        
        // Set the editor content
        editor.setValue(problem.function_template);
        
        // Clear the output console
        document.getElementById('output-console').innerHTML = '';
        
        // Update navigation buttons
        document.getElementById('prev-btn').disabled = problemId === 1;
        document.getElementById('next-btn').disabled = problemId === totalProblems;
    } catch (error) {
        console.error('Error loading problem:', error);
        document.getElementById('problem-description').innerHTML = `
            <div class="error">Error loading problem: ${error.message}</div>
        `;
    }
}

// Run button handler
document.getElementById('run-button').addEventListener('click', async () => {
    const code = editor.getValue();
    const outputConsole = document.getElementById('output-console');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    try {
        loadingSpinner.style.display = 'block';
        
        const response = await fetch(`http://localhost:5000/execute/${currentProblemId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code })
        });
        
        const result = await response.json();
        
        // Format and display results
        let output = '';
        if (result.error) {
            output = `<div class="error">Error: ${result.error}</div>`;
        } else {
            output = '<div class="test-results">';
            result.test_results.forEach(test => {
                output += `<div class="test-case ${test.passed ? 'success' : 'error'}">`;
                output += `<h4>${test.case}: ${test.passed ? '✅ Passed' : '❌ Failed'}</h4>`;
                if (!test.hidden) {
                    output += `<pre>Input: ${JSON.stringify(test.input)}
Expected: ${test.expected}
Actual: ${test.actual}</pre>`;
                }
                output += '</div>';
            });
            
            output += `<div class="overall ${result.success ? 'success' : 'error'}">
                        Overall: ${result.success ? '✅ All tests passed!' : '❌ Some tests failed'}
                      </div>`;
            output += '</div>';
        }
        
        outputConsole.innerHTML = output;
    } catch (error) {
        outputConsole.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    } finally {
        loadingSpinner.style.display = 'none';
    }
});

// Navigation button handlers
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentProblemId > 1) {
        currentProblemId--;
        loadProblem(currentProblemId);
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentProblemId < totalProblems) {
        currentProblemId++;
        loadProblem(currentProblemId);
    }
});

// Load the first problem when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProblem(currentProblemId);
});

// Add this to your existing JavaScript file

let isVerticalDragging = false;
let isHorizontalDragging = false;
let startX, startY;
let startWidths, startHeights;

// Vertical divider functionality
document.querySelector('.vertical-divider').addEventListener('mousedown', (e) => {
    isVerticalDragging = true;
    startX = e.clientX;
    
    // Get initial widths
    const problemPanel = document.querySelector('.problem-panel');
    const editorPanel = document.querySelector('.editor-panel');
    startWidths = {
        problem: problemPanel.offsetWidth,
        editor: editorPanel.offsetWidth
    };
    
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
});

// Horizontal divider functionality
document.querySelector('.horizontal-divider').addEventListener('mousedown', (e) => {
    isHorizontalDragging = true;
    startY = e.clientY;
    
    // Get initial heights
    const codeEditor = document.querySelector('.code-editor');
    const outputPanel = document.querySelector('.output-panel');
    startHeights = {
        editor: codeEditor.offsetHeight,
        output: outputPanel.offsetHeight
    };
    
    document.body.style.cursor = 'ns-resize';
    e.preventDefault();
});

// Mouse move handler
document.addEventListener('mousemove', (e) => {
    if (isVerticalDragging) {
        const delta = e.clientX - startX;
        const problemPanel = document.querySelector('.problem-panel');
        const editorPanel = document.querySelector('.editor-panel');
        
        const newProblemWidth = startWidths.problem + delta;
        const containerWidth = problemPanel.parentElement.offsetWidth;
        
        // Apply size constraints
        if (newProblemWidth >= 300 && newProblemWidth <= containerWidth - 400) {
            problemPanel.style.width = `${newProblemWidth}px`;
            editor.refresh(); // Refresh CodeMirror instance
        }
    }
    
    if (isHorizontalDragging) {
        const delta = e.clientY - startY;
        const codeEditor = document.querySelector('.code-editor');
        const outputPanel = document.querySelector('.output-panel');
        const editorPanel = document.querySelector('.editor-panel');
        
        const newEditorHeight = startHeights.editor + delta;
        const newOutputHeight = startHeights.output - delta;
        
        // Apply size constraints
        if (newEditorHeight >= 200 && newOutputHeight >= 100) {
            codeEditor.style.height = `${newEditorHeight}px`;
            outputPanel.style.height = `${newOutputHeight}px`;
            editor.refresh(); // Refresh CodeMirror instance
        }
    }
});

// Mouse up handler
document.addEventListener('mouseup', () => {
    if (isVerticalDragging || isHorizontalDragging) {
        isVerticalDragging = false;
        isHorizontalDragging = false;
        document.body.style.cursor = '';
        editor.refresh(); // Refresh CodeMirror instance
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    editor.refresh();
});
