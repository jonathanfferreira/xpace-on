import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, PlayCircle, Heart, Star, Share2, MoreHorizontal } from 'lucide-react-native';

export default function ClassScreen({ navigation }) {

    // O vídeo propriamente dito (será expo-av ou react-native-video)
    const VideoPlayerPlaceholder = () => (
        <View className="w-full aspect-video bg-[#050505] items-center justify-center relative border-b border-[#222]">
            <View className="absolute inset-0 bg-[url('https://example.com/fake-bg')] bg-cover opacity-20"></View>
            <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center border border-primary/50 relative z-10">
                <PlayCircle color="white" size={32} className="ml-1" />
            </View>
            <View className="absolute bottom-2 left-4">
                <View className="bg-red-500 px-2 py-0.5 rounded-sm">
                    <Text className="text-white text-[8px] font-bold uppercase tracking-widest">Gravado</Text>
                </View>
            </View>
            {/* Timeline Placeholder */}
            <View className="absolute bottom-0 inset-x-0 h-1 bg-[#222]">
                <View className="h-full w-1/3 bg-primary"></View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-black">

            {/* Topbar Flutuante */}
            <View className="absolute top-12 left-4 z-50">
                <TouchableOpacity
                    className="w-10 h-10 bg-black/60 rounded-full items-center justify-center border border-white/10"
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft color="white" size={20} />
                </TouchableOpacity>
            </View>

            {/* Vídeo Viewport em cima de tudo */}
            <VideoPlayerPlaceholder />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 py-6 pb-20">

                    {/* Meta Info */}
                    <View className="flex-row items-center gap-2 mb-3">
                        <View className="bg-[#111] px-2 py-1 rounded border border-[#222]">
                            <Text className="text-secondary text-[10px] font-bold uppercase tracking-widest">+120 XP</Text>
                        </View>
                        <Text className="text-[#666] text-xs font-mono uppercase tracking-widest">Módulo 02</Text>
                    </View>

                    <Text className="font-bold text-white text-2xl uppercase leading-tight mb-2">Bounces & Grooves Essenciais</Text>
                    <Text className="text-[#888] text-sm leading-relaxed mb-6">Treinamento mecânico e orgânico do bounce superior. Prática focada no eixo vertical e dissociação de ombros para preparo do aluno iniciante na dança urbana.</Text>

                    {/* Ações Rápidas */}
                    <View className="flex-row items-center justify-between border-y border-[#1a1a1a] py-4 mb-8">
                        <TouchableOpacity className="items-center">
                            <Heart color="#eb00bc" size={20} />
                            <Text className="text-[#888] text-[10px] rounded mt-2 uppercase tracking-widest">Curtir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="items-center">
                            <Star color="#ffbd2e" size={20} />
                            <Text className="text-[#888] text-[10px] rounded mt-2 uppercase tracking-widest">Avaliar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="items-center">
                            <Share2 color="white" size={20} />
                            <Text className="text-[#888] text-[10px] rounded mt-2 uppercase tracking-widest">Link</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="items-center">
                            <MoreHorizontal color="#888" size={20} />
                            <Text className="text-[#888] text-[10px] rounded mt-2 uppercase tracking-widest">Mais</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Professor Info */}
                    <Text className="text-white font-bold uppercase tracking-widest mb-4">Mestre Especialista</Text>
                    <View className="flex-row items-center bg-[#050505] border border-[#222] p-4 rounded-md">
                        <View className="w-12 h-12 rounded-full bg-[#111] border border-[#333] items-center justify-center mr-4">
                            <Star color="#ffbd2e" size={16} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold">Jonathan Ferreira</Text>
                            <Text className="text-[#666] text-xs mt-1">+99.9K Alunos Treinados</Text>
                        </View>
                        <TouchableOpacity className="bg-[#111] px-4 py-2 border border-[#222] rounded-sm">
                            <Text className="text-white text-[10px] uppercase tracking-widest font-bold">Seguir</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}
