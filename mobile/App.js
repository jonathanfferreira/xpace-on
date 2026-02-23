import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <View className="items-center z-10 p-6 w-full max-w-sm">

        {/* Logo Oficial */}
        <Image
          source={require('./assets/images/logo-branca.png')}
          className="w-48 h-16 mb-8"
          resizeMode="contain"
        />

        <Text className="text-white text-3xl font-bold uppercase tracking-widest mb-2">XPACE ON</Text>
        <Text className="text-[#888] text-center mb-10 tracking-wider text-xs">A ACADEMIA DE DANÇA NO SEU BOLSO</Text>

        <TouchableOpacity
          className="w-full h-12 bg-primary items-center justify-center rounded-sm"
          activeOpacity={0.8}
          onPress={() => Alert.alert('XPACE ON', 'Navegação para Login em breve!')}
        >
          <Text className="text-white font-bold uppercase tracking-widest">Entrar na Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full h-12 bg-[#111] border border-[#333] items-center justify-center rounded-sm mt-4"
          activeOpacity={0.8}
          onPress={() => Alert.alert('XPACE ON', 'Navegação para Cadastro em breve!')}
        >
          <Text className="text-white font-bold uppercase tracking-widest">Criar Cadastro</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </View>
  );
}
