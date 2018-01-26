#!/usr/bin/env node

var del  = require('del');
var fs   = require('fs');
var path = require('path');

// Diretório para excluir
var diretorio = 'platforms/android/assets/www/bower_components/';

function verificarDiretorio(diretorio, expressaoRegular, callback){

    if (!fs.existsSync(diretorio)){
        console.log("Diretório não encontrado: ", diretorio);
        return;
    }

    // Captura os arquivos
    var arquivos = fs.readdirSync(diretorio);

    // Percorre os arquivos
    for (var i = 0; i < arquivos.length; i++){

        var caminhoArquivo = path.join(diretorio, arquivos[i]);
        var verificador = fs.lstatSync(caminhoArquivo);

        if (verificador.isDirectory()){
            // Recursividade
            verificarDiretorio(caminhoArquivo, expressaoRegular, callback);
        }

        // Se não encontrou as expressão, retorna o arquivo
        else if (!expressaoRegular.test(caminhoArquivo)){
            callback(caminhoArquivo);
        }
    };
};

// Se diretório existe
if(fs.existsSync(diretorio)){

    // Procura dentro do diretório arquivos desnecessários
    verificarDiretorio(diretorio, /(\.min.js|\.min.css|firebase\.js|angular\-route\.min\.js|angular-locale_pt-br\.js|\.css)$/, function(caminhoArquivo){

        // Exclui o arquivo
        fs.unlink(caminhoArquivo);
    });

}else{
	console.log('Diretório não encontrado');
}