import { Request, Response, NextFunction } from 'express';
import { ledgerRepository } from '../repositories/ledgerRepository';
import { LedgerEntry } from '../types/ledger';

// GET /api/ledger
export const getLedger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data: allData, error: allError } = await ledgerRepository.getAll();
    const { data: filteredData, error: filteredError } = await ledgerRepository.getByFarm();

    res.json({
      debug: {
        raw: { count: allData?.length ?? 0, error: allError, sample: allData?.[0] },
        filtered: { count: filteredData?.length ?? 0, error: filteredError, sample: filteredData?.[0] },
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/ledger/summary
export const getLedgerSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const summary = await ledgerRepository.getSummary();

    res.json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/ledger
export const createLedgerEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { entry_date, description, category, amount, entry_type, reference, notes } = req.body as LedgerEntry;

    if (!entry_date || !description || !category || amount === undefined || amount === null) {
      res.status(400).json({ success: false, error: 'entry_date, description, category and amount are required' });
      return;
    }

    const { data, error } = await ledgerRepository.create({
      farm_id: 'a0000000-0000-0000-0000-000000000001',
      entry_date,
      description,
      category,
      amount,
      entry_type,
      reference,
      notes,
    });

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/ledger/:id
export const deleteLedgerEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const { error } = await ledgerRepository.delete(id);
    if (error) throw error;

    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    next(err);
  }
};