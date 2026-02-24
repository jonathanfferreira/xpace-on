import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Award, Medal, Trophy, Star } from 'lucide-react-native';

export default function RankingScreen() {

    // Dados Mockados da Gamificação do Usuário
    const leaderboardData = [
        { rank: 1, name: 'Sora_BD', xp: 5420, isMe: false },
        { rank: 2, name: 'Jonathan Ferreira', xp: 4890, isMe: true }, // O usuário logado
        { rank: 3, name: 'Leticia Dance', xp: 4100, isMe: false },
        { rank: 4, name: 'Kauan_01', xp: 3200, isMe: false },
        { rank: 5, name: 'B-Girl Ana', xp: 2980, isMe: false },
        { rank: 6, name: 'Mestre T.', xp: 2800, isMe: false },
        { rank: 7, name: 'GrooveMaster', xp: 2100, isMe: false },
        { rank: 8, name: 'XpaceFan', xp: 1950, isMe: false },
        { rank: 9, name: 'DanceBR', xp: 1500, isMe: false },
        { rank: 10, name: 'Julia_M', xp: 1200, isMe: false },
    ];

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy color="#ffbd2e" size={24} />;
        if (rank === 2) return <Medal color="#C0C0C0" size={24} />; // Prata
        if (rank === 3) return <Award color="#CD7F32" size={24} />; // Bronze
        return <Text className="text-[#555] font-bold text-lg font-mono">#{rank}</Text>;
    };

    return (
        <View className="flex-1 bg-black">

            {/* Topbar Simplificada */}
            <View className="px-6 pt-16 pb-4 bg-[#050505] border-b border-[#222]">
                <View className="flex-row items-center gap-3">
                    <Award color="#eb00bc" size={24} />
                    <Text className="text-white font-bold text-2xl uppercase tracking-widest">Global Rank</Text>
                </View>
                <Text className="text-[#888] text-xs uppercase tracking-widest mt-1">Top 10 da Semana</Text>
            </View>

            {/* O status Pessoal do Usuário Destacado */}
            <View className="bg-gradient-to-r from-primary/20 to-black px-6 py-8 border-b border-primary/30">
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-white text-[10px] uppercase font-bold tracking-widest bg-primary/20 px-2 py-0.5 rounded-sm border border-primary/50 self-start mb-2">Sua Posição Única</Text>
                        <View className="flex-row items-end gap-2">
                            <Text className="text-white font-display text-5xl font-bold tracking-tighter hover:text-white">#2</Text>
                            <Text className="text-[#ffbd2e] font-bold mb-2 uppercase tracking-widest">/ 5,420 XP</Text>
                        </View>
                    </View>
                    <View className="w-16 h-16 bg-[#1A1A1A] rounded-full justify-center items-center border-2 border-primary overflow-hidden">
                        <View className="absolute inset-0 bg-[url('/images/bg-degrade.png')] bg-cover opacity-50"></View>
                    </View>
                </View>
            </View>

            {/* Listagem do Leaderboard */}
            <ScrollView className="flex-1 px-6 pt-6 pb-20" showsVerticalScrollIndicator={false}>

                {leaderboardData.map((user) => (
                    <TouchableOpacity
                        key={user.rank}
                        activeOpacity={0.8}
                        className={`flex-row items-center justify-between p-4 mb-3 rounded-md border ${user.isMe
                                ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(99,36,178,0.3)]'
                                : 'bg-[#0A0A0A] border-[#222]'
                            }`}
                    >
                        <View className="flex-row items-center gap-4">
                            <View className="w-10 h-10 items-center justify-center">
                                {getRankIcon(user.rank)}
                            </View>

                            <View>
                                <Text className={`font-bold text-lg leading-tight uppercase ${user.isMe ? 'text-primary font-bold' : 'text-white'}`}>
                                    {user.name}
                                </Text>
                                <View className="flex-row items-center gap-1 mt-1">
                                    <Star color="#ffbd2e" size={10} />
                                    <Text className="text-[#888] text-[10px] font-mono tracking-widest uppercase">Nível {Math.ceil(user.xp / 1000)}</Text>
                                </View>
                            </View>
                        </View>

                        {/* XP Value */}
                        <View>
                            <Text className="font-mono text-white text-sm tracking-widest">{user.xp} XP</Text>
                        </View>
                    </TouchableOpacity>
                ))}

            </ScrollView>
        </View>
    );
}
