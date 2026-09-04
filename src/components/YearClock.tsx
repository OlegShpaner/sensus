import { useMemo } from "react";

interface YearClockProps {
    dayOfYear: number;
    totalDays?: number;
    onClick?: () => void;
}

export default function YearClock({ dayOfYear, totalDays = 365, onClick }: YearClockProps) {
    // Constants
    const size = 300;
    const center = size / 2;
    const radius = size / 2 - 20;

    // Angle
    const angle = (dayOfYear / totalDays) * 360;

    // Roman Numerals for 12 months (roughly)
    const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

    const ticks = useMemo(() => {
        return romanNumerals.map((num, i) => {
            // 12 o'clock is -90deg. i=0 is month 1.
            const tickAngle = (i / 12) * 360 - 90;

            // Position for text
            const textRadius = radius - 35;
            const x = center + textRadius * Math.cos((tickAngle * Math.PI) / 180);
            const y = center + textRadius * Math.sin((tickAngle * Math.PI) / 180);

            // Tick line
            const x1 = center + (radius - 10) * Math.cos((tickAngle * Math.PI) / 180);
            const y1 = center + (radius - 10) * Math.sin((tickAngle * Math.PI) / 180);
            const x2 = center + radius * Math.cos((tickAngle * Math.PI) / 180);
            const y2 = center + radius * Math.sin((tickAngle * Math.PI) / 180);

            return (
                <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-primary)" strokeWidth="2" />
                    <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="var(--color-primary)"
                        style={{ fontFamily: 'Cinzel', fontSize: '14px', fontWeight: 700 }}
                        transform={`rotate(${tickAngle + 90}, ${x}, ${y})`}
                    >
                        {num}
                    </text>
                </g>
            );
        });
    }, [center, radius]);

    return (
        <div
            className="year-clock-container"
            onClick={onClick}
            style={{
                width: size,
                height: size,
                margin: '0 auto',
                position: 'relative',
                cursor: 'pointer',
                userSelect: 'none'
            }}
        >
            {/* Stone Shadow */}
            <div
                style={{
                    position: 'absolute',
                    top: 10, left: 10, right: 10, bottom: 10,
                    borderRadius: '50%',
                    boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
                    zIndex: 1
                }}
            />

            <svg width={size} height={size} style={{ position: 'relative', zIndex: 2 }}>

                {/* Marble Face */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="var(--color-surface)"
                    stroke="var(--color-border)"
                    strokeWidth="4"
                />
                <circle
                    cx={center}
                    cy={center}
                    r={radius - 8}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="1"
                />

                {/* Ticks & Numerals */}
                {ticks}

                {/* The Hand (Gnomon shadow style) */}
                <g transform={`rotate(${angle}, ${center}, ${center})`} style={{ transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <line
                        x1={center}
                        y1={center}
                        x2={center}
                        y2={center - radius + 40}
                        stroke="var(--color-accent)"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                    <line
                        x1={center}
                        y1={center}
                        x2={center}
                        y2={center - radius + 40}
                        stroke="var(--color-primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </g>

                {/* Center Hub (Bronze) */}
                <circle cx={center} cy={center} r="12" fill="var(--color-accent)" stroke="var(--color-primary)" strokeWidth="2" />

            </svg>

            {/* Digital Overlay */}
            <div style={{
                position: 'absolute',
                top: '55%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'var(--color-primary)',
                zIndex: 3,
                pointerEvents: 'none',
                textShadow: '0 2px 0 rgba(255,255,255,0.8)'
            }}>
                <div style={{ fontFamily: 'Cinzel', fontSize: '10px', letterSpacing: '0.2em' }}>DIES</div>
                <div style={{ fontFamily: 'Cinzel', fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>{dayOfYear}</div>
                <div style={{ fontFamily: 'Cinzel', fontSize: '0.75rem', marginTop: '-5px', opacity: 0.8 }}>of {totalDays}</div>
            </div>

        </div>
    );
}
