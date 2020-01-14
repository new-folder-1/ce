import * as React from 'react';

import './Button.scss';

interface ButtonProps {
    text: string;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    theme?: ButtonTheme;
}

type ButtonTheme = 'default' | 'action';

export const Button = React.memo(({ text, theme, className, ...rest }: ButtonProps) => { 
    const bClassName = `Button Button_theme_${theme || 'default'} ${className || ''}`;
    return (
        <button
            className={bClassName}
            {...rest}
        >
            {text}
        </button>
    );
});
