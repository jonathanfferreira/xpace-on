# XPACE ON - Mobile App 📱

Este braço do repositório contém o MVP do aplicativo nativo (iOS e Android), criado para oferecer uma experiência "Pocket" do Holo-Deck aos dançarinos.

## Stack
- React Native + Expo (Managed Workflow)
- NativeWind (Tailwind CSS rodando nativamente)

## Como testar no seu próprio Celular Físico 🚀

1. Baixe o app **Expo Go** na sua App Store (Apple/iOS) ou Google Play Store (Android).
2. Tenha certeza de que o **computador e o celular estão na MESMA rede Wi-Fi**.
3. No terminal, caso você feche o robô, acesse a pasta e inicie:
   ```bash
   cd mobile
   npx expo start -c
   ```
4. Um **QR Code** gigante vai aparecer no console.
   - **No iOS:** Abra a Câmera nativa do iPhone e aponte para o código. Clique na notificação que abrirá o Expo Go.
   - **No Android:** Abra o app do **Expo Go**, clique em "Scan QR Code" na aba principal e aponte a câmera.

Pronto, a aplicação abrirá usando Live Reload! Suas atualizações refletirão direto no celular.

> 🛠 *Nota de Dev: Por enquanto apenas a tela "Splash/Login" de rascunho com temas Cyberpunk foi implementada. Faremos as requisições API na próxima iteração.*
