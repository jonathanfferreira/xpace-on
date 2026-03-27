import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'XPACE — Plataforma Premium de Streaming para Dança';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#020202',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Gradient glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-200px',
                        left: '50%',
                        width: '800px',
                        height: '800px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99,36,178,0.3) 0%, rgba(235,0,188,0.15) 40%, transparent 70%)',
                        transform: 'translateX(-50%)',
                    }}
                />

                {/* Bottom glow */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-150px',
                        right: '-100px',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,82,0,0.2) 0%, transparent 60%)',
                    }}
                />

                {/* Brand name */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginBottom: '8px',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '14px',
                                letterSpacing: '6px',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.4)',
                                fontFamily: 'monospace',
                            }}
                        >
                            A Evolução do Streaming
                        </span>
                    </div>

                    <h1
                        style={{
                            fontSize: '96px',
                            fontWeight: 900,
                            letterSpacing: '8px',
                            textTransform: 'uppercase',
                            background: 'linear-gradient(135deg, #6324B2, #EB00BC, #FF5200)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            lineHeight: 1,
                            margin: 0,
                        }}
                    >
                        XPACE
                    </h1>

                    <p
                        style={{
                            fontSize: '22px',
                            color: 'rgba(255,255,255,0.7)',
                            letterSpacing: '2px',
                            margin: '4px 0 0',
                        }}
                    >
                        Aprenda Dança do Zero ao Palco
                    </p>

                    {/* Launch date badge */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '24px',
                            padding: '8px 20px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '999px',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                        }}
                    >
                        <div
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#EB00BC',
                            }}
                        />
                        <span
                            style={{
                                fontSize: '13px',
                                letterSpacing: '4px',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.5)',
                                fontFamily: 'monospace',
                            }}
                        >
                            Abertura: 29 de Abril de 2026
                        </span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
