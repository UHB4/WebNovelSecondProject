const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session')
const bodyParser = require('body-parser');
const oracledb = require("oracledb");
const router = express.Router();
const dbConfig = {
    user: 'jwuk',
    password: '1234',
    connectString: '192.168.0.32:1521/xe'
};



router.get('/', async (req, res) => {
    const novelId = req.query.novelId || 1; // 기본값으로 1을 사용합니다.
    console.log(novelId)
    // 나머지 코드는 이전과 동일하게 유지됩니다.
    try {
        conn = await oracledb.getConnection(dbConfig);

        const sortType = req.query.order || 'latest';
        let orderByClause = '';

        if (sortType === 'latest') {
            orderByClause = 'ORDER BY e.rg_date DESC';
        } else if (sortType === 'sequential') {
            orderByClause = 'ORDER BY e.ep_id';
        }

        const sql_query =
            'SELECT t.novel_name, a.pen_name ' +
            'FROM title t ' +
            'JOIN novels n ON t.novel_id = n.novel_id ' +
            'JOIN authors a ON n.author_id = a.author_id';
        const sql_query2 =
            'SELECT ' +
            't.novel_name AS title, ' +
            't.novel_id, ' +
            'e.ep_title AS episode_title, ' +
            'TO_CHAR(e.rg_date, \'YYYY/MM/DD\') AS episode_date, ' + // episode 테이블에서 rg_date 추가
            'a.pen_name AS author_pen_name, ' +
            'e.ep_id, ' +
            'n.img_Url ' + // novels 테이블에서 imgUrl 추가
            'FROM ' +
            'title t ' +
            'JOIN ' +
            'novels n ON t.novel_id = n.novel_id ' +
            'LEFT JOIN ' +
            'episode e ON t.novel_id = e.novel_id ' +
            'LEFT JOIN ' +
            'authors a ON n.author_id = a.author_id ' +
            `WHERE t.novel_id = ${novelId} ${orderByClause}`;

        const result = await conn.execute(sql_query);
        const result1 = await conn.execute(sql_query2);
        console.log(result1)
        console.log(`main:`+ result)

        res.render('am_episode', {
            novel: result1.rows,
            main: result.rows,
        });
    } catch (error) {
        console.error('Error in /am_episode:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            await conn.close();
        }
    }
});

// router.get('/sort', async (req, res) => {
//     const novelId = req.query.novelId || 1; // 기본값으로 1을 사용합니다.
//
//     // 나머지 코드는 이전과 동일하게 유지됩니다.
//     try {
//         conn = await oracledb.getConnection(dbConfig);
//
//         const sortType = req.query.sortType;
//         let orderByClause = '';
//
//         if (sortType === 'latest') {
//             orderByClause = 'ORDER BY e.rg_date DESC';
//         } else if (sortType === 'sequential') {
//             orderByClause = 'ORDER BY e.ep_id';
//         }
//
//         const sql_query =
//             'SELECT t.novel_name, a.pen_name ' +
//             'FROM title t ' +
//             'JOIN novels n ON t.novel_id = n.novel_id ' +
//             'JOIN authors a ON n.author_id = a.author_id';
//
//         const sql_query2 =
//             'SELECT ' +
//             't.novel_name AS title, ' +
//             't.novel_id, ' +
//             'e.ep_title AS episode_title, ' +
//             'a.pen_name AS author_pen_name ' +
//             'FROM ' +
//             'title t ' +
//             'JOIN ' +
//             'novels n ON t.novel_id = n.novel_id ' +
//             'LEFT JOIN ' +
//             'episode e ON t.novel_id = e.novel_id ' +
//             'LEFT JOIN ' +
//             'authors a ON n.author_id = a.author_id ' +
//             `WHERE t.novel_id = ${novelId} ${orderByClause}`;
//
//         const result = await conn.execute(sql_query);
//         const result1 = await conn.execute(sql_query2);
//
//         res.json({
//             novel: result1.rows,
//             main: result.rows
//         });
//     } catch (error) {
//         console.error('Error in /am_episode/sort:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     } finally {
//         if (conn) {
//             await conn.close();
//         }
//     }
// });
module.exports = router;