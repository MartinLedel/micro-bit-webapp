"use strict";

const express = require("express");
const router = express.Router();
const microbits = require("../src/modules.js");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/", async (req, res) => {
    let data = {
        title: "Welcome | micro:bits Room controller"
    };

    data.roominfo = await microbits.getAllRooms();
    data.histogram = await microbits.getAllData();

    res.render("index", data);
});

router.post("/", urlencodedParser, async (req, res) => {
    await microbits.addRoom(
        req.body.channel,
        req.body.roomname,
        req.body.height,
        req.body.width
    );

    res.redirect(`/room/${req.body.channel}`);
});

router.get("/room/:channel", async (req, res) => {
    let s_channel = req.params.channel;
    let data = {
        title: "Welcome | micro:bits Room controller"
    };

    data.rooms = await microbits.getAllRooms();
    data.histogram = await microbits.getAllSensors3(s_channel);
    data.room = await microbits.getRoom(s_channel);
    data.sensors = await microbits.getAllSensors(s_channel);
    data.sensors2 = await microbits.getAllSensors2(s_channel);

    res.render("room", data);
});

router.post("/room", urlencodedParser, async (req, res) => {
    if (req.body.sensordata) {
        let sensorArr = req.body.sensordata.split(",");
        let i = 0;
        for (var c = 0; c < (sensorArr.length / 3); c++) {
            await microbits.addSensor(
                req.body.channel,
                req.body.roomname,
                sensorArr[i++],
                sensorArr[i++],
                sensorArr[i++]
            );
        }
    } else if (req.body.channel || req.body.roomname || req.body.height || req.body.width) {
        await microbits.updateRoom(
            req.body.channel,
            req.body.roomname,
            req.body.height,
            req.body.width,
        );
    }

    res.redirect(`/room/${req.body.channel}`);
});

router.get("/delete/:channel/:roomname", urlencodedParser, async (req, res) => {
    await microbits.deleteRoom(
        req.params.channel,
        req.params.roomname
    );

    res.redirect("/");
});

router.get("/getsensor", async (req, res) => {
    let s_id = req.query.id;
    let s_channel = req.query.channel;
    let response = {};

    response.data = await microbits.getSensor(s_id, s_channel);

    res.json(response);
});

router.get("/deletesensor", async (req, res) => {
    let s_id = req.query.id;
    let s_channel = req.query.channel;

    await microbits.deleteSensor(s_id, s_channel);
});

module.exports = router;
