pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.42.1-jammy'
            args '--ipc=host'
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
                    npx playwright install --with-deps chromium firefox webkit
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    echo "Installed browsers:"
                    ls -la /ms-playwright
                    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright npx playwright test
                '''
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