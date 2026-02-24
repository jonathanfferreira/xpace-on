import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { User, LogOut, Settings, Bell, CreditCard, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen({ navigation }) {

    // Função mock para Deslogar matando a Stack de "MainTabs"
    const handleLogout = () => {
        navigation.navigate('Login');
    };

    return (
        <View className="flex-1 bg-black">

            {/* Cabeçalho Perfil */}
            <View className="px-6 pt-16 pb-6 bg-[#050505] border-b border-[#222]">
                <View className="flex-row items-center gap-4">
                    <View className="w-16 h-16 bg-[#1A1A1A] rounded-full border border-primary items-center justify-center">
                        <User color="#eb00bc" size={32} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-bold text-xl uppercase tracking-widest">Jonathan Ferreira</Text>
                        <Text className="text-[#888] text-xs font-mono uppercase tracking-widest">Aluno XPACE ON</Text>
                    </View>
                </View>
            </View>

            {/* Menu Sections */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                <View className="px-6 py-6 border-b border-[#111]">
                    <Text className="text-[#555] font-bold text-xs uppercase tracking-widest mb-4">Sua Conta</Text>

                    <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-between bg-[#111] p-4 rounded-t-md border border-[#222] border-b-0">
                        <View className="flex-row items-center gap-3">
                            <Settings color="#888" size={20} />
                            <Text className="text-white font-bold uppercase tracking-widest">Ajustes</Text>
                        </View>
                        <ChevronRight color="#444" size={16} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-between bg-[#111] p-4 border-y border-[#222]">
                        <View className="flex-row items-center gap-3">
                            <Bell color="#888" size={20} />
                            <Text className="text-white font-bold uppercase tracking-widest">Notificações</Text>
                        </View>
                        <ChevronRight color="#444" size={16} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-between bg-[#111] p-4 rounded-b-md border border-[#222] border-t-0">
                        <View className="flex-row items-center gap-3">
                            <CreditCard color="#888" size={20} />
                            <Text className="text-white font-bold uppercase tracking-widest">Pagamentos Nativos</Text>
                        </View>
                        <ChevronRight color="#444" size={16} />
                    </TouchableOpacity>
                </View>

                {/* Zona de Perigo / Sair */}
                <View className="px-6 py-6 pb-20">
                    <Text className="text-[#555] font-bold text-xs uppercase tracking-widest mb-4">Segurança</Text>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="flex-row items-center justify-between bg-[#0A0A0A] p-4 rounded-md border border-red-900/30"
                        onPress={handleLogout}
                    >
                        <View className="flex-row items-center gap-3">
                            <LogOut color="#ff4444" size={20} />
                            <Text className="text-[#ff4444] font-bold uppercase tracking-widest">Encerrar Sessão</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>

        </View>
    );
}
