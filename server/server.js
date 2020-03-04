const net = require('net');
const server = net.createServer();


// front end 3000, back end 3001 or something else
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server up on port ${PORT}`));

const socketPool = {};

server.on('connection', socket => {
  const id = `Socket-${Math.random()}`;
  socketPool[id] = socket;

  socket.on('data', buffer => doSomething(buffer));

  socket.on('error', e => console.error('SOCKET ERROR', e));
  socket.on('end', () => delete socketPool[id]);
})

server.on('error', e => console.error('SERVER ERRROR!', e));


function doSomething(buffer) {
  const message = JSON.parse(buffer.toString().trim());
  broadcast(message);

  const timeCheck = JSON.parse(buffer.toString().trim());
  console.log(timeCheck)
}

function broadcast(message) {
  const payload = JSON.stringify(message);
  for (const socket in socketPool) {
    // send a message to every socket that's listening
    socketPool[socket].write(payload);
  }
}
