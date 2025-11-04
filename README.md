# ⚽ Hax-bot-PTBRv4

Este é um script personalizado de uma **sala do HaxBall**, desenvolvido para o servidor **SESI-SJ**.  
Ele oferece um **sistema de jogos automatizado** com tempos aleatórios, mapas sonoros, prorrogação integrada, avisos visuais e comandos intuitivos para jogadores.

---

## 📋 Descrição

O script cria uma sala de HaxBall com as seguintes características principais:

- **Tempos Aleatórios:** Seleção automática de tempos de seleções, clubes sul-americanos e europeus.  
- **Mapas Dinâmicos:** Ajuste automático do mapa baseado no número de jogadores (`x2`, `x3`, `x5`).  
- **Prorrogação Integrada:** Sempre ativa aos X minutos, independente do placar.  
- **Avisos e Contagem Regressiva:** Notificações visuais com contagem `3-2-1`.  
- **Comandos Intuitivos:** `!status`, `!regras`, `!uniforme`, entre outros.  
- **Estatísticas:** Velocidade da bola, posse de bola e lista de gols.  

---

## 🚀 Funcionalidades

### 🏆 Seleção de Times
- Categorias: **Seleções**, **Clubes LA**, **Clubes EU**.  
- Inclui **uniformes e emojis personalizados**.

### 🌍 Mapas Adaptativos
| Nº de Jogadores | Mapa | Tempo | Prorrogação | Limite de Gols |
|------------------|-------|--------|---------------|----------------|
| Até 4 | Stadiumx2 | 3 min | +3 min | 3 gols |
| 5–9 | Stadiumx3 | 5 min | +3 min | 5 gols |
| 10+ | Stadiumx5 | 10 min | +3 min | 8 gols |

### ⏱️ Prorrogação
- Sempre anunciada aos **X minutos**.  
- Se o placar empatar no fim, o jogo **reinicia automaticamente** com novos tempos.

### 🔔 Avisos Antecipados
- 30s e 10s antes do fim → informa empate ou quem está ganhando.  
- Contagem regressiva **3-2-1** sempre no encerramento.

### 💬 Comandos

| Comando | Descrição | Exemplo |
|----------|------------|----------|
| `!ajuda` | Lista todos os comandos. | `!ajuda` |
| `!status` | Mostra placar e tempo restante. | `!status` |
| `!regras` | Exibe as regras do jogo. | `!regras` |
| `!uniforme` | Mostra lista de uniformes. | `!uniforme bah` |
| `!reserva` | Troca para uniforme reserva. | `!reserva` |
| `!bb` | Sai da sala. | `!bb` |

**Comandos Admin:**
- `!rr` → Reinicia o jogo.  
- `!pass` → Altera a senha da sala.  

### 📊 Estatísticas
- Velocidade da bola (km/h).  
- Posse de bola.  
- Lista de gols.  
- Balanceamento automático de times.  
- Mensagens animadas com emojis e anúncios promocionais.  

---

## 🛠️ Instalação

### 📦 Pré-requisitos
- Conta no [HaxBall](https://www.haxball.com) (gratuita).  
- Navegador compatível (Chrome, Firefox) **ou Node.js** (para modo headless).

### 💻 Passos

1. **Baixe o Script:** copie o conteúdo do arquivo `BOT.js`.  
2. **Crie uma Sala:**
   - Acesse (https://www.haxball.com/headless).  
   - Clique na tecla **F12**.
   - Após isso va em console, e troque de headless.html para top 
   - Cole o script no campo de código.  
3. **Executar:** clique na tecla **Enter** para iniciar a sala.
