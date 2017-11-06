const amqp = require('amqplib/callback_api');
const fs = require('fs');

const generateTemplate = (msg) => {
    return new Promise((resolve, reject) => {
        try {
            let parsed = JSON.parse(msg.content.toString());
            //let data = fs.readFileSync('./templates/html.pug', 'utf8');
            let data = `<p>Hello,${parsed.to} </p>`;
            data += `<p>This is a message from ${parsed.from}</p>`
            //
            //console.log(parsed.from);
            //parsed.from = "molly2@mollybeans.com";
            //parsed.to = "chuck@chuckharris.com";
            resolve(data);
        } 
        catch(err) {
            reject(err);
        }
    });
}

const send = (msg, conn)=> {
    conn.createChannel((err, ch)=>{
        let q = 'passItOn';
        ch.assertQueue(q, {durable: false});
        console.log("sending message to %s.", q)
        ch.sendToQueue(q, new Buffer(msg));
        console.log(" [x]  Sent %s", msg);
    })
} 

amqp.connect('amqp://localhost', (err, conn)=>{
    conn.createChannel((err, ch)=>{
        //let q = 'hello';
        //ch.assertQueue(q, {durable: false});

        let ex = 'testexchange';
        ch.assertExchange(ex, 'direct', {durable: false});

        ch.assertQueue('', {exclusive: true}, function(err, q) {
            console.log(' [*] Waiting for message. To exit press CTRL+C');
            ch.bindQueue(q.queue, ex, 'hello');
            ch.consume(q.queue, function(msg) {
                  console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                  generateTemplate(msg)
                  .then((data) => send(data, conn))
                  .catch((err) => console.log(err));
                }, {noAck: true});
              });
         });

       // console.log(" [*] Waiting for messages in %s.  TO Exit, hit CTRL-C", q);
/*         ch.consume(q, (msg)=>{
            console.log(" [x] Received %s", msg.content.toString());
            generateTemplate(msg)
            .then((data) => send(data, conn))
            .catch((err) => console.log(err));
        }, {noAck: true});
    }); */
});