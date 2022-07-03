const express = require('express');
const router = express.Router();
const sendEmail = require('../sendEmail');
const Joi = require("joi");
const crypto = require("crypto");
const Usuario = require('../../../../libs/usuarios');
const UsuarioDao = require('../../../../dao/mongodb/models/UsuarioDao');
const userDao = new UsuarioDao();
const user = new Usuario(userDao);
user.init();

const {jwtSign} = require('../../../../libs/security');

router.post("/link", async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const userData = await user.getUsuarioByEmail({email});
        if (!user){
            return res.status(400).send("No existe el correo electronico");
        }

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.jwtToken}`;
        await sendEmail(user.email, "Password reset", link);
        const {password: passwordDb, created, updated, ...jwtUser} = userData;
        const jwtToken = await jwtSign({jwtUser, generated: new Date().getTime()});
        res.status(200).json({token: jwtToken});
        res.send("El link para cambiar la contraseña ha sido enviado a tu correo electronico");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

module.exports = router;