import { getConnection } from "../database/connection.js";

const totalSales = [
    "Revenue", "Revenues", "NetRevenues", "SalesRevenueNet", "SalesRevenueServicesNet", "SalesRevenueGoodsNet",
    "RevenueFromContractWithCustomerExcludingAssessedTax", "RevenueFromContractWithCustomerIncludingAssessedTax"
];

export const getMetrics = async (req, res) => {
    try {
        let { tag, ddate, form, ticker } = req.query;

        if (!tag || !ddate || !form || !ticker) {
            return res.status(400).json({ error: "tag, ddate, form ve ticker parametreleri gereklidir." });
        }

        ticker = `${ticker}\r`;

        const connection = await getConnection();

        const query = `
            SELECT * FROM num
            WHERE tag = ?
            AND ddate = ?
            AND adsh IN (
                SELECT adsh 
                FROM sub 
                WHERE form = ?
                AND cik = (
                    SELECT cik 
                    FROM cik_ticker 
                    WHERE ticker = ?
                )
            );
        `;

        const [rows] = await connection.query(query, [tag, ddate, form, ticker]);

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: "Sonuç bulunamadı." });
        }
    } catch (err) {
        console.error("Hata oluştu:", err);
        res.status(500).json({ error: "Bir hata oluştu." });
    }
};