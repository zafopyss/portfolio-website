import React, { JSX } from 'react';

type GradientTextProps = {
    children?: React.ReactNode;
    text?: string; // alternative à children
    sizeClass?: string; // optionnel : classe Tailwind pour la taille
    fontSize?: number; // fallback en px si besoin
    gradientStart?: string;
    gradientEnd?: string;
    direction?: number; // degrés pour la direction du gradient
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    style?: React.CSSProperties; // pour overrider ou ajouter des styles
};

export default function GradientText({
    children,
    text,
    sizeClass,
    fontSize,
    gradientStart = 'var(--color-blue-python, #3776AB)',
    gradientEnd = 'var(--color-yellow-python, #FFD43B)',
    direction = 0,
    as: Tag = 'span',
    className = '',
    style = {},
}: GradientTextProps) {
    const content = children ?? text;

    const gradientStyle: React.CSSProperties = {
        backgroundImage: `linear-gradient(${direction}deg, ${gradientStart}, ${gradientEnd})`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
        ...style,
    };

    if (fontSize) {
        gradientStyle.fontSize = fontSize;
        gradientStyle.lineHeight = 1.1;
    }

    const allClasses = `${sizeClass ? sizeClass + ' ' : ''}${className}`.trim();

    return (
        <Tag className={allClasses} style={gradientStyle}>
            {content}
        </Tag>
    );
}
