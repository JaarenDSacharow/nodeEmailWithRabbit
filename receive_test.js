const amqp = require('amqp');


const connection = amqp.createConnection({
    host: '172.31.60.31',
    login: 'ken',
    password: 'changeit',
    port: 5672,
    authMechanism: 'AMQPLAIN',
    noDelay: true,
    ssl: { enabled : false
    }
});


connection.on( 'ready', ()=>{
    console.log('connected, binding to queue');
    //connection.exchange('notify.exchange', (queue) => {

    //})
})

connection.on( 'error', (err)=>{
    console.log(err);
})
