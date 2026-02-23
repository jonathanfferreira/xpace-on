import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';

export default function LoginScreen({ navigation }) {
    const [isPoweredOn, setIsPoweredOn] = useState(false);

    // Animações para o Sticker On e Fade da Interface de Login
    const scaleAnim = useState(new Animated.Value(1))[0];
    const uiFade = useState(new Animated.Value(0))[0];

    useEffect(() => {
        // Breathe effect do sticker (Pulsação contínua)
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
            ])
        ).start();
    }, []);

    const handlePowerOn = () => {
        // Fator de Scale explodindo pra fora da tela e fading no UI real
        Animated.timing(scaleAnim, { toValue: 4, duration: 800, useNativeDriver: true }).start();

        // Simular o Boot 
        setTimeout(() => {
            setIsPoweredOn(true);
            Animated.timing(uiFade, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        }, 500); // 500ms antes de liberar a tela
    };

    if (!isPoweredOn) {
        return (
            <View className="flex-1 bg-black items-center justify-center relative overflow-hidden">
                <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
                    <TouchableOpacity activeOpacity={0.9} onPress={handlePowerOn} className="items-center justify-center">
                        {/* Fake Glow */}
                        <View className="absolute w-40 h-40 bg-primary/20 rounded-full" />
                        <Image
                            source={require('../../assets/images/xpace-on-sticker.png')}
                            className="w-48 h-48"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </Animated.View>
                <View className="absolute bottom-32">
                    <Text className="text-white font-bold tracking-[0.3em] opacity-40 uppercase text-xs">Tap to Power On</Text>
                </View>
            </View>
        );
    }

    return (
        <Animated.View style={{ opacity: uiFade, flex: 1 }}>
            <View className="flex-1 items-center justify-center bg-black">
                <View className="items-center z-10 p-6 w-full max-w-sm">

                    {/* Logo Oficial */}
                    <Image
                        source={require('../../assets/images/logo-branca.png')}
                        className="w-48 h-16 mb-8"
                        resizeMode="contain"
                    />

                    <Text className="text-white text-3xl font-bold uppercase tracking-widest mb-2">XPACE ON</Text>
                    <Text className="text-[#888] text-center mb-10 tracking-wider text-xs">A ACADEMIA DE DANÇA NO SEU BOLSO</Text>

                    <TouchableOpacity
                        className="w-full h-12 bg-primary items-center justify-center rounded-sm"
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('MainTabs')}
                    >
                        <Text className="text-white font-bold uppercase tracking-widest">Entrar na Conta</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full h-12 bg-[#111] border border-[#333] items-center justify-center rounded-sm mt-4"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold uppercase tracking-widest">Criar Cadastro</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
}
