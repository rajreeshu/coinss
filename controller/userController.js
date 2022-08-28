// const User = require('../model/User');

exports.footer = (req, res)=>{
    res.render('footer');
}
exports.home=(req,res)=>{ //checked54
    res.render('home');
}

exports.product=(req,res)=>{
    res.render('product');
}

exports.login=(req,res)=>{
    res.render('login');
}
exports.signup=(req,res)=>{
    res.render('signup');
}
exports.account=(req,res)=>{
    res.render('account');
}
exports.favourites=(req,res)=>{
    res.render('favourite');
}

// admin controller
exports.admin=(req,res)=>{
    res.render('admin');
}

// chat section
exports.chatHome=(req,res)=>{
    res.render('chat/chatHome');
}

//404 page not found error page
exports.error404=(req,res)=>{
    res.render('error404');
}