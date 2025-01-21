from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import contextlib
from dataset import problems_dataset, test_solution  # Import from the previous file

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/problems/<int:problem_id>', methods=['GET'])
def get_problem(problem_id):
    if problem_id not in problems_dataset:
        return jsonify({'error': 'Problem not found'}), 404
    
    problem = problems_dataset[problem_id]
    return jsonify({
        'title': problem['title'],
        'description': problem['description'],
        'function_template': problem['function_template'],
        'sample_inputs': problem['sample_inputs'],
        'sample_outputs': problem['sample_outputs']
    })

@app.route('/execute/<int:problem_id>', methods=['POST'])
def execute_code(problem_id):
    if problem_id not in problems_dataset:
        return jsonify({'error': 'Problem not found'}), 404
    
    code = request.json.get('code', '')
    
    # Test the solution
    result = test_solution(problem_id, code)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
