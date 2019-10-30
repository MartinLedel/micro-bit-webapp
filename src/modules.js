const mysql = require("promise-mysql");
const config = require("../db/config.json");
let db;

(async function() {
    db = await mysql.createConnection(config);

    process.on("exit", () => {
        db.end();
    });
})();

//Object with different SQL statements
let microbits = {
    getAllData: async function() {
        let sql;
        let res;

        sql = `
        SELECT * FROM sensors ORDER BY Uploaded DESC LIMIT 25;
        `;
        res = await db.query(sql);

        return res;
    },
    addSensor: async function(channel_in, roomName, sensorid, sensorx, sensory) {
        let sql;

        sql = `
        INSERT INTO rooms (channel, name, sensor_id, sensor_x, sensor_y)
        VALUES (?, ?, ?, ?, ?);
        ;
        `;
        await db.query(sql, [channel_in, roomName, sensorid, sensorx, sensory]);
    },
    addRoom: async function(channel_in, roomName, width_in, height_in) {
        let sql;

        sql = `
        INSERT INTO roominfo (channel, name, width, height)
        VALUES (?, ?, ?, ?);
        ;
        `;
        await db.query(sql, [channel_in, roomName, width_in, height_in]);
    },
    getAllRooms: async function() {
        let sql;
        let res;

        sql = `
        SELECT name, channel FROM roominfo;
        `;
        res = await db.query(sql);

        return res;
    },
    getRoom: async function(channel_in) {
        let sql;
        let res;

        sql = `
        SELECT * FROM roominfo
        WHERE channel = ?;
        `;
        res = await db.query(sql, [channel_in]);

        return res;
    },
    updateRoom: async function(channel_in, roomName, width_in, height_in) {
        let sql;
        let res;

        sql = `
        UPDATE roominfo
        SET channel = ?, name = ?, width = ?, height = ?
        WHERE channel = ?;
        `;
        res = await db.query(sql, [channel_in, roomName, width_in, height_in, channel_in]);

        return res;
    },
    deleteRoom: async function(channel_in, name_in) {
        let sql;

        sql = `
        DELETE FROM rooms
        WHERE channel = ? AND name = ?;

        DELETE FROM roominfo
        WHERE channel = ? AND name = ?;
        `;

        await db.query(sql, [channel_in, name_in, channel_in, name_in]);
    },
    getAllSensors: async function(channel_in) {
        let sql;
        let res;

        sql = `
        SELECT ID AS sensor_id, Channel AS channel
        FROM sensors
        WHERE Channel = ?
        GROUP BY ID;
        `;

        res = await db.query(sql, [channel_in]);
        return res;
    },
    getAllSensors2: async function(channel_in) {
        let sql;
        let res;

        sql = `
        SELECT *
        FROM rooms
        WHERE channel = ?;
        `;

        res = await db.query(sql, [channel_in]);
        return res;
    },
    getAllSensors3: async function(channel_in) {
        let sql;
        let res;

        sql = `
        SELECT * FROM sensors WHERE Channel = ? ORDER BY Uploaded DESC LIMIT 25;
        `;

        res = await db.query(sql, [channel_in]);
        return res;
    },
    getSensor: async function(id, channel) {
        let sql;
        let res;

        sql = `
        SELECT Light, Tempature, Uploaded FROM sensors
        WHERE ID = ? AND Channel = ?
        ORDER BY Uploaded DESC LIMIT 25;
        `;

        res = await db.query(sql, [id, channel]);
        return res;
    },
    deleteSensor: async function(id, channel) {
        let sql;

        sql = `
        DELETE FROM rooms
        WHERE sensor_id = ? AND channel = ?;
        `;

        await db.query(sql, [id, channel]);
    },
};

module.exports = microbits;
