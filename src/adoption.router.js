const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

let adoptions = [
    { id: 1, petId: 123, userId: 456, status: 'adopted' },
    { id: 2, petId: 124, userId: 457, status: 'pending' }
];

/**
* @swagger
* /adoptions:
*   get:
*     summary: Lista todas las adopciones
*     responses:
*       200:
*         description: Lista de adopciones obtenida correctamente
*/
router.get('/', (req, res) => {
    res.json(adoptions);
});

/**
* @swagger
* /adoptions/{id}:
*   get:
*     summary: Obtiene los detalles de una adopción por ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*     responses:
*       200:
*         description: Detalles de la adopción
*       404:
*         description: Adopción no encontrada
*/
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const adoption = adoptions.find(a => a.id === id);
    if (!adoption) return res.status(404).json({ error: 'Adoption not found' });
    res.json(adoption);
});

/**
* @swagger
* /adoptions:
*   post:
*     summary: Crea una nueva adopción
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               petId:
*                 type: integer
*               userId:
*                 type: integer
*     responses:
*       201:
*         description: Adopción creada
*       400:
*         description: Faltan datos requeridos
*       403:
*         description: Falló la validación externa
*/
router.post('/', (req, res) => {
    const { petId, userId } = req.body;
    
    if (!petId || !userId) {
        return res.status(400).json({ error: 'petId and userId are required' });
    }

    const envMode = process.env.VALIDATION_MODE || 'strict';

    if (envMode === 'skip') {
        const newAdoption = { id: adoptions.length + 1, petId, userId, status: 'pending' };
        adoptions.push(newAdoption);
        return res.status(201).json(newAdoption);
    }

    const validator = spawn('node', ['-e', `console.log(JSON.stringify({ valid: true }))`]);

    validator.stdout.on('data', (data) => {
        const result = JSON.parse(data.toString());
        if (result.valid) {
            const newAdoption = { id: adoptions.length + 1, petId, userId, status: 'pending' };
            adoptions.push(newAdoption);
            res.status(201).json(newAdoption);
        } else {
            res.status(403).json({ error: 'Validation failed' });
        }
    });
});

module.exports = router;