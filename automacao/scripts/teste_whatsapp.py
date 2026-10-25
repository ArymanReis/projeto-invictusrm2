import urllib.parse
import webbrowser
import time
import pyautogui

# --- CONFIGURAÇÃO DO TESTE SEGURO ---
meu_telefone_teste = "5521983223596"  # Seu número atual
meu_nome_teste = "Bruna"
minha_unidade_teste = "Alcântara"

# Mensagem de teste humanizada
mensagem_teste = (
    f"Olá, {meu_nome_teste}! Este é um teste de automação do projeto Invictus RM2 "
    f"referente à unidade de {minha_unidade_teste}. Se recebeu esta mensagem, o fluxo está 100% validado!"
)

# Codifica a mensagem para o formato de URL do WhatsApp
mensagem_codificada = urllib.parse.quote(mensagem_teste)

# Monta o link oficial da API web do WhatsApp
link_whatsapp = f"https://web.whatsapp.com/send?phone={meu_telefone_teste}&text={mensagem_codificada}"

print("--- A INICIAR O TESTE PARA O SEU NÚMERO ---")
print(f"A abrir o WhatsApp Web para o número: {meu_telefone_teste}")

# Abre o navegador no chat do seu próprio número
webbrowser.open(link_whatsapp)

# Pausa generosa para o WhatsApp Web carregar completamente a página (8 a 10 segundos)
time.sleep(9) 

# 1. Clica na tela para garantir que o navegador ganhou o foco do Windows
# (Clica no meio da tela onde costuma estar a conversa)
pyautogui.click(x=600, y=500)
time.sleep(1)

# 2. Pressiona Enter para enviar a mensagem que já está preenchida
pyautogui.press('enter')

print("--- COMANDO DE ENVIO EXECUTADO COM SUCESSO! ---")