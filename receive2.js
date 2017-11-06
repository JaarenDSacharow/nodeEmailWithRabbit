const amqp = require('amqplib/callback_api');


amqp.connect('amqp://localhost', (err, conn)=>{
    conn.createChannel((err, ch)=>{
        let q = 'passItOn';
        ch.assertQueue(q, {durable: false});
        console.log(" [*] Waiting for messages in %s.  TO Exit, hit CTRL-C", q);
        ch.consume(q, (msg)=>{
            console.log(" [x] Received %s", msg.content.toString());
        }, {noAck: true});
    });
});