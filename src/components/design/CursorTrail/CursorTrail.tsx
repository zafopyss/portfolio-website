import { useEffect, useState } from "react";

const TRAIL_DURATION = 500;

export default function CursorTrail() {
    const [points, setPoints] = useState<{ x: number; y: number; timestamp: number }[]>([]);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            const now = Date.now();
            setPoints((prev) => {
                const next = [...prev, { x: e.clientX, y: e.clientY, timestamp: now }];
                return next;
            });
        };

        const handleLeave = () => setPoints([]);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseleave", handleLeave);

        const interval = setInterval(() => {
            const now = Date.now();
            setPoints((prev) => prev.filter((point) => now - point.timestamp < TRAIL_DURATION));
        }, 50);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseleave", handleLeave);
            clearInterval(interval);
        };
    }, []);

    const now = Date.now();
    const recentPoints = points.filter((point) => now - point.timestamp < TRAIL_DURATION);
    const pointsAttr = recentPoints.map((point) => `${point.x},${point.y}`).join(" ");

    return (
        <svg
            className="pointer-events-none fixed inset-0 z-50 w-full h-full mix-blend-screen"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                    <stop offset="40%" stopColor="#359aacff" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#3554ffff" stopOpacity="0.9" />
                </linearGradient>
            </defs>
            <polyline
                points={pointsAttr}
                fill="none"
                stroke="url(#trailGradient)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="blur-sm"
            />
        </svg>
    );
}


//     return (
//         <div
//             className="pointer-events-none fixed top-0 left-0 w-20 h-20 rounded-full bg-blue-500 opacity-40 blur-2xl transition-transform duration-150"
//             style={{
//                 transform: `translate(${pos.x - 40}px, ${pos.y - 40}px)`,
//             }}
//         />
//     );
// }
