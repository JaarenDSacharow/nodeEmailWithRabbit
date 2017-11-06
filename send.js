const amqp = require('amqplib/callback_api');

//connect to rabbit server

amqp.connect('amqp://localhost', (err,conn) => {
//open a channel
    conn.createChannel((err,ch)=>{
        var q = 'hello';

        var ex = 'testexchange';

       // var msg = '{"type":"email","from":"sender_email_address","to":["recipient_email_address1","recipient_email_address2"],"subject":"Email Subject","body":"email body text","attachments":["http://somedomain.com/file_path1", "http://somedomain.com/file_path2"]}'
        
        var msg = `{
            "type": “email”,
            "to": "jsacharow@entic.com",
            "from": "alertmanager@entic.com",
            "body": “This is a test message“,
            "attachments": [
              "https://s3-us-west-2.amazonaws.com/static-entic-com/portal2/img/bg.JPG",
              "https://s3-us-west-2.amazonaws.com/static-entic-com/portal2/img/ecp.jpg"
            ]
          }`
        ch.assertExchange(ex, 'direct', {durable: false});

        ch.publish(ex, 'hello', new Buffer(msg));

/* 
        ch.assertQueue(q, {durable:false});
        ch.sendToQueue(q, new Buffer(
            '{"type":"email","from":"sender_email_address","to":["recipient_email_address1","recipient_email_address2"],"subject":"Email Subject","body":"email body text","attachments":["http://somedomain.com/file_path1", "http://somedomain.com/file_path2"]}'
        )); */
        console.log(" [x]  Sent Test JSON!");
    });
    setTimeout(() => { conn.close(); process.exit(0) }, 500);
});



