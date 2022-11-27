const express = require('express');
const router = express.Router();
const passport = require('passport');

const Usuario = require('../model/Usuarios');

router.get('/users/singin', function(req, res){
    //response.send('Ingresando a la app');
    res.render('users/singin');
});

router.get('/users/singup', function(request, response){
    //response.send('Formulario de autentificacion');
    response.render('users/singup')
});

router.get('/users/singupadmin', function(request, response){
    //response.send('Formulario de autentificacion');
    response.render('users/singup')
});

router.post('/users/singup', async function(req, res){
    const { nombre, email,password, passwordAut} = req.body;
    const errores = [];

    if(!nombre){
    errores.push({text: 'Por favor inserta el nombre'});
    }
    if(!email){
    errores.push({text: 'Por favor ingrese el email'});
    }
    if(!password){
    errores.push({text: 'Por favor ingresa el pasword'});
    }
    if(!passwordAut){
    errores.push({text: 'Por favor confirma el password'});
    }
    if(password.length < 4){
    errores.push({text: 'El password debe tener 4 caracteres'});
    }
    if(password != passwordAut){
    errores.push({text: 'El password no coincide'});
    }
    if(errores.length > 0){
        res.render('users/singup',
        {errores, nombre, email, password, passwordAut});
    }else{

        //Usuario no exista
        const emailUser = await Usuario.findOne({email: email});
        if (emailUser){
            error.push({text: 'El email ya esta en uso'});
            res.render('users/singup', {
                errores,
                nombre,
                email,
                password,
                passwordAut
            });
            return;
        }
        
        // res.send('OK');
        const newUser = new Usuario({
            nombre, email, password, tipo:1
        });
        newUser.password = await newUser.encryptPassword (password);
        console.log(newUser)
        await newUser.save()
        .then(()=>{
            req.flash('success_msg', 'Usuario registrado correctamente');
            res.redirect('/users/singin');
        })
        .catch((err)=>{
            console.log(err);
            res.redirect('/error');
        })
    }
});//Fin del post para guardar usuarios

//Fin de agregar usuario

router.post('/users/singin', passport.authenticate('local', {
    successRedirect: '/notas',
    failureRedirect: '/users/singin',
    failureFlash: true
}));

// router.get('/users/logout', function(req, res){
//     req.logout();
//     res.redirect('/');
// });

router.get('/users/logout', (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      // if you're using express-flash
      req.flash('success_msg', 'session terminated');
      res.redirect('/');
    });
  });

module.exports = router;