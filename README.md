# Online Python Program Evaluation Tool

## Project Overview
This project aims to build an online tool for evaluating Python programs, allowing users to authenticate, code, run test cases, and get immediate feedback. Built with React for the frontend, Python for the backend, and an open-source database, this project will support agile development and collaborative work on GitHub.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Branching Strategy](#branching-strategy)
- [GitHub Workflow](#github-workflow)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Authentication**: Users authenticate using email before accessing the tool.
- **Programming Questions Display**: Shows questions and provides a coding area.
- **Real-Time Evaluation**: Provides immediate feedback on code based on test cases.
- **Countdown Timer**: Shows time remaining for the test.
- **Result Display**: Displays scores immediately after the test ends.
- **Navigation Warning**: Warns users if they navigate away during the test.
- **Feedback on Test Cases**: Indicates the number of test cases passed.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Python
- **Database**: MySQL
- **Code Editor Library**: CodeMirror / Monaco Editor
- **Version Control**: Git and GitHub
- **Continuous Integration**: GitHub Actions

## Installation
To set up the project locally:

### Prerequisites
- **Node.js** (>= 14.x) and **npm**
- **Python** (>= 3.7)
- **Git** for version control
- **Database**: MySQL

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/sowndappan5/online-python-evaluator.git
   cd online-python-evaluator
