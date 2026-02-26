import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
    const { signIn, signUp, user } = useAuth();
    const [isPoweredOn, setIsPoweredOn] = useState(false);
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const scaleAnim = useState(new Animated.Value(1))[0];
    const uiFade = useState(new Animated.Value(0))[0];

    // Auto-navigate if already authenticated
    useEffect(() => {
        if (user) navigation.replace('MainTabs');
    }, [user]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
            ])
        ).start();
    }, []);

    const handlePowerOn = () => {
        Animated.timing(scaleAnim, { toValue: 4, duration: 800, useNativeDriver: true }).start();
        setTimeout(() => {
            setIsPoweredOn(true);
            Animated.timing(uiFade, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        }, 500);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Preencha e-mail e senha.');
            return;
        }
        setLoading(true);
        try {
            await signIn(email.trim(), password);
            navigation.replace('MainTabs');
        } catch (error) {
            Alert.alert('Erro de Login', error.message || 'Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !fullName) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }
        setLoading(true);
        try {
            await signUp(email.trim(), password, fullName.trim());
            Alert.alert('Conta criada!', 'Verifique seu email para confirmar.', [
                { text: 'OK', onPress: () => setMode('login') }
            ]);
        } catch (error) {
            Alert.alert('Erro no Cadastro', error.message || 'Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (!isPoweredOn) {
        return (
            <View className="flex-1 bg-black items-center justify-center relative overflow-hidden">
                <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
                    <TouchableOpacity activeOpacity={0.9} onPress={handlePowerOn} className="items-center justify-center">
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 items-center justify-center bg-black"
            >
                <View className="items-center z-10 p-6 w-full max-w-sm">
                    <Image
                        source={require('../../assets/images/logo-branca.png')}
                        className="w-48 h-16 mb-8"
                        resizeMode="contain"
                    />

                    <Text className="text-white text-3xl font-bold uppercase tracking-widest mb-2">XPACE ON</Text>
                    <Text className="text-[#888] text-center mb-10 tracking-wider text-xs">
                        {mode === 'login' ? 'A ACADEMIA DE DANÇA NO SEU BOLSO' : 'CRIE SUA CONTA'}
                    </Text>

                    {mode === 'register' && (
                        <TextInput
                            className="w-full h-12 bg-[#111] border border-[#333] rounded-sm px-4 text-white mb-3"
                            placeholder="Nome completo"
                            placeholderTextColor="#555"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                        />
                    )}

                    <TextInput
                        className="w-full h-12 bg-[#111] border border-[#333] rounded-sm px-4 text-white mb-3"
                        placeholder="E-mail"
                        placeholderTextColor="#555"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TextInput
                        className="w-full h-12 bg-[#111] border border-[#333] rounded-sm px-4 text-white mb-6"
                        placeholder="Senha"
                        placeholderTextColor="#555"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        className="w-full h-12 bg-primary items-center justify-center rounded-sm"
                        activeOpacity={0.8}
                        onPress={mode === 'login' ? handleLogin : handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white font-bold uppercase tracking-widest">
                                {mode === 'login' ? 'Entrar na Conta' : 'Criar Cadastro'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full h-12 bg-[#111] border border-[#333] items-center justify-center rounded-sm mt-4"
                        activeOpacity={0.8}
                        onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
                    >
                        <Text className="text-white font-bold uppercase tracking-widest">
                            {mode === 'login' ? 'Criar Cadastro' : 'Já Tenho Conta'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Animated.View>
    );
}
