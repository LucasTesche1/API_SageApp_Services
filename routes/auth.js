const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// GET de teste

router.get('/', async (req,res) => {

    try{
    const users = await prisma.user.findMany({
        select: {id: true, name: true, email: true}
    })
    res.json(users);
    }catch(error){
        console.error("Erro ao buscar usuários: ", error);
        res.status(500).json({error:"Erro interno do servidor"});
    }
});

// POST /auth/register - CADASTRAR NOVO USUÁRIO

router.post('/register', async (req,res) => {
    const { name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({error : "Nome, e-mail e senha são obrigatórios"});
    }

    try{
        const existingUser = await prisma.user.findUnique({where:{email} });
        if(existingUser){
            return res.status(400).json({error : 'E-mail já está em uso'});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await prisma.user.create({
            data:{name, email, password:hashedPassword}, select:{id:true,name:true,email:true}
        });

        return res.status(201).json(user);
    }catch(error){
        console.error('Erro ao cadastrar usuário: ', error);
        return res.status(500).json({ error: 'Erro ao cadastrar usuário'});
    }

});

//POST /auth/login - LOGAR USUÁRIO

router.post('/login', async (req,res) => {
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({ error: "E-mail e senha são obrigatórios"});
    }

    try{
        const user = await prisma.user.findUnique({where:{email}});

        if(!user){
            return res.status(401).json({error : 'Usuário não encontrado'});

        }

        const valid = await bcrypt.compare(password, user.password);

        if(!valid){
            return res.status(401).json({error: 'Senha inválida'});
        }

        return res.json({
            message:'Login bem-sucedido',
            user:{id:user.id, name: user.name, email: user.email}
        });

    }catch(error){
        console.error("Erro ao logar: ", error);
        return res.status(500).json({ error: 'Erro interno ao logar'});
    }
});

module.exports = router;