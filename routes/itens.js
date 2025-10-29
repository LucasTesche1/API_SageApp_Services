const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { name, quantity, dosage } = req.body;

  try {
    const newItem = await prisma.itens.create({
      data: {
        name,
        quantity,
        dosage,
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar item' });
  }
});

router.get('/', async (req, res) => {
  try {
    const itens = await prisma.itens.findMany();
    res.json(itens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const item = await prisma.itens.findUnique({
      where: { id: parseInt(id) },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar item' });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity, dosage } = req.body;

  try {
    const updatedItem = await prisma.itens.update({
      where: { id: parseInt(id) },
      data: { name, quantity, dosage },
    });
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.itens.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Item deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar item' });
  }
});

module.exports = router;
