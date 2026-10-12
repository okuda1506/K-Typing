import { useState } from 'react';
import type { ComponentProps } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PasswordInputProps = Omit<ComponentProps<'input'>, 'id' | 'type'> & {
    id: string;
    visibilityLabel?: string;
};

/** パスワードの表示・非表示を切り替えられる入力欄 */
export function PasswordInput({
    id,
    disabled,
    visibilityLabel = 'パスワード',
    ...props
}: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false);
    const toggleLabel = `${visibilityLabel}を${isVisible ? '非表示' : '表示'}`;

    return (
        <div className="password-input">
            <input
                {...props}
                id={id}
                disabled={disabled}
                type={isVisible ? 'text' : 'password'}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="password-visibility-toggle"
                aria-label={toggleLabel}
                aria-controls={id}
                aria-pressed={isVisible}
                title={toggleLabel}
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setIsVisible((current) => !current)}
            >
                {isVisible ? (
                    <EyeOff className="size-5" aria-hidden="true" />
                ) : (
                    <Eye className="size-5" aria-hidden="true" />
                )}
            </Button>
        </div>
    );
}
