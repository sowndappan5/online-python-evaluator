import sys
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import contextlib

app = Flask(__name__)
CORS(app, resources={r"/execute": {"origins": "*"}})

@app.route('/execute', methods=['POST'])
def execute_code():
    code = request.json.get('code', '')
    
    # Capture stdout and stderr
    output = io.StringIO()
    error = io.StringIO()
    
    # Create a dictionary to store local variables
    namespace = {}
    
    try:
        # Redirect stdout and stderr
        with contextlib.redirect_stdout(output), contextlib.redirect_stderr(error):
            # Compile the code first
            compiled_code = compile(code, '<string>', 'exec')
            
            # Execute the compiled code with a namespace
            exec(compiled_code, namespace)
        
        # Get the captured output
        stdout = output.getvalue()
        stderr = error.getvalue()
        
        # Combine outputs
        full_output = stdout + stderr
        
        return jsonify({
            'success': True,
            'output': full_output if full_output else 'Code executed successfully. No output.',
        })
    
    except Exception as e:
        # Capture any execution errors
        error_trace = traceback.format_exc()
        return jsonify({
            'success': False,
            'output': error_trace
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)