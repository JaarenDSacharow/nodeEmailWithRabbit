const amqp = require('amqplib/callback_api');
const fs = require('fs');
const ejs = require('ejs');
const inLineCss = require('inline-css');


//connect to rabbit server

amqp.connect('amqp://un:pw@address:5672', (err,conn) => {
//open a channel
    console.log("created connection!");
    conn.createChannel((err,ch)=>{

        const ex = 'notify.exchange';

        const compiled = ejs.compile(fs.readFileSync(__dirname + '/index.ejs', 'utf8'));
        const obj =  { title : 'Notifcation', name : 'Jaaren' };
        let html = compiled(obj);
        //html = html.replace(/"/g, '\\"');
        inLineCss(html, {url: ' '}).then((html)=>{
            html = new Buffer(html).toString('base64');
            var msg = '{"type":"email","from":"alertmanager@entic.com","to":["jsacharow@entic.com"],"subject":"Entic Info  - Your Custom Report","body":"'+html+'","attachments":[]}';
            console.log(msg);
            ch.assertExchange('notify.exchange', 'direct', {durable: true});
            ch.publish('notify.exchange', 'email.q.in', new Buffer(msg));
        })


        var msg2 = '{"type": "sms", "to": "+19548018589", "from": "+19548664830", "body": "This is a test text message","attachments": []}'

        console.log(msg2);

        ch.publish('notify.exchange', 'sms.q.in', new Buffer(msg2));

/*      
        ch.assertQueue(q, {durable:false});
        ch.sendToQueue(q, new Buffer(
            '{"type":"email","from":"sender_email_address","ßto":["recipient_email_address1","recipient_email_address2"],"subject":"Email Subject","body":"email body text","attachments":["http://somedomain.com/file_path1", "http://somedomain.com/file_path2"]}'
        )); */
        console.log(" [x]  Sent Test JSON!");
    });
    setTimeout(() => { conn.close(); process.exit(0) }, 500);
});



