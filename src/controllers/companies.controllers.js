import { getConnection } from "../database/connection.js";

export const getCompanies = async (req, res) => {
    try {
        const connection = await getConnection();

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const search = req.query.search?.trim(); // Trim boşlukları temizle
        let query;
        let countQuery;
        let queryParams = [];
        let countParams = [];

        if (search && search !== "") {
           const searchWildcard = `%${search}%`;

            query = `
                SELECT
                    ct.cik,
                    MAX(ct.ticker) AS ticker,
                    MAX(s.name) AS name
                FROM cik_ticker AS ct
                JOIN sub AS s ON s.cik = ct.cik
                WHERE s.name LIKE ? OR ct.ticker LIKE ? OR ct.cik LIKE ?
                GROUP BY ct.cik
                ORDER BY ticker ASC
                LIMIT ? OFFSET ?;
            `;

            countQuery = `
                SELECT COUNT(*) AS total FROM (
                    SELECT ct.cik
                    FROM cik_ticker AS ct
                    JOIN sub AS s ON s.cik = ct.cik
                    WHERE s.name LIKE ? OR ct.ticker LIKE ? OR ct.cik LIKE ?
                    GROUP BY ct.cik
                ) AS counted;
            `;

            queryParams = [searchWildcard, searchWildcard, searchWildcard, limit, offset];
            countParams = [searchWildcard, searchWildcard, searchWildcard];
        } else {
            query = `
                SELECT
                    ct.cik,
                    MAX(ct.ticker) AS ticker,
                    MAX(s.name) AS name
                FROM cik_ticker AS ct
                JOIN sub AS s ON s.cik = ct.cik
                GROUP BY ct.cik
                ORDER BY ticker ASC
                LIMIT ? OFFSET ?;
            `;

            countQuery = `
                SELECT COUNT(*) AS total FROM (
                    SELECT ct.cik
                    FROM cik_ticker AS ct
                    JOIN sub AS s ON s.cik = ct.cik
                    GROUP BY ct.cik
                ) AS counted;
            `;

            queryParams = [limit, offset];
        }

        // Toplam kayıt sayısını al
        const [countRows] = await connection.query(countQuery, countParams);
        const total = countRows[0]?.total || 0;

        // Verileri al
        const [rows] = await connection.query(query, queryParams);

        if (rows.length > 0) {
            res.status(200).json({
                data: rows,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } else {
            res.status(200).json({
                message: "No data available.",
                data: [],
                pagination: {
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                },
            });
        }
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "An error occurred." });
    }
};