import os
import unicodedata
import re

def normalizar_nome(nome):
    nome = unicodedata.normalize('NFD', nome)
    nome = nome.encode('ascii', 'ignore').decode('utf-8')
    nome = nome.lower()
    nome = re.sub(r'\s+', '-', nome)
    nome = re.sub(r'[^a-z0-9\-]', '', nome)
    nome = re.sub(r'\-+', '-', nome)
    return nome

nomes_esperados = [
    "São Luís",
    "Imperatriz",
    "Caxias",
    "Codó"
]

arquivos_esperados = [normalizar_nome(nome) + '.html' for nome in nomes_esperados]

pasta = './seu_diretorio'  # Mude para sua pasta

arquivos_encontrados = [f for f in os.listdir(pasta) if f.endswith('.html')]

faltando = [f for f in arquivos_esperados if f not in arquivos_encontrados]
extras = [f for f in arquivos_encontrados if f not in arquivos_esperados]

print('Arquivos esperados:', arquivos_esperados)
print('Arquivos encontrados:', arquivos_encontrados)
print('Arquivos faltando:', faltando)
print('Arquivos extras:', extras)
