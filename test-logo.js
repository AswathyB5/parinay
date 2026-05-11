import http from 'http';

http.get('http://localhost:5000/uploads/logo-img.png', (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers['content-type']);
    res.on('data', (chunk) => {
        console.log('Received chunk of size:', chunk.length);
    });
    res.on('end', () => {
        console.log('Request finished');
        process.exit(0);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
