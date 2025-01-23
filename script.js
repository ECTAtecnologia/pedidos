let numeroPedidoAtual = 0;

window.onload = function() {
    // Inicializa o número do pedido
    numeroPedidoAtual = parseInt(localStorage.getItem('ultimoNumeroPedido') || '0');
    atualizarNumeroPedido();

    // Máscara para telefone
    var telefoneInput = document.getElementById('telefone');
    VMasker(telefoneInput).maskPattern('(99) 99999-9999');

    // Máscara para valor em reais
    var valorInput = document.getElementById('valor');
    VMasker(valorInput).maskMoney({
        precision: 2,
        separator: ',',
        delimiter: '.',
        unit: 'R$ '
    });

    // Ajuste para garantir valor numérico correto ao imprimir
    valorInput.addEventListener('change', function(e) {
        let valor = e.target.value.replace('R$ ', '')
            .replace('.', '')
            .replace(',', '.');
        e.target.dataset.valor = valor;
    });
}

function atualizarNumeroPedido() {
    numeroPedidoAtual++;
    localStorage.setItem('ultimoNumeroPedido', numeroPedidoAtual.toString());
    document.getElementById('numeroPedido').textContent = `Pedido Nº ${numeroPedidoAtual}`;
}

function formatarDataHora() {
    const agora = new Date();
    return agora.toLocaleString('pt-BR');
}

function imprimirPedido() {
    // Coleta os dados do formulário
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const produtos = document.getElementById('produtos').value;
    const observacoes = document.getElementById('observacoes').value;
    const pagamento = document.getElementById('pagamento').value;
    const endereco = document.getElementById('endereco').value;
    const valor = document.getElementById('valor').value;
    const dataHora = formatarDataHora();

    // Formata o texto para impressão com comandos ESC/POS
    const textoImpressao = 
        "\x1B\x40" +          // Inicializa a impressora
        "\x1B\x61\x01" +      // Alinhamento centralizado
        "\x1B\x21\x30" +      // Fonte dupla altura e largura
        "PEDIDO Nº " + numeroPedidoAtual + "\n" +
        "\x1B\x21\x00" +      // Fonte normal
        "=================\n" +
        `Data/Hora: ${dataHora}\n` +
        `Cliente: ${nome}\n` +
        `Telefone: ${telefone}\n` +
        "\x1B\x61\x00" +      // Alinhamento à esquerda
        `\nPRODUTOS:\n${produtos}\n` +
        (observacoes ? `\nOBSERVAÇÕES:\n${observacoes}\n` : '') +
        `\nForma de Pagamento: ${pagamento}\n` +
        `Endereco: ${endereco}\n` +
        "\x1B\x61\x02" +      // Alinhamento à direita
        `Valor Total: ${valor}\n` +
        "\x1B\x61\x01" +      // Alinhamento centralizado
        "=================\n\n" +
        "\x1B\x64\x03";       // Avança 3 linhas

    try {
        if (typeof rawbt !== 'undefined') {
            // Tenta imprimir e mostra mensagem de sucesso/erro
            rawbt.print(textoImpressao, function(success) {
                if (success) {
                    // Limpa os campos após impressão bem-sucedida
                    document.getElementById('nome').value = '';
                    document.getElementById('telefone').value = '';
                    document.getElementById('produtos').value = '';
                    document.getElementById('observacoes').value = '';
                    document.getElementById('pagamento').value = '';
                    document.getElementById('endereco').value = '';
                    document.getElementById('valor').value = '';

                    // Atualiza o número do próximo pedido
                    atualizarNumeroPedido();

                    // Foca no primeiro campo para novo pedido
                    document.getElementById('nome').focus();

                    alert('Pedido enviado para impressão!');
                } else {
                    alert('Erro ao imprimir. Verifique se a impressora está conectada.');
                }
            });
        } else {
            alert('RawBT não está disponível.\n\nVerifique se:\n1. Você está usando o navegador do RawBT\n2. A impressora está conectada no aplicativo');
            console.log('Texto que seria impresso:', textoImpressao);
        }
    } catch (error) {
        alert('Erro ao tentar imprimir: ' + error.message);
        console.error(error);
    }
}
