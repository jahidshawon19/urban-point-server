const express = require('express')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

const app = express()
const port = process.env.PORT ||  5000

// middlewere 

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Urban Point Server Running...')
})

app.listen(port, ()=>{
    console.log('Running Urban Point Server at ', port)
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1yfcy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
        const database = client.db('urbanPoint')
        const latestApartmentCollection = database.collection('latestApartments')
        const bookingApartmentCollection = database.collection('bookingApartments')
      

        //POST API FOR LATEST APARTMENT 
        app.post('/latestApartment', async (req, res) =>{
            const newLatestApartment = req.body 
            const result = await latestApartmentCollection.insertOne(newLatestApartment)
            res.json(result)
            
        })

        // GET API FOR DISPLAY LATEST APARTMENT 

        app.get('/latestApartment', async (req, res) =>{
            const cursor = latestApartmentCollection.find({})
            const latestApartments = await cursor.toArray()
            res.send(latestApartments)
        })

        // DELETE API FOR DELETE LATEST APARTMENT BY ID
        app.delete('/latestApartment/:id', async (req, res) =>{
            const id = req.params.id 
            const query = { _id: ObjectId(id)}
            const result = await latestApartmentCollection.deleteOne(query)

            res.json(result)
        })

        // GET API FOR GETTING SPECIFIC INFORMATION BY ID 
        app.get('/latestApartment/:id', async(req, res) =>{
            const id = req.params.id 
            const query = {_id: ObjectId(id)}
            const latestApartment = await latestApartmentCollection.findOne(query)
            res.send(latestApartment)
        })


        // POST API FOR BOOKING APARTMENT 

        app.post('/booking', async (req, res) =>{
            const newBookingApartment = req.body 
            const result = await bookingApartmentCollection.insertOne(newBookingApartment)
            res.json(result)
            
        })

        // GET API FOR DISPLAY BOOKING LIST IN ADMIN PANEL 

        app.get('/booking', async (req, res) =>{
            const cursor = bookingApartmentCollection.find({})
            const bookings = await cursor.toArray()
            res.send(bookings)
        })   


        // DELETE API FOR DELETE BOOKING BY ID
        app.delete('/booking/:id', async (req, res) =>{
            const id = req.params.id 
            const query = { _id: ObjectId(id)}
            const result = await bookingApartmentCollection.deleteOne(query)

            res.json(result)
        })

        // GET API FOR DISPLAY Booking List in Dashboard fro individual user 

        app.get('/userBookingList', async (req, res) =>{
            const email = req.query.email
            const query = {email:email}
            const cursor = bookingApartmentCollection.find(query)
            const bookings = await cursor.toArray()
            res.send(bookings)
        })
        
        


   

    }finally{
        // await client.close()
    }
}

run().catch(console.dir)