pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    // First try to use nvm if available
                    sh '''#!/bin/bash
                        if [ -f "$HOME/.nvm/nvm.sh" ]; then
                            . "$HOME/.nvm/nvm.sh"
                            nvm install 18 || true
                            nvm use 18 || true
                        else
                            # If nvm is not available, try to use system node
                            node -v || echo "Node.js not found"
                            npm -v || echo "npm not found"
                        fi
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''#!/bin/bash
                    npm install
                    npx playwright install --with-deps
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test'
            }
        }

        stage('Archive Reports') {
            steps {
                // Archive the test results and reports
                archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true
            }
        }
    }
}