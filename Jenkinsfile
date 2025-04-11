pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.42.1-jammy'
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
                sh 'npm ci'  // Using ci instead of install for more reliable builds
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test'
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