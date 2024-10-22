import express from 'express'
import productRouter from './routes/productRouter.js'
import cartRouter from './routes/cartRoutes.js'


const app =express()
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({extended:true}));




app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);




app.get('/',(req,res) =>{
    res.send('todo ok')
})


app.listen(PORT, ()=>{
    console.log(`server on en http://localhost:${PORT}`)
})