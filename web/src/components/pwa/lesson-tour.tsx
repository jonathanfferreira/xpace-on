'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

export function LessonTour() {
    const [run, setRun] = useState(false);

    useEffect(() => {
        // Dispara o tour de aula apenas na primeira vez
        const tourCompleted = localStorage.getItem('lesson-tour-completed');
        if (!tourCompleted) {
            const timer = setTimeout(() => {
                setRun(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const steps: Step[] = [
        {
            target: '.lesson-step-1', // Video Player Container
            content: (
                <div className="text-left font-sans">
                    <h3 className="font-bold text-white mb-1">Seu Holo-Trainer</h3>
                    <p className="text-xs text-[#aaa]">Aqui acontece a mágica. Use os botões embaixo do vídeo para <strong className="text-primary">Espelhar o professor</strong> ou mudar para a <strong className="text-accent">Câmera Frontal/Traseira</strong> (disponível em algumas aulas).</p>
                </div>
            ),
            placement: 'bottom',
            disableBeacon: true,
        },
        {
            target: '.lesson-step-2', // Sidebar Modules
            content: (
                <div className="text-left font-sans">
                    <h3 className="font-bold text-white mb-1">Cronograma do Módulo</h3>
                    <p className="text-xs text-[#aaa]">Siga a ordem dos treinos por aqui. Nós marcaremos automaticamente quando você atingir 90% do vídeo.</p>
                </div>
            ),
            placement: 'left',
        },
        {
            target: '.lesson-step-3', // Community Board
            content: (
                <div className="text-left font-sans">
                    <h3 className="font-bold text-white mb-1">A Comunidade</h3>
                    <p className="text-xs text-[#aaa]">Travou em algum passo? Suba um vídeo seu ou faça uma pergunta e receba feedback dos Coreógrafos e Alunos.</p>
                </div>
            ),
            placement: 'top',
        }
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('lesson-tour-completed', 'true');
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: '#6324b2',
                    backgroundColor: '#0a0a0a',
                    textColor: '#fff',
                    arrowColor: '#0a0a0a',
                    overlayColor: 'rgba(0, 0, 0, 0.85)',
                },
                tooltipContainer: {
                    textAlign: 'left'
                },
                buttonNext: {
                    backgroundColor: '#6324b2',
                    borderRadius: 2,
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    fontSize: 12,
                    padding: '8px 16px'
                },
                buttonBack: {
                    color: '#888',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    fontSize: 12,
                },
                buttonSkip: {
                    color: '#ff5200',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    fontSize: 12,
                }
            }}
            locale={{
                back: 'Voltar',
                close: 'Fechar',
                last: 'Bora Treinar',
                next: 'Avançar',
                skip: 'Pular'
            }}
        />
    );
}
