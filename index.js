var app = require('./app');

function App(req,res) {
    if (!req.url) {
        req.url = '/';
        req.path = '/';
    }
    return app(req,res);
}

var sheetdjo  = App;

module.exports = {
    sheetdjo
};
//gcloud functions deploy sheetdjo --trigger-http --runtime=node10 --memory=1024mb