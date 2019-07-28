// @ts-ignore
import SVGtoPDF from 'svg-to-pdfkit';
import PDFDocument from 'pdfkit';
import stream from 'blob-stream';
import * as _ from 'lodash';
import './libs/dom-token-list.ext';

// Importa stylesheets
import './assets/style.css';
import './assets/styles/salesforce-lightning-design-system.min.css';

/**
 * ------------- Types -------------
 */
type PDFDocumentType = typeof PDFDocument;

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

const TEXT_DEFAULT: Map<string, string> = new Map([
    ['var_header_linha1', '%VAR_HEADER_LINHA1%'],
    ['var_header_linha2', '%VAR_HEADER_LINHA2%'],
    ['var_premio_linha1', '%VAR_PREMIO_LINHA1%'],
    ['var_premio_linha2', '%VAR_PREMIO_LINHA2%'],
    ['var_data_realizacao', '%VAR_DATA_REALIZACAO%'],
    ['var_local_realizacao', '%VAR_LOCAL_REALIZACAO%'],
    ['var_observacoes', '%VAR_OBSERVACOES%']
]);

const NUM_FICHAS_PAGINA = 5;

/**
 * Templates
 */
const rifaTemplate = document.querySelector<SVGElement>('#rifa-template');
const rifaTemplatePDF = rifaTemplate.cloneNode(true) as SVGElement;
const numeroRifaTemplatePDF: [SVGTextElement, SVGTextElement] = [
    rifaTemplatePDF.querySelector<SVGTextElement>('#var_num1'),
    rifaTemplatePDF.querySelector<SVGTextElement>('#var_num2')
];

type callbackConverteIDParaEntradaMap = (id_dom: string) => [string, SVGTextElement];

/**
 * Converte string ID para entrada com query do template
 *
 * @param domElement
 */
const obtemEspacoVariaveisTemplateById = (domElement: Element): callbackConverteIDParaEntradaMap => {
    return (id_dom: string) => {
        const domEntradaMap = domElement.querySelector<SVGTextElement>(`#${id_dom}`);
        return [ id_dom, domEntradaMap ];
    }
};

/**
 * ID das variaveis do template
 */
const idVariaveisTemplate = [
    'var_header_linha1',
    'var_header_linha2',
    'var_premio_linha1',
    'var_premio_linha2',
    'var_data_realizacao',
    'var_local_realizacao',
    'var_observacoes'
];

/**
 * Variaveis template rifa
 */
const entriesVariaveisTemplate = idVariaveisTemplate
    .map<[string, SVGTextElement]>(obtemEspacoVariaveisTemplateById(rifaTemplate));
const entriesVariaveisTemplatePDF = idVariaveisTemplate
    .map<[string, SVGTextElement]>(obtemEspacoVariaveisTemplateById(rifaTemplatePDF));
const variaveisTemplate = new Map(entriesVariaveisTemplate);
const variaveisTemplatePDF = new Map(entriesVariaveisTemplatePDF);

/**
 * ----------  Elementos DOM ----------
 */
const iconeLoading = document.querySelector<HTMLImageElement>('#icone-loading');

/**
 * Obtem inputs do template pelo ID
 *
 * @param idInput
 */
const obtemInputsTemplateByID = (idInput: string): [ string, HTMLInputElement ] => {
    return [
        idInput,
        document.querySelector<HTMLInputElement>(`#input_${idInput}`)
    ];
};

const idInputsTemplate = [
    'var_header_linha1',
    'var_header_linha2',
    'var_premio_linha1',
    'var_premio_linha2',
    'var_data_realizacao',
    'var_local_realizacao',
    'var_observacoes'
];
const entriesInputTemplate = idInputsTemplate
    .map<[ string, HTMLInputElement ]>(obtemInputsTemplateByID);
const inputsTemplate = new Map(entriesInputTemplate);

const inputQuantidadeFichas = document.querySelector<HTMLInputElement>('#input-quantidade-fichas');

const botaoIncrementarFichas = document.querySelector<HTMLInputElement>('#botao-incrementar-fichas');
const botaoDecrementarFichas = document.querySelector<HTMLInputElement>('#botao-decrementar-fichas');

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
 * Stream de documento
 */
let stream_documento: stream.IBlobStream;
let documento: PDFDocumentType;

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

    if (valor < 1) {
        inputQuantidadeFichas.value = '1';
    } else if (valor > 999) {
        inputQuantidadeFichas.value = '999';
    } else {
        inputQuantidadeFichas.value = valor + '';
    }

    atualizarQuantidadePaginas();
};

/**
 * Obtem a quantidade de fichas
 */
const obtemQuantidadeFichas = () => {
    return parseInt(inputQuantidadeFichas.value, 10);
};

/**
 * Calcula o número de páginas de acordo com a quantidade de fichas
 */
const obtemQuantidadePaginas = () => {
    return Math.ceil(obtemQuantidadeFichas() / 5);
};

/**
 * Atualizar quantidade de páginas
 */
const atualizarQuantidadePaginas = () => {
    textoTotalPaginasFichas.innerText = obtemQuantidadePaginas() + '';
};

/**
 * Atualiza progresso
 *
 * @param _progresso
 */
const atualizarBarraProgresso = (_progresso: number) => {
    let progresso: number;
    if (_progresso > 100) {
        progresso = 100;
    } else if (_progresso < 1) {
        progresso = 1;
    } else {
        progresso = _progresso;
    }

    barraProgresso.style.width = progresso + '%';
};

/**
 * Desabilita o input de quantidade de fichas
 */
const desabilitaInputQuantidadeFichas = () => {
    inputQuantidadeFichas.disabled = true;
};

/**
 * Habilitar o input de quantidade de fichas
 */
const habilitarInputQuantidadeFichas = () => {
    inputQuantidadeFichas.disabled = false;
};

/**
 * Desabilitar inputs de configuração
 */
const desabilitarInputsConfiguracao = () => {
    _.entries(inputsTemplate)
        .forEach(([, input]) => input.disabled = true);
};

/**
 * Desabilita todos os inputs da página
 */
const desabilitarTodosInputs = () => {
    desabilitaInputQuantidadeFichas();
    desabilitarInputsConfiguracao();
};

/**
 * Habilta todos os inṕuts de configuração
 */
const habilitarInputsConfiguracao = () => {
    _.entries(inputsTemplate)
        .forEach(([, input]) => input.disabled = false);
};

/**
 * Habilita todos os inputs da página
 */
const habilitarTodosInpupts = () => {
    habilitarInputQuantidadeFichas();
    habilitarInputsConfiguracao();
};

/**
 * Ativa botões de incremento e decremento para o sistema
 */
const ativarBotoesIncrementoDecremento = () => {
    botaoIncrementarFichas.onclick = incrementarNumFichas;
    botaoDecrementarFichas.onclick = decrementarNumFichas;
};

/**
 * Atualiza a quantidade de fichas
 */
const atualizarQuantidadeFichas = () => {
    validarInputQuantidadeFicha();

    if (inputQuantidadeFichas.value !== '') {
        atualizarQuantidadePaginas();
    }
};

/**
 * Ativa evento de modificação de input de quantidade de fichas
 */
const ativarEventoChangeQuantidadeFichas = () => {
    inputQuantidadeFichas.onkeyup = atualizarQuantidadeFichas;
};

/**
 * Ativa o botão para fechar o modal de rifa gerada
 */
const ativarBotaoFecharModal = () => {
    botaoFecharModal.onclick = fecharModalRifaGerada;
};

/**
 * Retorno do callback para atualizar texto template da rifa
 */
type callbackAtualizaTextoTemplateRifa = () => void;

/**
 * Atualizar o texto do template da rifa
 *
 * @param key_input
 * @param input
 */
const atualizarTextoTemplateRifa = (key_input: string, input: HTMLInputElement): callbackAtualizaTextoTemplateRifa => {
    return () => {
        const textoInput = input.value;
        variaveisTemplatePDF.get(key_input).textContent = textoInput;
        variaveisTemplate.get(key_input).textContent = textoInput === ''
            ? TEXT_DEFAULT.get(key_input)
            : textoInput;
    };
};

/**
 * Adiciona evento change input ao input
 *
 * @param key_input
 * @param input
 */
const adicionarEventoChangeInput = ([key_input, input]: [string, HTMLInputElement]) => {
    input.onkeyup = atualizarTextoTemplateRifa(key_input, input);
};

/**
 * Ativa o evento de change nos inputs de configuração
 */
const ativarEventoChangeInputsConfiguracao = () => {
    _.entries(inputsTemplate)
        .forEach(adicionarEventoChangeInput);
};

/**
 * Atualizar o botão de download
 */
const atualizarBotaoDownload = () => {
    botaoBaixarRifa.href = stream_documento.toBlobURL('application/pdf');
};

/**
 * Erro ao gerar Documento PDF
 *
 * @param err
 */
const erroAoGerarDocumento = (err: Error | null) => {
    console.error('[ERROR] {GeracaoDocumento} - Erro ao gerar documento!', err);

    // noinspection InfiniteLoopJS
    while (true) {
        alert('Não foi possível gerar seu documento. Recarregue a página e tente novamente');
    }
};

/**
 * Finaliza o gerar PDF
 */
const finalizaGerarPDF = () => {
    abrirModalRifaGerada();
    atualizarBotaoDownload();

    habilitarBotaoGerarRifa();
    habilitarTodosInpupts();
    finalizaBarraProgresso();
};

/**
 * Ativa os eventos de stream
 */
const iniciaStreamDocumento = () => {
    stream_documento = stream();
    documento.pipe(stream_documento);
    stream_documento.on('error', erroAoGerarDocumento);
    stream_documento.on('finish', finalizaGerarPDF);
};

/**
 * Obtem a quantidade de páginas da página informada
 *
 * @param num_pagina numero da pagina
 */
const rangeFichasPagina = (num_pagina: number): number[] => {
    const quantidade_fichas = obtemQuantidadeFichas();
    const numero_fichas_acessadas = (num_pagina * NUM_FICHAS_PAGINA);

    if (numero_fichas_acessadas >= quantidade_fichas) {
        return [];
    }

    const primeira_ficha_nivel_atual = numero_fichas_acessadas;
    const ultima_ficha_nivel_atual = numero_fichas_acessadas + NUM_FICHAS_PAGINA <= quantidade_fichas
        ? (numero_fichas_acessadas + NUM_FICHAS_PAGINA)
        : quantidade_fichas;

    return _.range(primeira_ficha_nivel_atual, ultima_ficha_nivel_atual);
};

/**
 * Obter titulo rifa
 */
const obterTituloRifa = (): string => {
    return inputsTemplate.get('var_header_linha1').value.length > 0
        ? inputsTemplate.get('var_header_linha1').value
        : 'Rifa';
};

/**
 * Cria um novo documento PDF
 */
const criaNovoDocumento = () => {
    documento = new PDFDocument({
        margins: {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20
        },
        // size: [ 2480, 3508 ],
        size: 'a4',
        layout: 'portrait',
        info: {
            Author: 'Jeferson Lima',
            Title: `Rifa gerada por RifaGen - ${obterTituloRifa()}`,
            Creator: 'RifaGen',
            Producer: 'RifaGen.com',
            CreationDate: new Date(),
            ModDate: new Date(),
            Keywords: 'rifa, fichas, sorteio'
        },
        autoFirstPage: false
    });
    documento.fontSize(10);

    iniciaStreamDocumento();
};

/**
 *
 * @param numero_rifa
 */
type callbackModifaNumeroRifaType = (numeroEL: SVGTextElement) => void;
const modificaNumeroRifa = (numero_rifa: number): callbackModifaNumeroRifaType => {
    return numeroEl => {
        numeroEl.textContent = _.padStart(numero_rifa + '', 3, '0');
    };
};

/**
 * Adiciona a ficha a página
 */
const adicionaFichaPagina = (num_ficha: number, idx: number) => {
    numeroRifaTemplatePDF
        .forEach(modificaNumeroRifa(num_ficha + 1));
    SVGtoPDF(documento, rifaTemplatePDF, 20, (idx * 138) - 300, {
        width: 555
    });
};

/**
 * Cadastra página
 *
 * @param quantidade_paginas
 */
const cadastraPagina = (quantidade_paginas: number) => {
    const porcentagem_progresso = Math.ceil(100 / quantidade_paginas);

    return (num_pagina: number) => {
        atualizarBarraProgresso(porcentagem_progresso * num_pagina);

        documento
            .addPage()
            .text(`Página ${num_pagina + 1}/${quantidade_paginas}`);

        rangeFichasPagina(num_pagina)
            .forEach(adicionaFichaPagina);
    };
};

/**
 * Finalizar documento
 */
const finalizarDocumento = () => {
    documento.end();
};

/**
 * Gera documento rifa
 */
const gerarDocumentoRifa = () => {
    const quantidade_paginas = obtemQuantidadePaginas();

    criaNovoDocumento();
    _.range(quantidade_paginas)
        .forEach(cadastraPagina(quantidade_paginas));
    finalizarDocumento();
};

/**
 * Gera uma nova rifa
 */
const geraNovaRifa = () => {
    console.log('[INFO] {BotaoGerarRifa} - Iniciando procedimento para gerar rifa');

    iniciarBarraProgesso();
    desabilitarBotaoGerarRifa();
    desabilitarTodosInputs();
    gerarDocumentoRifa();

    console.log('[INFO] {BotaoGerarRifa} - Finalizado procedimento para gerar rifa');
};

/**
 * Ativar botão para gerar rifa
 */
const ativarBotaoGerarRifa = () => {
    botaoGerarRifa.onclick = geraNovaRifa;
};

/**
 * Limpa o conteudo da variavel presente no template pdf
 *
 * @param elDom
 */
const limpaVariavelTemplatePDF = ([ , elDom]: [string, SVGTextElement]): void => {
    elDom.textContent = '';
};

/**
 * Limpa as variaveis do template PDF
 */
const limparVariaveisTemplatePDF = (): void => {
    _.entries(variaveisTemplatePDF)
        .forEach(limpaVariavelTemplatePDF);
};

/**
 * ------------ Main ------------
 */
ativarBotoesIncrementoDecremento();
ativarEventoChangeQuantidadeFichas();
ativarBotaoFecharModal();
ativarEventoChangeInputsConfiguracao();
ativarBotaoGerarRifa();
limparVariaveisTemplatePDF();
