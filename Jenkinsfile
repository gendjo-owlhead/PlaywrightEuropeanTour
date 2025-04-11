pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.42.1-jammy'
            args '--ipc=host'
        }
    }

    environment {
        PLAYWRIGHT_BROWSERS_PATH = '/ms-playwright'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                sh '''
                    npm ci
                    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright npx playwright install
                    ls -la /ms-playwright || true
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh 'PLAYWRIGHT_BROWSERS_PATH=/ms-playwright npx playwright test --workers=1'
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
            cleanWs()
        }
    }
}
