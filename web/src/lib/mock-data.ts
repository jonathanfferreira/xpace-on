export type Lesson = {
    id: string;
    title: string;
    duration: string;
    isCompleted: boolean;
    isActive: boolean;
};

export type Module = {
    id: string;
    title: string;
    lessons: Lesson[];
};

export const MOCK_COURSE = {
    id: "course-1",
    title: "Fundamentos Hip-Hop",
    instructor: "Ton Novaes",
    modules: [
        {
            id: "mod-1",
            title: "Introdução ao Groove",
            lessons: [
                { id: "les-1", title: "O que é o Bounce?", duration: "05:42", isCompleted: true, isActive: false },
                { id: "les-2", title: "Verticalidade: Up & Down", duration: "12:15", isCompleted: true, isActive: false },
                { id: "les-3", title: "Rocking Básico", duration: "08:30", isCompleted: false, isActive: false },
            ]
        },
        {
            id: "mod-2",
            title: "Isolamento e Controle",
            lessons: [
                { id: "mock-123", title: "Dissociação de Ombros", duration: "15:20", isCompleted: false, isActive: true },
                { id: "les-5", title: "Chest Pops & Hits", duration: "11:05", isCompleted: false, isActive: false },
                { id: "les-6", title: "Drill Intermediário", duration: "22:40", isCompleted: false, isActive: false },
            ]
        },
        {
            id: "mod-3",
            title: "Foundation Steps",
            lessons: [
                { id: "les-7", title: "Smurf & Prep", duration: "09:15", isCompleted: false, isActive: false },
                { id: "les-8", title: "Party Machine", duration: "07:50", isCompleted: false, isActive: false },
            ]
        }
    ]
};
