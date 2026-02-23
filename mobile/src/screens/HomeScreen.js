import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Bell, Flame, PlayCircle } from 'lucide-react-native';

export default function HomeScreen() {
    // Mockup Data for Courses
    const courses = [
        { id: '1', title: 'Fundamentos do Hip-Hop', teacher: 'Prof. Marcos', xp: '120 XP' },
        { id: '2', title: 'Street Dance Avançado', teacher: 'Mestre K.', xp: '250 XP' },
        { id: '3', title: 'B-Boy Basics', teacher: 'B-Boy Flash', xp: '50 XP' },
    ];

    return (
        <View className="flex-1 bg-black">
            {/* Custom Topbar */}
            <View className="flex-row justify-between items-center px-6 pt-16 pb-4 bg-[#050505] border-b border-[#222]">
                <Image
                    source={require('../../assets/images/logo-branca.png')}
                    className="w-24 h-8"
                    resizeMode="contain"
                />
                <View className="flex-row items-center space-x-4 gap-4">
                    <View className="flex-row items-center bg-[#111] border border-[#333] px-2 py-1 rounded">
                        <Flame color="#eb00bc" size={14} />
                        <Text className="text-[#eb00bc] font-bold text-xs ml-1">4</Text>
                    </View>
                    <TouchableOpacity>
                        <Bell color="#888" size={20} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-6">

                {/* Hero Banner Minimalista */}
                <View className="w-full h-40 bg-[#111] rounded border border-[#222] mb-8 overflow-hidden relative justify-center items-center">
                    <View className="absolute inset-0 bg-primary/20 opacity-30"></View>
                    <View className="items-center z-10 p-4">
                        <Text className="text-secondary font-bold text-[10px] tracking-widest uppercase mb-1">Novo Curso</Text>
                        <Text className="text-white font-bold text-2xl tracking-tighter uppercase mb-2">Masterclass Choreography</Text>
                        <TouchableOpacity className="bg-primary px-4 py-2 rounded-sm flex-row items-center gap-2">
                            <PlayCircle color="white" size={16} />
                            <Text className="text-white font-bold text-xs uppercase tracking-wider">Começar Agora</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Section Title */}
                <Text className="text-white font-bold text-xl uppercase tracking-widest mb-4">Recomendados para você</Text>

                {/* Vertical Course List */}
                <View className="space-y-4 gap-4 pb-20">
                    {courses.map((course) => (
                        <TouchableOpacity key={course.id} className="w-full flex-row bg-[#080808] border border-[#222] rounded-md overflow-hidden" activeOpacity={0.8}>
                            {/* Course Thumbnail */}
                            <View className="w-32 h-24 bg-[#1a1a1a] items-center justify-center">
                                <PlayCircle color="#333" size={30} />
                            </View>

                            {/* Course Info */}
                            <View className="flex-1 p-3 justify-between">
                                <View>
                                    <Text className="text-white font-bold text-sm" numberOfLines={2}>{course.title}</Text>
                                    <Text className="text-[#666] text-xs mt-1">{course.teacher}</Text>
                                </View>
                                <View className="flex-row justify-between items-center mt-2">
                                    <Text className="text-secondary text-[10px] font-bold">{course.xp}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
