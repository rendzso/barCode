function csvParser(){

    var winston = require('winston');

    const logger = winston.createLogger({
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'waste.log' })
        ]
    });

    var fs = require('fs');
    var csv = require('fast-csv')
    var stream = fs.createReadStream("dataset.csv");
    var JsBarcode = require('jsbarcode');
    var {createCanvas} = require("canvas");


    csv
        .fromStream(stream, {headers : true})
        .on("data", function(data){
            if(data.Error === "True")
            {
                logger.info(data);
                return;
            }
            if(data.Error === "False") {
                var canvas = createCanvas(data.Width, data.Height);
                JsBarcode(canvas, data.ID);

                var outputSteam = canvas.createPNGStream();
                var out = fs.createWriteStream(__dirname + '/img/' + data.ID + '.png')
                outputSteam.pipe(out)
                out.on('finish', () => console.log('The PNG file was created.'))
                return;
            }
        })
        .on("end", function(){
            console.log("done");
        });
}

module.exports = csvParser;