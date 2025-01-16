window.onload = function() {
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

function imprimirPedido() {
    // Coleta os dados do formulário
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const produtos = document.getElementById('produtos').value;
    const pagamento = document.getElementById('pagamento').value;
    const endereco = document.getElementById('endereco').value;
    const valor = document.getElementById('valor').value;

    // Formata o texto para impressão
    const textoImpressao = 
        "PEDIDO\n" +
        "=================\n" +
        `Cliente: ${nome}\n` +
        `Telefone: ${telefone}\n` +
        `\nProdutos:\n${produtos}\n` +
        `\nForma de Pagamento: ${pagamento}\n` +
        `Endereço: ${endereco}\n` +
        `Valor Total: ${valor}\n` +
        "=================\n\n";

    // Integração com RawBT
    if (typeof rawbt !== 'undefined') {
        rawbt.print(textoImpressao);
    } else {
        alert('RawBT não está disponível. Verifique se o aplicativo está instalado.');
        console.log(textoImpressao); // Para teste
    }
}