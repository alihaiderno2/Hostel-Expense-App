const User = require('../models/User')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req,res)=>{
    try{
        const {name,email, password} = req.body;

        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({ msg: "User already registered" });
        }

        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password,salt);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({id : user._id},process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (err) {
        console.error("REGISTRATION ERROR:", err.message); 
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req,res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.status(400).json({msg : 'Invalid Credentials'});
        }
        
        const isMatch = await bycrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg : 'Invalid Credentials'});
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

    }catch(err){
        res.status(500).send("Server error in Login");
    }
};

exports.getMe = async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password').populate('groups', 'name joinCode');
        res.json(user);
    }catch(err){
        res.status(500).send("Server error in fetching user data");
    }
};
