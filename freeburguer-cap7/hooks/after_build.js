#!/usr/bin/env node

module.exports = function(ctx) {

    // Se certifica de ter a plataforma android
    if (ctx.opts.platforms.indexOf('android') < 0) {
        return;
    }

    // Inicializa as dependencias nodejs
    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path'),
        deferral = ctx.requireCordovaModule('q').defer();

    // Une o caminho root do projeto ao restante gerado pelo Cordova, para formar o caminho completo do Android
    var platformRoot = path.join(ctx.opts.projectRoot, 'platforms/android');

    // Une o caminho com o caminho do build do android
    var apkFileLocation = path.join(platformRoot, 'build/outputs/apk/android-debug.apk');

    // Verifica se ocorreu algum erro na operação
    fs.stat(apkFileLocation, function(err,stats){
        if (err){
            deferral.reject('Erro na operação');
        }else{
            console.log('O APK ' + apkFileLocation + ' tem ' + stats.size +' bytes de tamanho:' + ctx.opts);
            deferral.resolve();
        }
    });

    return deferral.promise;
};