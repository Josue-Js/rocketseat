import http from 'node:http'


const users = []

const server = http.createServer(async (req, res) => {
    const {method, url} = req

    const buffers = []

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        req.body = Buffer.concat(buffers).toString()
    } catch {
        req.body = null
    }


    if(method === 'GET' && url === '/users') {
        return res
        .setHeader('Content-type', 'application/json')
        .end(JSON.stringify(users))
    }

    if(method === 'POST' && url === '/users') {
        users.push(JSON.parse(body))
        return res.writeHead(201).end()
    }
    return res.writeHead(404).end()

    
})


server.listen(3000)