const express = require('express')
const axios = require('axios')
const mongoose = require('mongoose')

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON 