import React, { JSX } from 'react';

type GradientTitleProps = {
    text: string;
    sizeClass?: string; // Tailwind text size class like "text-4xl"
    fontSize?: number; // fallback pixel size when Tailwind class does not cover it
    gradientStart?: string;
    gradientEnd?: string;
    direction?: number; // degrees for the gradient direction
    as?: keyof JSX.IntrinsicElements;
    className?: string;
};

export default function GradientTitle({
    text,
    sizeClass = 'text-4xl',
    fontSize,
    gradientStart = 'var(--color-blue-python, #3776AB)',
    gradientEnd = 'var(--color-yellow-python, #FFD43B)',
    direction = 50,
    as: Tag = 'h1',
    className = '',
}: GradientTitleProps) {
    const gradientStyle: React.CSSProperties = {
        backgroundImage: `linear-gradient(${direction}deg, ${gradientStart}, ${gradientEnd})`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
    };

    if (fontSize) {
        gradientStyle.fontSize = fontSize;
        gradientStyle.lineHeight = 1.1;
    }

    return (
        <Tag
            className={`${sizeClass} font-extrabold tracking-tight ${className}`}
            style={gradientStyle}
        >
            {text}
        </Tag>
    );
}
