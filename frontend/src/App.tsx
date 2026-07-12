import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { SignInPage } from './features/auth/SignInPage';
import { SignUpPage } from './features/auth/SignUpPage';
import { HomePage } from './features/home/HomePage';
import { OnboardingPage } from './features/onboarding/OnboardingPage';
import { ResultPage } from './features/result/ResultPage';
import { TypingPage } from './features/typing/TypingPage';
import { Toaster } from '@/components/ui/sonner';
import { GuestRoute } from './features/auth/GuestRoute';
import { PrivateRoute } from './features/auth/PrivateRoute';

function App() {
    return (
        <AppLayout>
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route
                        path="/lessons/:lessonId/typing"
                        element={<TypingPage />}
                    />
                    <Route
                        path="/sessions/:sessionId/result"
                        element={<ResultPage />}
                    />
                </Route>
                <Route element={<GuestRoute />}>
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-center" />
        </AppLayout>
    );
}

export default App;
