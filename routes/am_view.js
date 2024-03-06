const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session')
const bodyParser = require('body-parser');
const oracledb = require("oracledb");
const router = express.Router();
const dbConfig = {
    user: 'jwuk2',
    password: '1234',
    connectString: '192.168.0.32:1521/xe'
};

router.get('/', async (req, res) => {
    const epId = req.query.epId || 1; // 기본값으로 1을 사용합니다.

    try {
        conn = await oracledb.getConnection(dbConfig);

        // CLOB 열을 문자열로 처리하도록 설정
        await conn.execute(`ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY/MM/DD'`);
        await conn.execute(`ALTER SESSION SET NLS_TIMESTAMP_FORMAT = 'YYYY/MM/DD HH24:MI:SS'`);
        await conn.execute(`ALTER SESSION SET NLS_TIMESTAMP_TZ_FORMAT = 'YYYY/MM/DD HH24:MI:SS TZH:TZM'`);
        await conn.execute(`ALTER SESSION SET TIME_ZONE = 'UTC'`);
        await conn.execute(`ALTER SESSION SET NLS_SORT = 'BINARY_CI'`);
        await conn.execute(`ALTER SESSION SET NLS_COMP = 'LINGUISTIC'`);
        await conn.execute(`ALTER SESSION SET NLS_LANGUAGE = 'AMERICAN'`);
        await conn.execute(`ALTER SESSION SET NLS_TERRITORY = 'AMERICA'`);
        await conn.execute(`ALTER SESSION SET NLS_NUMERIC_CHARACTERS = '.,'`);

        const sql_query = 'SELECT title.novel_id, episode.EP_ID, episode.EP_TITLE, episode.CONTENT, title.NOVEL_NAME ' +
            'FROM episode ' +
            'JOIN title ON episode.NOVEL_ID = title.NOVEL_ID ' +
            `WHERE episode.EP_ID = ${epId}`;
        const sql_query2 = 'SELECT ep_id, comment_id, comment_text, username ' +
            'FROM epi_comment ' +
            `WHERE ep_id = ${epId}`;
        const sql_query3 = 'SELECT ep_id, COUNT(comment_id) AS comment_count ' +
            'FROM epi_comment ' +
            `WHERE ep_id = ${epId} ` +  // 띄어쓰기 추가
            'GROUP BY ep_id';

        const result = await conn.execute(sql_query, {}, { fetchInfo: { CONTENT: { type: oracledb.STRING } } });
        const contentText = result.rows[0][3];
        const result2 = await conn.execute(sql_query2)
        const result3 = await conn.execute(sql_query3)
        console.log(result2)
        console.log(result3)


        console.log('Content:', contentText);

        res.render('am_view', {
            view: result.rows,
            content: contentText, // content를 그대로 전달
            comment: result2.rows,
            count: result3.rows
        });
    } catch (error) {
        console.error('Error in /am_view:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            await conn.close();
        }
    }
});






module.exports = router;