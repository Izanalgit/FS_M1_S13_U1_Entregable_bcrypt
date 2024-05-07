const express = require("express");
const session = require('express-session');

const {createSession,generateToken,verifyToken} = require ("../middlewares/authMiddleware");
const usersProve = require("../data/users");

const routes = express.Router();
const users = usersProve();

routes.use(session(createSession()));

routes.get("/",(req,res) => {
    const loginForm = `
        <form action="/login" method="post">
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required><br>
        
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required><br>
    
            <button type="submit">Iniciar sesión</button>
        </form> 
    `;
  
    if(req.session.token)res.redirect("/dashboard");
    else res.send(loginForm);
  });

routes.post("/login",(req,res) => {
    const { username, password } = req.body;
    const user = users.find((usr) => (usr.usuario === username) && (usr.contraseña === password));

    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/dashboard');
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
});

routes.get("/dashboard", verifyToken, (req, res) => {
    const userName = req.user;
    const user = users.find((usr) => usr.id === userName);

    if (user) {
        res.send(`
            <h1>Bienvenido, ${user.nombre}!</h1> 
            <p>ID: ${user.id}</p> 
            <p>Usuario: ${user.nombre}</p> 
            <br> 
            <form action="/logout" method="post"> 
                <button type="submit">Cerrar sesión</button> 
            </form>
        `);
    } else {
        res.status(401).json({ message: 'Usuario no encontrado' });
    }
});

routes.post("/logout",(req,res) => {
    req.session.destroy();
    res.redirect('/');
});


module.exports = routes;