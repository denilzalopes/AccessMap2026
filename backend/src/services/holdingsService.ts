import pool from '../db/pool';
import { Holdings, PortfolioSnapshot } from '../types/domain';
import { AppError } from '../middleware/errorHandler';

export async function getHoldings(investorId: string): Promise<Holdings> {
  const result = await pool.query(
    `SELECT
       h.investor_id,
       w.xrpl_address       AS "walletAddress",
       h.token_balance       AS "tokenBalance",
       h.gold_grams          AS "goldGrams",
       gp.price_per_gram_eur AS "pricePerGramEur",
       (h.gold_grams * gp.price_per_gram_eur) AS "currentValueEur",
       h.last_updated        AS "lastUpdated"
     FROM holdings h
     JOIN wallets w ON w.id = h.wallet_id
     LEFT JOIN gold_prices gp ON gp.price_date = CURRENT_DATE
     WHERE h.investor_id = $1`,
    [investorId],
  );

  if (!result.rowCount) {
    throw new AppError(404, 'Holdings not found for this investor');
  }

  return result.rows[0] as Holdings;
}

export async function getHistory(investorId: string, days: number): Promise<PortfolioSnapshot[]> {
  const result = await pool.query(
    `SELECT
       snapshot_date::text AS "snapshotDate",
       token_balance       AS "tokenBalance",
       portfolio_value_eur AS "portfolioValueEur"
     FROM holdings_history
     WHERE investor_id = $1
       AND snapshot_date >= CURRENT_DATE - ($2 || ' days')::INTERVAL
     ORDER BY snapshot_date ASC`,
    [investorId, days],
  );

  return result.rows as PortfolioSnapshot[];
}
