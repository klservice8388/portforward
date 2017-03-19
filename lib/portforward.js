var net = require("net"),
    process = require('process'),
    fs = require("fs"),
    redis = require("redis")

function main() {

    var client = redis.createClient()
    client.on('error', console.error)

    var cli = require('cli')
    cli.parse({
        'target-host': ['s', 'target host address', 'string'],
        "target-port": ['b', 'target port', 'number'],
        host: ['h', '', 'string'],
        port: ['p', '', 'number']
    })


    cli.main(function(args, options) {
        console.log("Process id " + process.pid)

        if (!options.host) {
            console.log("Missing host")
            process.exit()
        }

        if (!options.port) {
            console.log("Missing port")
            process.exit()
        }

        var server = net.createServer(function(socket) {

            client.incrby('accepts', 1);

            socket.on('data', function(data) {
                var len = data.length
                client.incrby('outs', len)
            })
            socket.on('error', function(err) {
                console.error(err)
                target.end()
            })
            socket.on('close', function() {
                target.end()
            })

            var target = new net.Socket()
            socket.pipe(target).pipe(socket)
            target.connect({
                host: options['target-host'],
                port: parseInt(options['target-port'])
            }, function() {

                target.on('close', function(hasError) {
                    socket.end()
                })

                target.on('data', function(data) {
                    var len     = data.length
                    client.incrby('gets', len)
                })

                target.on('end', function() {
                    socket.end()
                })

                target.on('error', function(err) {
                    console.error(err)
                    socket.end()
                })
            })
        })


        server.listen({
            host: options.host,
            port: options.port
            },
            function() {
                address = server.address();
                // console.log("opened server on %j", address);
        })

        console.log("Listen %s:%d", options.host, options.port)
        console.log("Proxy to %s:%d", options['target-host'], options['target-port'])
    })
}

module.exports = main