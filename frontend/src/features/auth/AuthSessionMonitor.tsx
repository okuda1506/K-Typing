import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { registerUnauthorizedHandler } from '@/lib/apiClient';
import { clearAuthSession, hasAuthSession } from './authSession';

const AUTH_PAGE_PATHS = new Set(['/signin', '/signup']);

export function AuthSessionMonitor() {
    const navigate = useNavigate();
    const location = useLocation();

    const isHandlingUnauthorized = useRef(false);

    useEffect(() => {
        // 再サインイン後に認証済み画面へ移動したら次の401を処理できる状態に戻す
        if (hasAuthSession()) {
            isHandlingUnauthorized.current = false;
        }
    }, [location.pathname]);

    useEffect(() => {
        // authenticatedApiFetchが401を検知したときに実行する処理を登録する
        // registerUnauthorizedHandlerの戻り値がアンマウント時の登録解除処理になる
        return registerUnauthorizedHandler(() => {
            if (isHandlingUnauthorized.current) {
                return;
            }

            isHandlingUnauthorized.current = true;
            clearAuthSession();

            // すでに認証画面にいる場合は同じ画面への遷移と期限切れ通知を行わない
            if (AUTH_PAGE_PATHS.has(location.pathname)) {
                return;
            }

            toast.error(
                'セッションの有効期限が切れました。再度サインインしてください。',
            );

            navigate('/signin', { replace: true });
        });
    }, [location.pathname, navigate]);

    // 認証状態を監視するだけのコンポーネントなので画面には何も描画しない
    return null;
}
