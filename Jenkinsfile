pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.51.1-jammy'
            args '--ipc=host'  // Required for Playwright
        }
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Show Environment') {
            steps {
                sh '''
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm ci
                    npx playwright install chromium firefox webkit --with-deps
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh 'PLAYWRIGHT_BROWSERS_PATH=/ms-playwright npx playwright test'
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true
            }
        }
    }

    post {
        always {
            cleanWs()  // Clean up workspace after build
        }
    }
}