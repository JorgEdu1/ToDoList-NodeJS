const express = require('express');
const routes = express.Router();
const {PrismaClient} = require("@prisma/client")

const prisma  = new PrismaClient()

const array = []

//create
routes.post("/todos", async (req, res)=>{
    const {name} = req.body
   const todo = await prisma.todo.create({
        data:{
            name,
            status: false,
        },
    })
    return res.status(201).json(todo) //retorna o status 201
})


//read
routes.get("/todos", async (req, res)=>{

    const todos = await prisma.todo.findMany()
    return res.status(200).json(todos)
})

//update
routes.put("/todos", async (req, res)=>{
    const {name, id, status} = req.body
    
    if(!id){
        return res.status(400).json({error:"id is required"})
    }  

    const todoAlreadyExists = await prisma.todo.findUnique({
        where:{
            id,
        }
    })

    if(!todoAlreadyExists){
        return res.status(404).json({error:"todo not found"})
    }

    const todo = await prisma.todo.update({
        where:{
            id,
        },
        data:{
            name,
            status,
        },
    })
    return res.status(200).json(todo)
})

//delete
routes.delete("/todos/:id", async (req, res)=>{
    const {id} = req.params

    const intId = parseInt(id);

    if(!intId){
        return res.status(400).json({error:"id is required"})
    }

    const todoAlreadyExists = await prisma.todo.findUnique({
        where:{
            id: intId,
        }
    })

    if(!todoAlreadyExists){
        return res.status(404).json({error:"todo not found"})
    }

    const todo = await prisma.todo.delete({
        where:{
            id: intId,
        }
    })
    return res.status(200).send();
}
)

module.exports = routes;