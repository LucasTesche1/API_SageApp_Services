const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const bcrypt = require('bcrypt');

const { GoogleGenerativeAI } = require("@google/generative-ai");

//apikey

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//funções

async function runPrompt(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}


module.exports = { runPrompt };

