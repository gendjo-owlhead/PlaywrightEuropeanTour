pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.51.1-jammy'
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

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm ci
                    npx playwright install --with-deps
                '''
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    try {
                        sh '''
                            PLAYWRIGHT_BROWSERS_PATH=/ms-playwright npx playwright test --reporter=list,html
                            echo "Test execution completed"
                        '''
                    } catch (err) {
                        unstable('Some tests failed')
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Publish Reports') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true
                archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report',
                    reportTitles: ''
                ])
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
