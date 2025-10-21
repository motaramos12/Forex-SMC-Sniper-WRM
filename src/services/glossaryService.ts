
import type { GlossaryTerm } from '../types';

const glossaryData: Omit<GlossaryTerm, 'id'>[] = [
    {
        term: 'Modelo de Entrada Avançado (Framework ICT)',
        category: 'Modelos de Entrada',
        definition: 'Um framework de alta precisão que combina múltiplos conceitos SMC em uma sequência lógica para identificar entradas cirúrgicas com alto potencial de risco-retorno. Este modelo é a base do sistema de varredura.',
        example: {
            description: 'A execução deste modelo de alta convicção segue uma sequência precisa de eventos: \n1. **Contexto HTF:** O preço atinge um Ponto de Interesse de Timeframe Superior (HTF POI), como um Order Block ou FVG diário. \n2. **Captura de Liquidez:** Ocorre uma varredura de liquidez (Liquidity Sweep) abaixo de um fundo (SSL) ou acima de um topo (BSL) próximo ao HTF POI. \n3. **Mudança de Estrutura (MSS):** Uma forte mudança na estrutura do mercado (MSS) ocorre com Deslocamento (Displacement), quebrando um ponto de estrutura recente e sinalizando uma mudança de intenção. \n4. **Inducement (IDM):** Frequentemente, a liquidez interna (Inducement) é capturada antes do preço atingir o POI final, limpando o caminho. \n5. **Refinamento da Entrada (FVG + OTE):** O movimento de deslocamento deixa para trás um Fair Value Gap (FVG) ou Order Block (OB). A entrada é planejada em um reteste desta zona, idealmente dentro da "Optimal Trade Entry" (OTE), que fica na zona de Desconto (abaixo de 50% de Fibonacci) para compras, ou Premium (acima de 50%) para vendas. \n6. **Gestão de Risco:** O Stop Loss é posicionado abaixo do swing low (para compras) ou acima do swing high (para vendas) que realizou a captura de liquidez. O alvo é, no mínimo, uma relação de 1:3 Risco/Retorno.',
        }
    },
    {
        term: 'Modelo de Entrada Básico (Sweep + MSS + FVG)',
        category: 'Modelos de Entrada',
        definition: 'Um padrão de reversão fundamental e eficaz. Este modelo foca em três eventos principais: uma captura de liquidez, uma subsequente mudança na estrutura do mercado e uma entrada em uma ineficiência criada por esse movimento.',
        example: {
            description: '1. **Captura de Liquidez (SSL):** O preço primeiro varre a liquidez abaixo de um fundo recente (Sell-Side Liquidity). \n2. **Mudança de Estrutura (MSS):** Imediatamente após a captura, um movimento forte para cima quebra a estrutura de mercado anterior (MSS), mostrando a intenção dos compradores. \n3. **Entrada no FVG:** Este movimento agressivo deixa um Fair Value Gap (+FVG). A entrada de compra de alta probabilidade é executada quando o preço retorna para testar esta zona de FVG. O Stop Loss fica posicionado abaixo do fundo do swing que capturou a liquidez.',
        }
    },
    {
        term: 'Estrutura de Mercado',
        abbreviation: 'MS',
        category: 'Estrutura e Tendência',
        definition: 'O conceito mais fundamental. Uma tendência de alta é definida por topos mais altos (HH - Higher Highs) e fundos mais altos (HL - Higher Lows). Uma tendência de baixa é definida por fundos mais baixos (LL - Lower Lows) e topos mais baixos (LH - Lower Highs). Entender a estrutura atual é o primeiro passo de qualquer análise.',
        example: {
            description: 'O gráfico mostra uma série de HH e HL, indicando uma tendência de alta clara. A estratégia seria procurar por compras nos recuos (HL), esperando que a estrutura continue.',
        }
    },
    {
        term: 'Break of Structure',
        abbreviation: 'BoS',
        category: 'Estrutura e Tendência',
        definition: 'Um Break of Structure ocorre quando o preço quebra um ponto de estrutura anterior (um topo ou fundo), confirmando a continuação da tendência atual. Em uma tendência de alta, um BoS é um novo topo mais alto. Em uma tendência de baixa, é um novo fundo mais baixo.',
        example: {
            description: 'Após formar um topo, o preço recua e depois sobe novamente, quebrando o topo anterior com um movimento forte. Este BoS confirma que a tendência de alta provavelmente continuará, e os traders podem procurar por entradas de compra no próximo recuo.',
        }
    },
    {
        term: 'Market Structure Shift / Change of Character',
        abbreviation: 'MSS / CHoCH',
        category: 'Estrutura e Tendência',
        definition: 'O primeiro sinal de uma potencial reversão de tendência. Um CHoCH (Change of Character) é uma quebra de uma estrutura de recuo menor. Um MSS (Market Structure Shift) é uma quebra mais significativa de um ponto de swing importante, oferecendo maior convicção, especialmente quando impulsionado por um movimento de Deslocamento.',
        example: {
            description: 'O preço estava em uma tendência de alta, mas falha em fazer um novo topo e, em vez disso, quebra o último fundo mais alto. Este MSS/CHoCH sinaliza que a força vendedora está entrando no mercado, e uma reversão para baixa pode estar começando.',
        }
    },
    {
        term: 'Liquidez (Buy-Side & Sell-Side)',
        abbreviation: 'BSL / SSL',
        category: 'Conceitos de Liquidez',
        definition: 'Liquidez representa áreas no gráfico onde há uma alta concentração de ordens, principalmente stop-losses. Essas "piscinas de liquidez" existem acima de topos (Buy-Side Liquidity - BSL) e abaixo de fundos (Sell-Side Liquidity - SSL). O mercado é atraído para essas zonas para capturar as ordens.',
        example: {
            description: 'O gráfico mostra topos duplos (Equal Highs), uma forma óbvia de liquidez do lado da compra (BSL). O preço é magneticamente atraído para cima para "capturar" essa liquidez antes de potencialmente reverter.',
        }
    },
     {
        term: 'Liquidity Grab',
        abbreviation: 'Sweep',
        category: 'Conceitos de Liquidez',
        definition: 'Uma Captura de Liquidez (ou "sweep") é um movimento de preço projetado para acionar ordens de stop-loss que estão agrupadas acima de um topo recente ou abaixo de um fundo recente. Após "varrer" essa liquidez, o preço frequentemente reverte de forma agressiva na direção oposta.',
        example: {
            description: 'Há um topo claro no gráfico onde muitos traders de varejo colocaram seus stop-losses. O preço sobe rapidamente apenas para passar por esse topo, acionando os stops, e imediatamente reverte para baixo. Traders de SMC antecipam esse movimento para entrar em uma posição de venda.',
        }
    },
    {
        term: 'Inducement',
        abbreviation: 'IDM',
        category: 'Conceitos de Liquidez',
        definition: 'Inducement é um "falso" movimento que atrai traders para uma posição antes que o movimento real ocorra. Tipicamente, é um pequeno recuo ou um topo/fundo menor que é criado para ser varrido (capturando liquidez) antes que o preço atinja a zona de interesse real (como um OB ou FVG).',
        example: {
            description: 'Em uma tendência de alta, antes de atingir um Order Block, o preço cria um pequeno fundo de recuo. Muitos compram aqui. O preço então cai, varre a liquidez abaixo desse fundo (o inducement) e só então atinge o Order Block para iniciar o verdadeiro movimento de alta.',
        }
    },
     {
        term: 'Ponto de Interesse',
        abbreviation: 'POI',
        category: 'Zonas de Interesse',
        definition: 'Um termo genérico para uma área específica no gráfico onde um trader de SMC espera uma reação do preço. Um POI pode ser um Order Block, um Fair Value Gap, etc. A análise de alta probabilidade começa identificando um POI em um Timeframe Superior (HTF POI) para definir o contexto.',
        example: {
            description: 'Em um timeframe maior (H4), um grande Order Block de alta é identificado. Este se torna o HTF POI. O trader então aguarda o preço chegar a esta zona e procura por confirmações de entrada (como um MSS) em um timeframe menor (M5).',
        }
    },
    {
        term: 'Order Block',
        abbreviation: 'OB',
        category: 'Zonas de Interesse',
        definition: 'Um Order Block é a última vela de alta antes de um movimento significativo de baixa (OB de baixa), ou a última vela de baixa antes de um movimento significativo de alta (OB de alta). Grandes instituições usam essas áreas para colocar ordens, tornando-as zonas de alto interesse onde o preço pode retornar.',
        example: {
            description: 'Antes de uma grande queda de preço, a última vela de alta é identificada como um Order Block de baixa. Os traders esperam que o preço retorne a esta zona no futuro para mitigar as ordens e, então, procuram por uma oportunidade de venda perto do OB.',
        }
    },
    {
        term: 'Fair Value Gap',
        abbreviation: 'FVG',
        category: 'Zonas de Interesse',
        definition: 'Um Fair Value Gap, ou Imbalance, é uma ineficiência no mercado criada por um movimento de preço rápido e agressivo. É identificado por uma formação de três velas onde há um espaço entre a máxima da primeira vela e a mínima da terceira (ou vice-versa). O mercado tende a retornar para preencher ("rebalancear") essa lacuna.',
        example: {
            description: 'O preço sobe agressivamente, deixando um FVG. O mercado tende a ser eficiente, então é provável que o preço retorne para "preencher" essa lacuna. Traders podem usar a área do FVG como um alvo ou como uma zona potencial para entrar em uma negociação na direção do movimento original.',
        }
    },
    {
        term: 'Optimal Trade Entry (OTE) / Zonas Premium e Desconto',
        category: 'Conceitos de Execução',
        definition: 'Usando a ferramenta de Fibonacci em um movimento de preço (swing), a área acima de 50% é "Premium" (cara, boa para vender) e abaixo de 50% é "Discount" (barata, boa para comprar). O OTE (Optimal Trade Entry) é o conceito de buscar entradas na zona ideal, tipicamente entre os níveis de 62% e 79% de retração, para maximizar o risco-retorno.',
        example: {
            description: 'Após um impulso de alta, a Fibonacci é traçada do fundo ao topo. O preço recua para a zona de Desconto, especificamente para a área de OTE (caixa laranja), onde um POI (como um FVG ou OB) é encontrado. Esta é uma área de alta probabilidade para uma entrada de compra.',
        }
    },
    {
        term: 'Deslocamento',
        abbreviation: 'Displacement',
        category: 'Conceitos de Execução',
        definition: 'Um movimento de preço forte e enérgico que quebra a estrutura do mercado. É caracterizado por velas grandes e de corpo cheio que frequentemente deixam para trás ineficiências como Fair Value Gaps. O deslocamento indica uma forte intenção institucional e é um componente chave para confirmar um MSS.',
        example: {
            description: 'Após capturar liquidez abaixo de um fundo, o preço se move para cima com várias velas de alta grandes e consecutivas, quebrando a estrutura anterior (MSS). Este movimento de deslocamento confirma a força dos compradores e valida o FVG criado.',
        }
    }
];

export const getGlossaryTerms = (): Promise<GlossaryTerm[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const fullData = glossaryData.map((term, index) => ({
                ...term,
                id: `glossary-term-${index}-${Date.now()}`
            }));
            resolve(fullData);
        }, 500); // Simulate network delay
    });
};
