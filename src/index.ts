import http from 'node:http';
import 'dotenv/config';

const PORT = process.env.PORT as string;

const server = http.createServer((req, res) => {
  if (req.url === 'api/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write('Hi there, This is a Vanilla Node.js API');
    res.end(
      JSON.stringify({
        data: 'Hello World!',
      })
    );
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

function sayMyName(name: string): void {
  if (name === 'Heisenberg') {
    console.log("You're right 👍");
  } else {
    console.log("You're wrong 👎");
  }
}

sayMyName('Heisenberg');
