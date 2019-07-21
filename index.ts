import {interval} from 'rxjs';
import {take} from 'rxjs/operators';

// Import stylesheets
import './assets/style.css';
import './assets/styles/salesforce-lightning-design-system.min.css';

// Write TypeScript code!
// const appDiv: HTMLElement = document.getElementById('app');
// appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

/**
 * ---------- Constantes -----------
 */
const TEXTO_GERAR_RIFA = 'Para gerar sua rifa clique no botão abaixo';
const TEXTO_AGUARDE_GERAR = 'Aguarde enquanto sua rifa está sendo gerada';
const PREFIXO_TEXTO_PROGRESSO = 'Progresso';
const TEXTO_INICIO_PROGRESSO = `${PREFIXO_TEXTO_PROGRESSO}: 0%`;
const TEXTO_FIM_PROGRESSO = `${PREFIXO_TEXTO_PROGRESSO}: 100%`;
const TEXTO_BOTAO_ESPERA = 'Aguarde...';
const TEXTO_BOTAO_DEFAULT = 'Clique aqui para gerar sua rifa!';
const CLASS_PROGRESSO_OCULTO = 'progresso-oculto';
const CLASS_IMG_OCULTO = 'img-oculto';

/**
 * ----------  Dom Footer ---------- 
 */
const iconeLoading = document.querySelector<HTMLImageElement>('#icone-loading');

const botaoBaixarRifa = document.querySelector<HTMLAnchorElement>('#botao-baixar-rifa');

const botaoGerarRifa = document.querySelector<HTMLButtonElement>('#botao-gerar-rifa');
const botaoFecharModal = document.querySelector<HTMLButtonElement>('#botao-fechar-modal');

const containerModal = document.querySelector<HTMLDivElement>('#container-modal');
const containerProgresso = document.querySelector<HTMLDivElement>('#container-progresso');

const textoProgresso = document.querySelector<HTMLSpanElement>('#progresso-text-acessibilidade');
const barraProgresso = document.querySelector<HTMLSpanElement>('#barra-progresso');
const headerCardGerarRifa = document.querySelector<HTMLSpanElement>('#header-card-gerar-rifa');

/**
 * ------------ Eventos ------------ 
 */

/**
 * Inicializa a barra de progresso
 */
const iniciarBarraProgesso = () => {
  headerCardGerarRifa.innerText = TEXTO_AGUARDE_GERAR;
  textoProgresso.innerText = TEXTO_INICIO_PROGRESSO;
  barraProgresso.style.width = '0%';
  containerProgresso.classList.remove(CLASS_PROGRESSO_OCULTO);
  iconeLoading.classList.remove(CLASS_IMG_OCULTO);
};

/**
 * Finaliza a barra de progresso
 */
const finalizaBarraProgresso = () => {
  headerCardGerarRifa.innerText = TEXTO_GERAR_RIFA;
  textoProgresso.innerText = TEXTO_FIM_PROGRESSO;
  barraProgresso.style.width = '100%';
  containerProgresso.classList.add(CLASS_PROGRESSO_OCULTO);
  iconeLoading.classList.add(CLASS_IMG_OCULTO);
};

/**
 * Habilitar botao gerar rifa
 */
const habilitarBotaoGerarRifa = () => {
  botaoGerarRifa.disabled = false;
  botaoGerarRifa.textContent = TEXTO_BOTAO_DEFAULT;
};

/**
 * Desabilitar botão de gerar rifa
 */
const desabilitarBotaoGerarRifa = () => {
  botaoGerarRifa.disabled = true;
  botaoGerarRifa.textContent = TEXTO_BOTAO_ESPERA;
};

/**
 * Abrir modal rifa gerada
 */
const abrirModalRifaGerada = () => {
  containerModal.style.display = '';
};

/**
 * Fechar modal rifa gerada
 */
const fecharModalRifaGerada = () => {
  containerModal.style.display = 'none';
};

// Fechar modal rifa
botaoFecharModal.onclick = fecharModalRifaGerada;

// Gerar Rifa
botaoGerarRifa.onclick = () => {
  console.log('[INFO] {BotaoGerarRifa} - Iniciando procedimento para gerar rifa');
  
  iniciarBarraProgesso();
  desabilitarBotaoGerarRifa();

  interval(500).pipe(
    take(10)
  ).subscribe((i) => {
    barraProgresso.style.width = ((i + 1) * 10) + '%';
  }, err => {
    console.error('[ERROR] {BotaoGerarRifa} - Erro:', err)
  }, () => {
    habilitarBotaoGerarRifa();
    finalizaBarraProgresso();
    abrirModalRifaGerada();
  });
};