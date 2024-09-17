import express from 'express';
import { prisma } from './lib/prisma';
import multer  from 'multer'
import fs from 'fs'
import { parse } from 'csv-parse'


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const upload = multer({ dest: 'tmp/' });


app.post('/tasks', async (request, response) =>{

    const { title, description } = request.body

    if(!title || !description) {
        return response.status(400).json({error: 'parameters is miss'})
    }
    const tasks = await prisma.tasks.create({ data: { title, description}})
    return response.status(201).json({task: tasks})
})

app.get('/tasks', async (request, response) =>{
    const task = await prisma.tasks.findMany()
    return response.status(201).json({tasks: task})
})

app.put('/task/:id', async (request, response) =>{
    const task_id = Number(request.params.id)
    const task = await prisma.tasks.findUnique({ where: { id: task_id}})

    if(!task) {
        return response.status(401).json({error: 'task not exist'})
    }

    const { title, description } = request.body
    const updateTask = await prisma.tasks.update({ 
        where: { id: task_id}, 
        data: {title, description}
    })  
    return response.status(200).json({task: updateTask})
})

app.delete('/task/:id', async (request, response) =>{
    const task_id = Number(request.params.id)
    const task = await prisma.tasks.findUnique({ where: { id: task_id}})

    if(!task) {
        return response.status(401).json({error: 'task not exist'})
    }

    await prisma.tasks.delete({ 
        where: { id: task_id}, 
    })  
    return response.status(200).send()
})

app.patch('/task/:id/complete', async (request, response) =>{
    const task_id = Number(request.params.id)
    const task = await prisma.tasks.findUnique({ where: { id: task_id}})

    if(!task) {
        return response.status(401).json({error: 'task not exist'})
    }

    const tasksStatus = task.completed_at ? null : new Date()

    const updateTask = await prisma.tasks.update({ 
        where: { id: task_id}, 
        data: { completed_at: tasksStatus}
    })  
    return response.status(200).json({task: updateTask})
})

app.post('/tasks/import', upload.single('file'), async (request, response) => {
    
    if(!request.file) {
        return response.status(401).json({error: 'file is required'})
    }

    const csvData: string[] = [];
    fs.createReadStream(request.file?.path)
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvRow) {
        csvData.push(csvRow);        
    })
    .on('end',async function() {

        const data = csvData.map((row) => ({title: row[0], description: row[1]}))
        const tasksCreated = await prisma.tasks.createMany({
            data: data
        })

        return response.status(201).json({tasks: tasksCreated})
    });
})



app.listen(3000)