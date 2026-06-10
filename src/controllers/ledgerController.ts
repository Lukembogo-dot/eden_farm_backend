import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

// GET /api/ledger
export const getLedger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const farmId = 'a0000000-0000-0000-0000-000000000001';

    // Debug: test raw query without filter
    const { data: allData, error: allError } = await supabase
      .from('ledger')
      .select('*')
      .limit(5);

    console.log('RAW QUERY (no filter):', allData, allError);

    // Debug: test with farm filter
    const { data: filteredData, error: filteredError } = await supabase
      .from('ledger')
      .select('*')
      .eq('farm_id', farmId)
      .limit(5);

    console.log('FILTERED QUERY:', filteredData, filteredError);

    res.json({
      debug: {
        raw: { count: allData?.length, error: allError, sample: allData?.[0] },
        filtered: { count: filteredData?.length, error: filteredError }
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/ledger/summary
export const getLedgerSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const farmId = 'a0000000-0000-0000-0000-000000000001';

    const { data, error } = await supabase
      .from('ledger')
      .select('category, amount, entry_type')
      .eq('farm_id', farmId);

    if (error) throw error;

    const summary: Record<string, number> = {};
    let totalExpenses = 0;
    let totalIncome = 0;

    data.forEach((entry) => {
      if (entry.entry_type === 'income') {
        totalIncome += entry.amount;
      } else {
        totalExpenses += entry.amount;
        summary[entry.category] = (summary[entry.category] || 0) + entry.amount;
      }
    });

    res.json({
      success: true,
      data: {
        totalExpenses,
        totalIncome,
        netPosition: totalIncome - totalExpenses,
        byCategory: summary,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/ledger
export const createLedgerEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const farmId = 'a0000000-0000-0000-0000-000000000001';
    const { entry_date, description, category, amount, entry_type, reference, notes } = req.body;

    if (!entry_date || !description || !category || !amount) {
      res.status(400).json({ success: false, error: 'entry_date, description, category and amount are required' });
      return;
    }

    const { data, error } = await supabase
      .from('ledger')
      .insert([{ farm_id: farmId, entry_date, description, category, amount, entry_type: entry_type || 'expense', reference, notes }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/ledger/:id
export const deleteLedgerEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('ledger').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    next(err);
  }
};