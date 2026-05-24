import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { SignUpPage } from './features/auth/SignUpPage'
import { HomePage } from './features/home/HomePage'
import { OnboardingPage } from './features/onboarding/OnboardingPage'
import { ResultPage } from './features/result/ResultPage'
import { TypingPage } from './features/typing/TypingPage'

function App() {
    return (
        <AppLayout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/lessons/:lessonId/typing" element={<TypingPage />} />
                <Route path="/sessions/:sessionId/result" element={<ResultPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AppLayout>
    )
}

export default App
