const Express = require("express")
const jwt = require("jsonwebtoken")
const llave = require("./middleware/llaveSecreta")
const Verificacion = require("./middleware/verificacion")
var cors = require('cors')



const VerificarAdministrador = require("./middleware/verfiricarAdministrador")

const app = Express()
app.use(cors())
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Probando seguridad")
})

app.post("/autenticacion", (req, res) => {
    const { usuario, clave } = req.body;
    //servicio de consulta en la base de datos para verificar usuario y contraseña
    const usuarios = [{
        usuario: "administrador",
        clave: "12345",
        role: "admin"
    },
    {
        usuario: "otro",
        clave: "otro123",
        role: "editor"
    }]
    const user = usuarios.find(x => x.clave === clave && x.usuario === usuario);
    if (user) {
        //payload
        const datosToken = {
            autenticado: true,
            email: `${user.usuario}@gmail.com`,
            nombre: "Juan Perez"
        }
        const token = jwt.sign(datosToken, llave.llavesecreta, {
            expiresIn: '1d'
        })
        res.json({
            mensaje: "Usuario autenticado",
            token: token,
            role: user.role
        })

    } else {
        res.status(404).send({ mensaje: "usuario no encontrado" })
    }
})



//ruta con autenticación
app.get("/seguro", Verificacion, (req, res) => {

    res.send("Informacion ultrasecreta")

})

app.get("/miperfil", Verificacion, (req, res) => {

    res.send("Informacion de mi perfil")

})


app.get("/soloadministrador", [VerificarAdministrador, Verificacion], (req, res) => {

    res.send("Esta informacion puede ser consultada solo por el administrador")

})


app.listen(3000, () => console.log("Escuchando en el puerto 3000"))