import { MouseEvent, useEffect, useState } from 'react';

interface CursorSpotlightProps {
    children: React.ReactNode;
    color?: string; 
    size?: number;  
    opacity?: number; 
    borderRadius?: string;
    clipBorderRadius?: string;
    className?: string;
}

export default function CursorSpotlight({
    children,
    color = '#C0C0C0', 
    size = 32,
    opacity = 0.55,
    borderRadius = 'rounded-full',
    clipBorderRadius,
    className,
}: CursorSpotlightProps) {
    const [canUseSpotlight, setCanUseSpotlight] = useState(() =>
        typeof window === 'undefined' ? false : window.matchMedia('(min-width: 1024px)').matches
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const media = window.matchMedia('(min-width: 1024px)');
        const update = (event?: MediaQueryListEvent) => {
            setCanUseSpotlight(event ? event.matches : media.matches);
        };
        media.addEventListener('change', update);
        update();
        return () => media.removeEventListener('change', update);
    }, []);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const sizePx = size * 2; 

    const maskRadius = clipBorderRadius ?? borderRadius;

    if (!canUseSpotlight) {
        return (
            <div className={`relative overflow-hidden ${maskRadius} ${className ?? ''}`}>
                {children}
            </div>
        );
    }

    return (
        <div
            className={`relative overflow-hidden ${maskRadius} ${className ?? ''}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {children}

            {isHovering && (
                <div
                    className={`pointer-events-none absolute z-50 ${borderRadius} blur-xl transition-transform duration-100 ease-linear`}
                    style={{
                        width: `${sizePx}px`,
                        height: `${sizePx}px`,
                        left: `${mousePosition.x}px`,
                        top: `${mousePosition.y}px`,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: color,
                        opacity,
                    }}
                />
            )}
        </div>
    );
}
