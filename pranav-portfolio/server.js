const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // API Endpoints - Added separately
  if (pathname === '/api/contact' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      const formData = querystring.parse(body);
      const { name, email, message } = formData;
      console.log('New contact form submission:');
      console.log('- Name:', name);
      console.log('- Email:', email);
      console.log('- Message:', message);
      
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Thank you for your message! I\'ll get back to you soon via email.' 
      }));
    });
    return;
  }

  if (pathname === '/api/portfolio' && req.method === 'GET') {
    const portfolioData = {
      skills: [
        { name: 'C / C++', level: 90 },
        { name: 'Data Structures', level: 85 },
        { name: 'HTML & CSS', level: 80 },
        { name: 'JavaScript', level: 75 },
        { name: 'Node.js', level: 65 },
        { name: 'Databases', level: 60 }
      ],
      projects: [
        {
          title: 'Food Ordering System',
          description: 'Full-stack food delivery application with user authentication, payment integration, and real-time order tracking.',
          tech: ['React', 'Node.js', 'MongoDB'],
          image: 'images/food-ordering.png'
        },
        {
          title: 'NGO Donation Tracker',
          description: 'Transparent donation management system for NGOs with donor dashboard, campaign management, and automated reports.',
          tech: ['Express', 'PostgreSQL', 'Chart.js'],
          image: 'images/ngo-tracker.png'
        },
        {
          title: 'ESP32 Servo Control',
          description: 'IoT project controlling servo motors via ESP32 with web interface and real-time position feedback.',
          tech: ['ESP32', 'Arduino', 'WebSocket'],
          image: 'images/esp32-servo.png'
        }
      ],
      testimonials: [
        {
text: 'Pranav\'s DSA knowledge and problem-solving skills are impressive. Great team player!',
          author: 'Prof. Smith',
          role: 'Professor'
        },
        {
          text: 'Excellent web development skills. Delivered projects on time with clean code.',
          author: 'John Doe',
          role: 'Senior Developer'
        }
      ]
    };
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(portfolioData));
    return;
  }

  // Static files serving (original code)
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  let ext = path.extname(filePath);
  let contentType = 'text/html';
  if (ext === '.css') contentType = 'text/css';
  else if (ext === '.js') contentType = 'text/javascript';
  else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') contentType = 'image/' + ext.slice(1);
  else if (ext === '.ico') contentType = 'image/x-icon';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Try index.html for directories
      if (fs.existsSync(path.join(__dirname, 'public', pathname, 'index.html'))) {
        filePath = path.join(__dirname, 'public', pathname, 'index.html');
        fs.readFile(filePath, (err2, content2) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end("404 - File Not Found");
          } else {
            res.writeHead(200, { 'Content-Type': contentType + '; charset=utf-8' });
            res.end(content2);
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("404 - File Not Found");
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType + '; charset=utf-8' });
      res.end(content);
    }
  });
});

server.listen(3000, () => {
  console.log("Portfolio server with APIs running at http://localhost:3000");
  console.log("Test APIs:");
  console.log("  GET http://localhost:3000/api/portfolio");
  console.log("  POST http://localhost:3000/api/contact (form data)");
});
