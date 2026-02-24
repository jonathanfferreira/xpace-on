import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Bell, Flame, PlayCircle, Star, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Dados Mockados para o MVP
const top10Courses = [
    { id: 't1', title: 'Dissociação de Ombros', teacher: 'Prof. Marcos', badge: '#1 EM ALTA', image: null },
    { id: 't2', title: 'Rocking Básico', teacher: 'Mestre K.', badge: '#2 EM ALTA', image: null },
    { id: 't3', title: 'Footwork Patterns 01', teacher: 'B-Boy Flash', badge: '#3 EM ALTA', image: null },
    { id: 't4', title: 'Chest Pops & Hits', teacher: 'Sara Dance', badge: '#4 EM ALTA', image: null },
];

const continueWatching = [
    { id: 'c1', title: 'Bounces & Grooves Essenciais', module: 'Módulo 02', progress: '45%' },
];

const newReleases = [
    { id: 'n1', title: 'Masterclass: Locking Core', duration: '1h 20m' },
    { id: 'n2', title: 'Isolamentos Corporais', duration: '45m' },
];

export default function HomeScreen({ navigation }) {

    // Componente de Item do Top 10 (Scroll Horizontal)
    const renderTop10Item = ({ item }) => (
        <TouchableOpacity
            className="mr-4 w-48 relative overflow-hidden rounded-md border border-[#222] bg-[#0A0A0A]"
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Class')}
        >
            <View className="h-64 bg-[#111] w-full relative">
                {/* Imagem Placeholder */}
                <View className="absolute inset-0 bg-primary/10 opacity-30"></View>
                <View className="absolute bottom-4 left-4 right-4 z-10">
                    <View className="bg-[#eb00bc] self-start px-2 py-1 rounded-sm mb-2">
                        <Text className="text-white text-[8px] font-bold uppercase tracking-widest">{item.badge}</Text>
                    </View>
                    <Text className="text-white font-bold text-lg leading-tight uppercase mb-1">{item.title}</Text>
                    <Text className="text-[#888] text-[10px] uppercase tracking-widest">{item.teacher}</Text>
                </View>
                <View className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></View>
            </View>
        </TouchableOpacity>
    );

    // Componente Lançamentos (Lista Vertical Simples)
    const renderNewRelease = ({ item }) => (
        <TouchableOpacity
            className="flex-row items-center mb-4 bg-[#111] border border-[#222] rounded-md p-3"
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Class')}
        >
            <View className="w-16 h-16 bg-[#1A1A1A] rounded-md items-center justify-center mr-4 border border-[#333]">
                <PlayCircle color="#555" size={24} />
            </View>
            <View className="flex-1">
                <Text className="text-white font-bold text-sm uppercase">{item.title}</Text>
                <Text className="text-[#666] text-xs mt-1">{item.duration}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-black">
            {/* Custom Topbar */}
            <View className="flex-row justify-between items-center px-6 pt-16 pb-4 bg-[#050505] border-b border-[#222] z-50">
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

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                {/* Sessão Ativa (Continue Assistindo) */}
                <View className="px-6 pt-6">
                    <Text className="text-[#555] font-bold text-xs tracking-widest uppercase mb-4">Sessão Ativa</Text>

                    {continueWatching.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            className="w-full bg-[#0A0A0A] border border-[#333] rounded-md overflow-hidden relative mb-8"
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('Class')}
                        >
                            <View className="absolute top-0 left-0 w-1 h-full bg-[#6324b2] z-10"></View>
                            <View className="p-4 pl-6">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <View className="bg-[#6324b2]/20 border border-[#6324b2]/50 px-2 py-0.5 rounded-sm">
                                        <Text className="text-[#6324b2] text-[10px] uppercase tracking-widest font-bold">{item.module}</Text>
                                    </View>
                                </View>
                                <Text className="text-white font-bold text-lg uppercase leading-tight mb-4">{item.title}</Text>

                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center border border-white/20 px-4 py-2 rounded-sm gap-2">
                                        <PlayCircle color="white" size={14} />
                                        <Text className="text-white font-bold text-[10px] tracking-widest uppercase">Retomar</Text>
                                    </View>
                                    <View className="flex-1 ml-4 justify-center">
                                        <View className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
                                            <View style={{ width: item.progress }} className="h-full bg-[#6324b2]"></View>
                                        </View>
                                        <Text className="text-[#666] text-[8px] font-mono mt-1 self-end">{item.progress}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Top 10 em Alta (FlatList Horizontal) */}
                <View className="pl-6 mb-8">
                    <Text className="text-white font-bold text-lg uppercase tracking-widest mb-4">Top 10 Hoje <Text className="text-[#eb00bc] text-xs">Brasil</Text></Text>

                    <FlatList
                        data={top10Courses}
                        renderItem={renderTop10Item}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 24 }}
                    />
                </View>

                {/* Lançamentos Recentes */}
                <View className="px-6 pb-12">
                    <View className="flex-row items-center gap-2 mb-4">
                        <Sparkles color="#6324b2" size={16} />
                        <Text className="text-white font-bold text-sm uppercase tracking-widest">Lançamentos</Text>
                    </View>

                    {newReleases.map(item => renderNewRelease({ item }))}
                </View>

            </ScrollView>
        </View>
    );
}
