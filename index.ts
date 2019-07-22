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
const TEXT_VAR_HEADER_LINHA1 = '%TEXT_VAR_HEADER_LINHA1%';
const TEXT_VAR_HEADER_LINHA2 = '%TEXT_VAR_HEADER_LINHA2%';
const TEXT_VAR_PREMIO_LINHA1 = '%TEXT_VAR_PREMIO_LINHA1%';
const TEXT_VAR_PREMIO_LINHA2 = '%TEXT_VAR_PREMIO_LINHA2%';
const TEXT_VAR_DATA_REALIZACAO = '%TEXT_VAR_DATA_REALIZACAO%';
const TEXT_VAR_LOCAL_REALIZACAO = '%TEXT_VAR_LOCAL_REALIZACAO%';
const TEXT_VAR_OBSERVACOES = '%TEXT_VAR_OBSERVACOES%';

/**
 * Variaveis template rifa
 */
const variaveisTemplate = {
  var_num1: document.querySelector<SVGTextElement>('#var_num1'),
  var_num2: document.querySelector<SVGTextElement>('#var_num2'),
  var_header_linha1: document.querySelector<SVGTextElement>('#var_header_linha1'),
  var_header_linha2: document.querySelector<SVGTextElement>('#var_header_linha2'),
  var_premio_linha1: document.querySelector<SVGTextElement>('#var_premio_linha1'),
  var_premio_linha2: document.querySelector<SVGTextElement>('#var_premio_linha2'),
  var_data_realizacao: document.querySelector<SVGTextElement>('#var_data_realizacao'),
  var_local_realizacao: document.querySelector<SVGTextElement>('#var_local_realizacao'),
  var_observacoes: document.querySelector<SVGTextElement>('#var_observacoes')
};

/**
 * ----------  Dom Footer ---------- 
 */
const inputQuantidadeFichas = document.querySelector<HTMLInputElement>('#input-quantidade-fichas');

const botaoIncrementarFichas = document.querySelector<HTMLInputElement>('#botao-incrementar-fichas');
const botaoDecrementarFichas = document.querySelector<HTMLInputElement>('#botao-decrementar-fichas');

const inputsTemplate = {
  inputHeaderLinha1: document.querySelector<HTMLInputElement>('#input_var_header_linha1'),
  inputHeaderLinha2: document.querySelector<HTMLInputElement>('#input_var_header_linha2'),
  inputPremioLinha1: document.querySelector<HTMLInputElement>('#input_var_premio_linha1'),
  inputPremioLinha2: document.querySelector<HTMLInputElement>('#input_var_premio_linha2'),
  inputDataRealizacao: document.querySelector<HTMLInputElement>('#input_var_data_realizacao'),
  inputLocalRealizacao: document.querySelector<HTMLInputElement>('#input_var_local_realizacao'),
  inputObservacoes: document.querySelector<HTMLInputElement>('#input_var_observacoes')
};

const iconeLoading = document.querySelector<HTMLImageElement>('#icone-loading');

const botaoBaixarRifa = document.querySelector<HTMLAnchorElement>('#botao-baixar-rifa');

const botaoGerarRifa = document.querySelector<HTMLButtonElement>('#botao-gerar-rifa');
const botaoFecharModal = document.querySelector<HTMLButtonElement>('#botao-fechar-modal');

const containerModal = document.querySelector<HTMLDivElement>('#container-modal');
const containerProgresso = document.querySelector<HTMLDivElement>('#container-progresso');

const barraProgresso = document.querySelector<HTMLSpanElement>('#barra-progresso');
const textoProgresso = document.querySelector<HTMLSpanElement>('#progresso-text-acessibilidade');
const headerCardGerarRifa = document.querySelector<HTMLSpanElement>('#header-card-gerar-rifa');
const textoTotalPaginasFichas = document.querySelector<HTMLSpanElement>('#total-paginas-geradas');

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

/**
 * Incrementa o número de fichas
 */
const incrementarNumFichas = () => {
  const valorPrevio = parseInt(inputQuantidadeFichas.value, 10);
  inputQuantidadeFichas.value = valorPrevio < 999 ? (valorPrevio + 1) + '' : '999';

  atualizarQuantidadePaginas();
};

/**
 * Decrementa o numero de fichas
 */
const decrementarNumFichas = () => {
  const valorPrevio = parseInt(inputQuantidadeFichas.value, 10);
  inputQuantidadeFichas.value = valorPrevio > 1 ? (valorPrevio - 1) + '' : '1';

  atualizarQuantidadePaginas();
};

/**
 * Valida o input de quantidade de fichas
 */
const validarInputQuantidadeFicha = () => {
  if (inputQuantidadeFichas.value === '') {
    return;
  }

  const valor = parseInt(inputQuantidadeFichas.value, 10);
  
  if(valor < 1) {
    inputQuantidadeFichas.value = '1';  
  } else if (valor > 999) {
    inputQuantidadeFichas.value = '999';
  } else {
    inputQuantidadeFichas.value = valor + '';
  }

  atualizarQuantidadePaginas();
};

/**
 * Atualizar quantidade de páginas
 */
const atualizarQuantidadePaginas = () => {
  const valor = parseInt(inputQuantidadeFichas.value, 10);
  textoTotalPaginasFichas.innerText = Math.ceil(valor / 5) + '';
};

// Ativação do evento
inputQuantidadeFichas.onkeyup = () => {
  validarInputQuantidadeFicha();

  if(inputQuantidadeFichas.value !== '') {
    atualizarQuantidadePaginas();
  }
};

// Botao incrementar e decrementar
botaoIncrementarFichas.onclick = incrementarNumFichas;
botaoDecrementarFichas.onclick = decrementarNumFichas;

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