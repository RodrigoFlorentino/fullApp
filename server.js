var	app = require('./api/express')();
var schedule = require('node-schedule');
var auth = require('./api/auth.js');
var cloudant = require('./api/cloudant.js');
var logconversation = require('./api/logconversation.js');
var validateRequest = require('./api/validateRequest.js');
var chatbot = require('./api/bot.js');
var params = require('./api/parameters.js');
var textToSpeech = require('./api/text-to-speech.js');

var job = schedule.scheduleJob('*/30 * * * *', function(){
    console.log('Rodando Job Carga Log Treinamento..');
    cloudant.insertLogTreinamento(function() {});
});

app.post('/login', auth.login);
app.post('/api/validate', validateRequest.valida);

app.post('/api/watson', function (req, res) {
    processChatMessage(req, res);
});

app.post('/api/synthesize', (req, res, next) => {
    textToSpeech.converter(req, res , next);
});


app.get('/api/logconversation/treinamento', function(req, res) {
    cloudant.getLogTreinamento(req, res);
});

app.get('/api/logconversation', function (req, res) {
    logconversation.get(req, res);
});

app.get('/api/logconversation/usuarios', function(req, res) {
    cloudant.getUsuarios(req, res);
});

app.get('/api/logconversation/outros', function(req, res) {
    cloudant.getOutros(req, res);
});

app.get('/api/logconversation/entities', function(req, res) {
    logconversation.getEntidades(req, res);
});

app.post('/api/logconversation/entidade', function(req, res) {
    logconversation.treinaEntidade(req, res);
});

app.get('/api/logconversation/entidade/value/:entity', function(req, res) {
    logconversation.getEntidadeValue(req, res);
});

app.post('/api/logconversation/entidade/synonyms', function(req, res) {
    logconversation.criarSinonimo(req, res);
});

app.get('/api/logconversation/intencoes', function(req, res) {
    logconversation.getIntencoes(req, res);
});
app.post('/api/logconversation/intencao', function(req, res) {
    logconversation.treinaIntencao(req, res);
});

app.post('/api/logconversation/treinamento/status',function (req, res) {
    cloudant.atualizaStatusTreinamento(req, res);
});

app.get('/api/showSound', function (req, res) {
    params.showSound(req,res);
});

app.get('/api/showLog', function (req, res) {
    params.showLog(req,res);
});

function processChatMessage(req, res) {

    chatbot.sendMessage(req, function (err, data) {
        if (err) {
            console.log("Error in sending message: ", err);
            res.status(err.code || 500).json(err);
        }
        else {
            var context = data.context;
            res.status(200).json(data);
        }
    });

};

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});