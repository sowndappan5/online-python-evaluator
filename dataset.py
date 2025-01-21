# Dataset for coding problems
problems_dataset = {
    1: {
        "title": "Maximum of Three Numbers",
        "description": "Write a Python function to find the maximum of three numbers.",
        "function_template": """def maxsum(a, b, c):
    # Write your code here
    pass""",
        "sample_inputs": [
            [1, 2, 3],
            [3, 2, 1],
            [-1, -2, -3]
        ],
        "sample_outputs": [
            3,
            3,
            -1
        ],
        "hidden_inputs": [
            [100, 200, 300],
            [5, 5, 5],
            [-10, -5, -8],
            [0, 0, 1],
            [999, 998, 997]
        ],
        "hidden_outputs": [
            300,
            5,
            -5,
            1,
            999
        ]
    },
    2: {
        "title": "Add Two Numbers",
        "description": "Write a Python function to add two numbers.",
        "function_template": """def addtwo(a, b):
    # Write your code here
    pass""",
        "sample_inputs": [
            [3, 5],
            [10, 20],
            [0, 0]
        ],
        "sample_outputs": [
            8,
            30,
            0
        ],
        "hidden_inputs": [
            [100, 200],
            [-5, 5],
            [-10, -20],
            [0, 1],
            [999, 1]
        ],
        "hidden_outputs": [
            300,
            0,
            -30,
            1,
            1000
        ]
    },
    3: {
        "title": "Even or Odd",
        "description": "Write a Python function to check if a number is even or odd.",
        "function_template": """def evenorodd(num):
    # Write your code here
    pass""",
        "sample_inputs": [
            [4],
            [7],
            [-2]
        ],
        "sample_outputs": [
            "Even",
            "Odd",
            "Even"
        ],
        "hidden_inputs": [
            [0],
            [1000],
            [-999],
            [2468],
            [13579]
        ],
        "hidden_outputs": [
            "Even",
            "Even",
            "Odd",
            "Even",
            "Odd"
        ]
    },
    4: {
        "title": "Sum of List",
        "description": "Write a Python function to find the sum of all numbers in a list.",
        "function_template": """def listsum(numbers):
    # Write your code here
    pass""",
        "sample_inputs": [
            [[1, 2, 3]],
            [[5, -5, 0]],
            [[10, 20, 30, 40]]
        ],
        "sample_outputs": [
            6,
            0,
            100
        ],
        "hidden_inputs": [
            [[1, 2, 3, 4, 5]],
            [[-1, -2, -3]],
            [[0, 0, 0]],
            [[100, 200, 300]],
            [[1, -1, 1, -1]]
        ],
        "hidden_outputs": [
            15,
            -6,
            0,
            600,
            0
        ]
    },
    5: {
        "title": "Reverse String",
        "description": "Write a Python function to reverse a string.",
        "function_template": """def reverse_string(text):
    # Write your code here
    pass""",
        "sample_inputs": [
            ["hello"],
            ["python"],
            ["123"]
        ],
        "sample_outputs": [
            "olleh",
            "nohtyp",
            "321"
        ],
        "hidden_inputs": [
            ["programming"],
            ["racecar"],
            [""],
            ["a"],
            ["Test123"]
        ],
        "hidden_outputs": [
            "gnimmargorp",
            "racecar",
            "",
            "a",
            "321tseT"
        ]
    }
}

def test_solution(problem_id, user_code):
    """
    Test the user's solution against sample and hidden test cases.
    Returns a dictionary with test results.
    """
    problem = problems_dataset[problem_id]
    
    # Create namespace for execution
    namespace = {}
    
    # Execute user's code in the namespace
    try:
        exec(user_code, namespace)
    except Exception as e:
        return {
            'success': False,
            'error': f"Code execution error: {str(e)}",
            'test_results': []
        }
    
    # Get the function name from the template
    function_name = user_code.split('def ')[1].split('(')[0].strip()
    if function_name not in namespace:
        return {
            'success': False,
            'error': f"Function '{function_name}' not found",
            'test_results': []
        }
    
    user_function = namespace[function_name]
    test_results = []
    
    # Test sample cases
    for i, (inputs, expected) in enumerate(zip(problem['sample_inputs'], problem['sample_outputs']), 1):
        try:
            result = user_function(*inputs)
            passed = result == expected
            test_results.append({
                'case': f'Sample Case {i}',
                'passed': passed,
                'input': inputs,
                'expected': expected,
                'actual': result,
                'hidden': False
            })
        except Exception as e:
            test_results.append({
                'case': f'Sample Case {i}',
                'passed': False,
                'input': inputs,
                'error': str(e),
                'hidden': False
            })
    
    # Test hidden cases
    for i, (inputs, expected) in enumerate(zip(problem['hidden_inputs'], problem['hidden_outputs']), 1):
        try:
            result = user_function(*inputs)
            passed = result == expected
            test_results.append({
                'case': f'Hidden Case {i}',
                'passed': passed,
                'input': 'Hidden',
                'expected': 'Hidden',
                'actual': 'Hidden',
                'hidden': True
            })
        except Exception as e:
            test_results.append({
                'case': f'Hidden Case {i}',
                'passed': False,
                'input': 'Hidden',
                'error': str(e),
                'hidden': True
            })
    
    # Calculate overall success
    all_passed = all(result['passed'] for result in test_results)
    
    return {
        'success': all_passed,
        'test_results': test_results
    }
