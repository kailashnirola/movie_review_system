import pg from  'pg';
import express from 'express'; 
import axios from 'axios';

const port=3000;
const app = express();

const db =new  pg.Client({
    user:'postgres',
    database:'book reviews',
    host:'localhost',
    password:'password',
    port:5432
});

app.use(express.urlencoded({ extended:true}));
app.use(express.static('public'));

app.listen(port, ()=>{
    console.log(`Server running on port:${port}`);
});

db.connect();
let reviews = [];

app.get("/", async (req, res)=>{
    try {
        const result = await db.query("select * from reviews order by id");
        reviews = result.rows;
        for(let i=0; i< reviews.length;i++){
            const isbn = reviews[i].isbn;
            const coverurl = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
            try {
                await axios.get(coverurl);
                reviews[i].coverUrl=coverurl;
            } catch (error) {
                console.log(error);
            }
        }
        res.render("index.ejs",{ reviews: reviews});
    } catch (error) {
        console.log(error);
    }
});

app.get("/add", async (req, res)=>{
    res.render('new.ejs');
});

app.post('/new', async (req, res)=>{
    const name = req.body.name;
    const stars = req.body.stars;
    const isbn = req.body.isbn;
    const review = req.body.review;
    try {
        await db.query("insert into reviews (name, stars, isbn, review) values ($1,$2,$3,$4)",[name,stars,isbn,review]);
    } catch (error) {
        console.log(error);
    }
    res.redirect('/');
});

app.post('/delete', async (req, res)=>{
    const id = req.query.id;
    try {
        await db.query("delete from reviews where id=$1",[id]);
    } catch (error) {
        console.log(error);
    }
    res.redirect('/');
});

app.get('/update', async (req, res)=>{
    const id = req.query.id;
    let result;
    try {
        result = await db.query("select * from reviews where id=$1",[id]);
    } catch (error) {
        console.log(error);
    }
    res.render('update.ejs',{rev: result.rows[0]});
});

app.post('/update', async (req, res)=>{
    const name = req.body.name;
    const stars = req.body.stars;
    const isbn = req.body.isbn;
    const review = req.body.review;
    const id = req.query.id;
    try {
        await db.query("update reviews set name=$1, stars=$2, isbn=$3, review=$4 where id=$5",[name,stars,isbn,review,id]);
    } catch (error) {
        console.log(error);
    }
    res.redirect('/');
});