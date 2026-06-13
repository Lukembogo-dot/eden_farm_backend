import { Request, Response, NextFunction } from 'express';
import { salesRepository } from '../repositories/salesRepository';
import { Sale } from '../types/sales';

// GET /api/sales
export const getSales = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data, error } = await salesRepository.getAll();

    if (error) throw error;

    const totalRevenue = data.reduce((sum, s) => sum + s.total_amount, 0);

    res.json({ success: true, count: data.length, totalRevenue, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/sales
export const createSale = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sale_date, animal_id, species, quantity, weight_at_sale_kg, price_per_kg, price_per_head, total_amount, buyer_name, buyer_contact, sale_type, notes } = req.body as Sale;

    if (!sale_date || !species || !total_amount) {
      res.status(400).json({ success: false, error: 'sale_date, species and total_amount are required' });
      return;
    }

    // Record the sale
    const { data: sale, error: saleError } = await salesRepository.create({
      farm_id: 'a0000000-0000-0000-0000-000000000001',
      sale_date,
      animal_id,
      species,
      quantity,
      weight_at_sale_kg,
      price_per_kg,
      price_per_head,
      total_amount,
      buyer_name,
      buyer_contact,
      sale_type,
      notes,
    } as Sale);

    if (saleError) throw saleError;

    // Also record income in ledger automatically
    await salesRepository.createLedgerEntry({
      farm_id: 'a0000000-0000-0000-0000-000000000001',
      entry_date: sale_date,
      description: `Sale of ${quantity || 1} ${species} to ${buyer_name || 'buyer'}`,
      category: 'Sale / Income',
      amount: total_amount,
      entry_type: 'income',
    });

    // Update animal status to sold if animal_id provided
    if (animal_id) {
      await salesRepository.markAnimalSold(animal_id);
    }

    res.status(201).json({ success: true, data: sale });
  } catch (err) {
    next(err);
  }
};