import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { PlayCircle, ShieldCheck, Clock } from 'lucide-react-native';

export default function LibraryScreen({ navigation }) {

    // Dados mockados de assinatura e acessos do usuário
    const myAccesses = [
        { id: '1', title: 'Acesso Global Membro Oficial', type: 'Assinatura', status: 'Ativo', progress: '35%' },
        { id: '2', title: 'Fundamentos Hip-Hop (Locking)', type: 'Curso Avulso', status: 'Vitalício', progress: '100%' },
    ];

    return (
        <View className="flex-1 bg-black">

            {/* Topbar Simplificada */}
            <View className="px-6 pt-16 pb-4 bg-[#050505] border-b border-[#222]">
                <Text className="text-white font-bold text-2xl uppercase tracking-widest">Biblioteca</Text>
                <Text className="text-[#888] text-xs uppercase tracking-widest mt-1">Meus Cursos e Assinaturas</Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-6 pb-20" showsVerticalScrollIndicator={false}>

                {myAccesses.map(access => (
                    <TouchableOpacity
                        key={access.id}
                        className="w-full bg-[#0A0A0A] border border-[#222] rounded-md p-4 mb-4 relative overflow-hidden"
                        activeOpacity={0.8}
                    >
                        {/* Indicador de Tipo */}
                        <View className={`absolute top-0 right-0 px-3 py-1 rounded-bl-md ${access.progress === '100%' ? 'bg-secondary' : 'bg-[#111]'}`}>
                            <Text className={`text-[10px] font-bold uppercase tracking-widest ${access.progress === '100%' ? 'text-white' : 'text-[#888]'}`}>
                                {access.progress === '100%' ? 'Concluído' : access.type}
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-4">
                            <View className="w-16 h-16 bg-[#111] border border-[#333] rounded-md items-center justify-center">
                                <ShieldCheck color="#6324b2" size={24} />
                            </View>

                            <View className="flex-1 pr-4">
                                <Text className="text-white font-bold text-lg uppercase leading-tight mb-2 pr-12">{access.title}</Text>
                                <View className="flex-row items-center gap-2">
                                    <Clock color="#666" size={12} />
                                    <Text className="text-[#666] text-xs font-mono uppercase">{access.status}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Barra de Progresso Real */}
                        <View className="mt-6 flex-row items-center justify-between">
                            <View className="flex-1 h-1.5 bg-[#222] rounded-full overflow-hidden mr-4">
                                <View style={{ width: access.progress }} className={`h-full ${access.progress === '100%' ? 'bg-secondary' : 'bg-primary'}`}></View>
                            </View>
                            <Text className="text-white text-xs font-bold font-mono">{access.progress}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

            </ScrollView>
        </View>
    );
}
