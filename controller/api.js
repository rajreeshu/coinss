const mongoose = require('mongoose');
const User = require('../model/User');
const Product = require('../model/Product');
const Review = require('../model/Review');
const ChatApp = require('../model/ChatApp');

// installing socket.io
const { Socket } = require("../socket");

//signup login function
exports.signup_form = (req, res) => {
    if (req.body.password != req.body.confirm_password) {
        res.send("something went wrong");
    }
    var user_data = {
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password,
        "gender": req.body.gender,
        "isAdmin": "0"
    }

    User.findOne({ email: req.body.email }).then((existingUser) => {

        if (!existingUser) {
            User.create(user_data).then(() => {
                res.json({ "response": "success" });
            }).catch((err) => {
                res.send("something went wrong in registration");
            });
        } else {
            res.json(existingUser);
        }
    }).catch((err) => {
        res.send("something went wrong");
    });

    // res.json(req.body);

}

exports.login_form = (req, res) => {
    User.findOne({ email: req.body.email, password: req.body.password }).then((existingUser) => {
        if (existingUser) {
            res.json({ "response": "verified" });
        } else {
            res.json({ "response": "User not found" });
        }
    }).catch((err) => {
        console.log(err);
    });
}

exports.get_userID = async (req, res) => {
    try {
        // console.log(req.params.email);
        var user_data = await User.findOne({ email: req.params.email });
        res.send(user_data._id);
    } catch (error) {
        res.send(error);
    }

}


//product api function
// insert product details from admin pannel/ adding image is not implimented yet
// exports.insert_product = async (req, res) => {
//     var product_data = {
//         "product_name": req.body.product_name,
//         "price": req.body.price,
//         "description": req.body.description,
//         "owner": req.body.owner
//     }
//     try {
//         var response = await Product.create(product_data);
//         res.send("success");
//     } catch (error) {
//         res.send(error);
//     }
// }
//get list of all products
exports.all_products = async (req, res) => {
    try {
        let product_data;
        if (req.body.text == "") {
            product_data = await Product.find({}, { owner: 0 }).sort({ "_id": -1 });
        } else {
            product_data = await Product.find({ product_name: { $regex: '.*' + req.body.text + '*' } }).sort({ "_id": -1 });
        }
        res.json(product_data);
    } catch (err) {
        res.send(err);
    }
}
// get details of one product with it's id.
exports.one_product = async (req, res) => {
    try {
        let product_data = await Product.findById(req.params.productId).populate("owner");
        console.log(product_data);
        let isExist = false;
        if (req.params.email) {
            let user_info = await User.findOne({ email: req.params.email });
            user_info.favouriteProduct.forEach(e => {
                if (e == req.params.productId) {
                    isExist = true;
                }
            });
        }
        res.json({
            product_name: product_data.product_name,
            price: product_data.price,
            description: product_data.description,
            owner: product_data.owner.name,
            profileImg: product_data.profileImg,
            favourite: isExist,
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

//get list of all products posted by one user
exports.userProducts = async (req, res) => {
    if (!req.body.user) {
        res.json("");
        return;
    }
    try {
        let owner = await User.findOne({ 'email': req.body.user });
        let ownerId = owner._id;
        let productData = await Product.find({ owner: ownerId }).sort({ "_id": -1 });
        res.json(productData);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

exports.addRemoveFavourite = async (req, res) => {
    try {
        let user = await User.findOne({ "email": req.params.email });
        let userId = user._id;
        let isExist = false;
        user.favouriteProduct.forEach(e => {
            if (e == req.body.productId) {
                isExist = true;
            }
        });
        if (isExist) {
            let update = await User.findOneAndUpdate({ _id: userId }, { $pull: { favouriteProduct: mongoose.Types.ObjectId(req.body.productId) } });
            res.json({ response: 0 });
        } else {
            let update = await User.findOneAndUpdate({ _id: userId }, { $push: { favouriteProduct: mongoose.Types.ObjectId(req.body.productId) } }, { new: true });
            res.json({ response: 1 });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

exports.getFavourites = async (req, res) => {
    if (!req.params.email) {
        res.json("");
        return;
    }
    try {
        let userInfo = await User.findOne({ 'email': req.params.email }).populate("favouriteProduct");
        console.log(userInfo);
        res.send(userInfo.favouriteProduct);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}


// admin panel api
exports.admin_addProduct = async (req, res) => {
    // console.log(req.body.profileImg);
    // return;
    console.log(req.body);
    // res.send(req.body);
    // return;
    try {
        if (req.file) {
            const pathName = req.file.path;
            console.log(req.file.path);
            // res.status(200).send(req.file);
        }
        var product_data = {
            "product_name": req.body.product_name,
            "price": req.body.price,
            "description": req.body.description,
            "owner": req.body.owner,
            "profileImg": 'assets/uploads/' + req.file.filename
        }
        var add_data = await Product.create(product_data);
        res.json(add_data);

    } catch (error) {
        res.send(error);
    }
}


//testing
exports.getReview = async (req, res) => {
    try {
        let message = await Review.find({ productId: req.params.productId }).populate("userId",{name:1});
        res.json(message);
    } catch (err) {
        res.send(err);
        console.log(err);
    }

}
exports.insertReview = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email }, { _id: 1 });
        console.log(user);
        let addData = {
            userId: user._id,
            productId: req.body.productId,
            review: req.body.message
        };
        let message = await Review.create(addData);
        res.json(message);

    } catch (err) {
        res.send(err);
        console.log(err);
    }
}

// payment gateway setup
const Razorpay = require('razorpay');
const { response } = require('express');
// This razorpayInstance will be used to
// access any resource from razorpay
const razorpayInstance = new Razorpay({
    // Replace with your key_id
    key_id: "rzp_test_0PhqsnI53Mw9bl",
    // Replace with your key_secret
    key_secret: "C1fIbLArWn76D6370GLYkHxo"
});

// payment gateway controllers
exports.createOrder = (req, res) => {
    const { amount, currency, receipt, notes } = req.body;
    razorpayInstance.orders.create({ amount, currency, receipt, notes }, (err, order) => {
        //STEP 3 & 4: 
        if (!err)
            res.json(order)
        else
            res.send(err);
    });
}

// chat api controllers
exports.getUsers = async (req, res) => {
    try {
        let usersList = await User.find({}, { name: 1, email: 1 });
        // Socket.emit('message', message);
        res.json(usersList);
    } catch (err) {
        res.send(err);
    }
}

exports.postChat = async (req, res) => {
    if (!req.body.receiverId) {
        console.log('No receiver');
        res.json({ response: 'No receiver' });
        return;
    }

    try {
        let UserId = await User.findOne({ email: req.body.senderMail }, { _id: 1 });
        let chat = await ChatApp.create({
            senderId: mongoose.Types.ObjectId(UserId._id),
            receiverId: mongoose.Types.ObjectId(req.body.receiverId),
            message: req.body.message
        });
        res.json(chat);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

exports.getChat = async (req, res) => {
    try {
        let UserId = await User.findOne({ email: req.params.senderMail }, { _id: 1 });
        let chats = await ChatApp.find({
            $or: [
                {
                    senderId: UserId._id,
                    receiverId: req.params.receiverId
                },
                {
                    senderId: req.params.receiverId,
                    receiverId: UserId._id
                }

            ]

        }).populate('senderId', { name: 1, email: 1 }).populate('receiverId', { name: 1, email: 1 });

        res.json(chats);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}
