import Link from 'next/link'
import { Play, Lock } from 'lucide-react'

const MOCK_COURSES = [
    {
        id: 'course-1',
        title: 'Fundamentos Hip-Hop',
        teacher: 'Prof. Neguin',
        thumbnail: '/images/bg-degrade.png',
        progress: 45,
        totalLessons: 24,
        completedLessons: 11,
        status: 'active' as const,
    },
    {
        id: 'course-2',
        title: 'Breaking Avançado',
        teacher: 'B-Boy Pelezinho',
        thumbnail: '/images/bg-degrade.png',
        progress: 12,
        totalLessons: 18,
        completedLessons: 2,
        status: 'active' as const,
    },
    {
        id: 'course-3',
        title: 'House Dance Iniciante',
        teacher: 'Prof. Marjory',
        thumbnail: '/images/bg-degrade.png',
        progress: 100,
        totalLessons: 12,
        completedLessons: 12,
        status: 'completed' as const,
    },
]

export default function MeusAcessosPage() {
    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="mb-10">
                <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">
                    Meus <span className="text-transparent bg-clip-text text-gradient-neon">Acessos</span>
                </h1>
                <p className="text-[#888] font-sans">Cursos que você desbloqueou e pode estudar agora.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_COURSES.map(course => (
                    <div key={course.id} className="bg-[#0A0A0A] border border-[#222] rounded-sm overflow-hidden group hover:border-primary/30 transition-colors">
                        {/* Thumbnail */}
                        <div className="relative h-40 bg-[#111] overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/images/bg-degrade.png')] bg-cover opacity-30 group-hover:opacity-50 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center pl-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_20px_#6324b2]">
                                    <Play size={24} fill="currentColor" className="text-white" />
                                </div>
                            </div>
                            {course.status === 'completed' && (
                                <div className="absolute top-3 right-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-sans font-medium px-2 py-0.5 rounded">
                                    Concluído
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <h3 className="font-heading text-lg text-white uppercase mb-1">{course.title}</h3>
                            <p className="text-xs font-sans text-[#666] mb-4">{course.teacher}</p>

                            {/* Progress */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-1.5 flex-1 bg-[#222] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${course.status === 'completed' ? 'bg-emerald-500' : 'bg-primary'}`}
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-mono text-[#666]">{course.progress}%</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-sans text-[#555]">
                                    {course.completedLessons}/{course.totalLessons} aulas
                                </span>
                                <Link
                                    href={`/aula/mock-${course.id}`}
                                    className="text-xs font-sans font-medium text-primary hover:text-white transition-colors"
                                >
                                    {course.status === 'completed' ? 'Rever' : 'Continuar'} →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
