// const html_url = require('../client/index.html');
import mysql from "mysql2/promise";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import moment from "moment";


const app = express()
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

async function initConnection() {
    const connection = await mysql.createConnection({
        // тут надо указать данные для подключения
        host: "localhost",
        port: "3306",
        user: "root",
        database: "todolist",
        password: "",
    });
    return connection
}

(async () => {
    const connection = await initConnection()
    let d = (date) => moment(parseInt(date)).format("YYYY-MM-DD");

    const addTodo = async ({ title, subtitle, date}) => {
        // Метод для добавления записи
        connection.query(
            `INSERT INTO todolist (title, subtitle, date) VALUES ('${title}', '${subtitle}', '${
                d(date)
            }')`
        )
    }

    async function getTodo(id) {
        // метод для получения запии по id
        let [rows] = await connection.query(
            `SELECT * FROM todolist WHERE id = '${id}'`
        )
        return rows[0]
    }

    async function getAllTodos(id) {
        // метод для получения всех записей
        let [rows] = await connection.query(
            `SELECT * FROM todolist`
        )
        return rows
    }

    async function updateDone(id) {
        // метод для обновления статуса элемента из списка на выполненно
        return connection.query(
            `UPDATE todolist SET done = '1' WHERE id = '${id}'`
        )
    }

    async function deleteTodo(id) {
        // метод для удаления записи по id
        return connection.query(
            `DELETE FROM todolist WHERE id = '${id}'`
        )
    }

    app.get("/todo/:id", async (req, res) => {
        let data = await getTodo(req.params.id)
        res.json({
            success: true,
            data
        })
    })

    app.put('/todo/:id', async (req, res) => {
        updateDone(req.params.id).then(() => {
            res.json({
                success: true,
            }) 
        }).catch(() => {
            res.json({
                success: false,
            }) 
        })
    })

    app.delete('/todo/:id', async (req, res) => {
        deleteTodo(req.params.id).then(() => {
            res.json({
                success: true,
            }) 
        }).catch(() => {
            res.json({
                success: false,
            }) 
        })
    })

    app.get("/todo/", async (req, res) => {
        let data = await getAllTodos()
        res.json({
            success: true,
            data
        })
    })

    app.post('/todo/', (req, res) => {
        addTodo(req.query)
        res.json({
            success: true,
        })
    })
})()

app.listen(5000, () => {
    console.log("server is listen 5000 port")
})