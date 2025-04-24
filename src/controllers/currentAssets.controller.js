import { getConnection } from '../database/connection.js';

export const getData = async (req, res) => {
    const { cik } = req.query;

    const currentAssets = [
        "CurrentAssets", "AssetsCurrent"
    ];

    if (!cik) {
        return res.status(400).json({ message: "Missing cik parameter" });
    }

    try {
        const connection = await getConnection();

        const [rows] = await connection.execute(
            `WITH ranked_data AS (
                SELECT 
                    n.value, 
                    n.tag, 
                    n.ddate, 
                    s.cik, 
                    EXTRACT(YEAR FROM n.ddate) AS year,
                    ROW_NUMBER() OVER (
                        PARTITION BY EXTRACT(YEAR FROM n.ddate)
                        ORDER BY n.value DESC
                    ) AS rn
                FROM cik_ticker AS ct
                JOIN sub AS s ON ct.cik = s.cik
                JOIN num AS n ON s.adsh = n.adsh
                WHERE n.tag IN (${currentAssets.map(() => '?').join(', ')})
                    AND ct.cik = ?
                    AND s.form = '10-K'
                    AND (n.ddate LIKE '%2022%' OR n.ddate LIKE '%2023%' OR n.ddate LIKE '%2024%')
                    AND n.dimh = '0x00000000'
            )
            SELECT value, tag, ddate, cik, year 
            FROM ranked_data 
            WHERE rn = 1
            ORDER BY year ASC`,
            [...currentAssets, cik]
        );

        if (rows.length > 0) {
            const result = rows.map(row => ({
                year: row.year,
                value: row.value,
                ddate: row.ddate,
                tag: row.tag,
                cik: row.cik
            }));

            return res.json(result);
        } else {
            return res.status(404).json({ message: "No data found" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
