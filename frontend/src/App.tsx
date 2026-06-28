import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { SignInPage } from './features/auth/SignInPage';
import { SignUpPage } from './features/auth/SignUpPage';
import { HomePage } from './features/home/HomePage';
import { OnboardingPage } from './features/onboarding/OnboardingPage';
import { ResultPage } from './features/result/ResultPage';
import { TypingPage } from './features/typing/TypingPage';
import { Toaster } from '@/components/ui/sonner';

function App() {
    return (
        <AppLayout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/lessons/:lessonId/typing" element={<TypingPage />} />
                <Route path="/sessions/:sessionId/result" element={<ResultPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Toaster />
            </Routes>
        </AppLayout>
    );
}

export default App;
