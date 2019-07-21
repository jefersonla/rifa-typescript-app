// Import stylesheets
import './assets/style.css';
import './assets/styles/salesforce-lightning-design-system.min.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

/**
 * ---------- Constantes -----------
 */
const GERAR_RIFA = 'Para gerar sua rifa clique no botão abaixo';
const AGUARDE_GERAR_RIFA = 'Aguarde enquanto sua rifa está sendo gerada';
const PREFIXO_TEXTO_PROGRESSO = 'Progresso';
const TEXTO_INICIO_PROGRESSO = `${PREFIXO_TEXTO_PROGRESSO}: 0%`;

/**
 * ----------  Dom Footer ---------- 
 */
const headerCardGerarRifa = document.querySelector<HTMLSpanElement>('#header-card-gerar-rifa');
const textoProgresso = document.querySelector<HTMLSpanElement>('#progresso-text-acessibilidade');
const barraProgresso = document.querySelector<HTMLSpanElement>('#barra-progresso');
const containerProgresso = document.querySelector<HTMLDivElement>('#container-progresso');
const botaoGerarRifa = document.querySelector<HTMLButtonElement>('#botao-gerar-rifa');
const iconeLoading = document.querySelector<HTMLImageElement>('#icone-loading');

/**
 * ------------ Eventos ------------ 
 */

/**
 * Inicializa a barra de progresso
 */
const iniciarBarraProgesso = () => {
  headerCardGerarRifa.innerText = AGUARDE_GERAR_RIFA;
  textoProgresso.innerText = TEXTO_INICIO_PROGRESSO;
  barraProgresso.style.width = '0%';
  containerProgresso.classList.remove('progresso-oculto');
  iconeLoading.classList.remove('img-oculto');
};

/**
 * Desabilitar botão de gerar rifa
 */
const desabilitarBotaoGerarRifa = () => {
  botaoGerarRifa.disabled = true;
};

// Gerar Rifa
botaoGerarRifa.onclick = () => {
  console.log('[INFO] {BotaoGerarRifa} - Iniciando procedimento para gerar rifa');
  
  iniciarBarraProgesso();
  desabilitarBotaoGerarRifa();
};