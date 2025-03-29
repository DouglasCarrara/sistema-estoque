const express = require('express');
const router = express.Router();
const Produto = require('../models/Produto');

// Obter todos os produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.find().sort({ createdAt: -1 });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obter um produto específico
router.get('/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar um novo produto
router.post('/', async (req, res) => {
  const produto = new Produto({
    nome: req.body.nome,
    descricao: req.body.descricao,
    preco: req.body.preco,
    quantidade: req.body.quantidade,
    categoria: req.body.categoria,
    fornecedor: req.body.fornecedor
  });

  try {
    const novoProduto = await produto.save();
    res.status(201).json(novoProduto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar um produto
router.put('/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (req.body.nome) produto.nome = req.body.nome;
    if (req.body.descricao) produto.descricao = req.body.descricao;
    if (req.body.preco) produto.preco = req.body.preco;
    if (req.body.quantidade !== undefined) produto.quantidade = req.body.quantidade;
    if (req.body.categoria) produto.categoria = req.body.categoria;
    if (req.body.fornecedor) produto.fornecedor = req.body.fornecedor;

    const produtoAtualizado = await produto.save();
    res.json(produtoAtualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Excluir um produto
router.delete('/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 