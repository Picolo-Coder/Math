const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');

// Criando a aplicação Express
const app = express();
const port = 3000;

// Habilitar CORS para todas as origens
app.use(cors()); // Permite que qualquer origem faça requisição (CORS)

// Middleware para processar JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do multer para upload de imagem
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta de destino
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nome único para o arquivo
    }
});
const upload = multer({ storage: storage });

// Conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Altere para a sua senha
    database: 'math',
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro de conexão: ' + err.stack);
        return;
    }
    console.log('Conectado ao banco de dados');
});

// Função para verificar se os dados foram passados
const checkData = (titulo, definicao, res) => {
    if (!titulo || !definicao) {
        return res.status(400).json({ error: 'Faltando título ou definição' });
    }
    return null;
}

// Rota para inserir dados na tabela Geometria com upload de imagem
app.post('/api/geometria', upload.single('imagem'), (req, res) => {
    const { titulo, definicao } = req.body;
    const imagem = req.file ? req.file.filename : null; // Nome da imagem se houver

    // Verificar se os dados estão completos
    const validationError = checkData(titulo, definicao, res);
    if (validationError) return validationError;

    const query = 'INSERT INTO Geometria (titulo, definicao, imagem) VALUES (?, ?, ?)';
    connection.query(query, [titulo, definicao, imagem], (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados na tabela Geometria: ' + err.stack);
            return res.status(500).json({ error: 'Erro ao inserir dados' });
        }
        res.status(200).json({ message: 'Dados inseridos na tabela Geometria com sucesso!' });
    });
});

app.get('/api/geometria', (req, res) => {
    const query = 'SELECT * FROM Geometria'; // Consulta para pegar todos os registros

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao recuperar dados da tabela Geometria: ' + err.stack);
            return res.status(500).json({ error: 'Erro ao recuperar dados' });
        }
        res.status(200).json(results); // Envia os dados recuperados
    });
});

// Rota para inserção na tabela Algebra
app.post('/api/algebra', (req, res) => {
    const { titulo, definicao } = req.body;

    // Verificar se os dados estão completos
    const validationError = checkData(titulo, definicao, res);
    if (validationError) return validationError;

    const query = 'INSERT INTO Algebra (titulo, definicao) VALUES (?, ?)';
    connection.query(query, [titulo, definicao], (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados na tabela Algebra: ' + err.stack);
            return res.status(500).json({ error: 'Erro ao inserir dados' });
        }
        res.status(200).json({ message: 'Dados inseridos na tabela Algebra com sucesso!' });
    });
});

app.get('/api/algebra', (req, res) => {
    const query = 'SELECT * FROM Algebra';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados da tabela Algebra: ' + err.stack);
            return res.status(500).json({ error: 'Erro ao buscar dados' });
        }
        res.status(200).json(results); // Retorna os resultados como um array JSON
    });
});

// Rota para inserção na tabela Combinatoria
app.post('/api/combinatoria', (req, res) => {
    const { titulo, definicao } = req.body;

    const query = 'INSERT INTO Combinatoria (titulo, definicao) VALUES (?, ?)';
    connection.query(query, [titulo, definicao], (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados na tabela Combinatoria:', err.stack);
            return res.status(500).json({ error: 'Erro ao inserir dados.' });
        }
        res.status(200).json({ message: 'Dados inseridos na tabela Combinatoria com sucesso!' });
    });
});

app.get('/api/combinatoria', (req, res) => {
    const query = 'SELECT * FROM Combinatoria';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados da tabela Combinatoria:', err.stack);
            return res.status(500).json({ error: 'Erro ao buscar dados.' });
        }
        res.status(200).json(results);
    });
});

// Rota para Trigonometria (corrigido o uso do objeto `connection`)
app.get('/api/trigonometria', (req, res) => {
    const query = 'SELECT * FROM Trigonometria';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados da tabela Trigonometria: ' + err.stack);
            return res.status(500).json({ error: 'Erro ao buscar dados' });
        }
        res.status(200).json(results); // Envia os dados
    });
});

app.post('/api/trigonometria', (req, res) => {
    const { titulo, definicao } = req.body;

    const query = 'INSERT INTO Trigonometria (titulo, definicao) VALUES (?, ?)';
    connection.query(query, [titulo, definicao], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar dados na tabela Trigonometria: ' + err.stack);
            return res.status(500).json({ error: 'Erro ao adicionar dados' });
        }
        res.status(201).json({ message: 'Trigonometria adicionada com sucesso' });
    });
});

// Rota para Aritmetica (corrigido o uso do objeto `connection`)
app.get('/api/aritmetica', (req, res) => {
    const query = 'SELECT * FROM Aritmetica';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados da tabela Aritmetica: ' + err.stack);
            return res.status(500).json({ error: 'Erro ao buscar dados' });
        }
        res.status(200).json(results); // Envia os dados
    });
});

app.post('/api/aritmetica', (req, res) => {
    const { titulo, definicao } = req.body;

    const query = 'INSERT INTO Aritmetica (titulo, definicao) VALUES (?, ?)';
    connection.query(query, [titulo, definicao], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar dados na tabela Aritmetica: ' + err.stack);
            return res.status(500).json({ error: 'Erro ao adicionar dados' });
        }
        res.status(201).json({ message: 'Dados adicionados com sucesso!' });
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
