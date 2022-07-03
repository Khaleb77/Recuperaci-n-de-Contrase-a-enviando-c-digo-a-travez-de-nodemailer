const nodemailer = require('nodemailer');



exports.sendEmail = async function (req, res,data) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user:  process.env.Email,
            pass:  process.env.EmailPassword
        }
    });

    var EmailOptions = {
        from: process.env.Email,
        to: data.correo,
        subject: data.titulo,
        html: data.contenidoHtml
    };
    // Enviamos el email
    await transporter.sendMail(EmailOptions, function (error, info) {
        if (error) {
            return res.status(502).json({error: "Error al enviar correo electrónico"});
        } else {
           return res.status(200).json({titulo: data.titulo,msj: data.mensajeConfirmacion});
        }
    });
};
