import 'server-only';
import { cache } from 'react';
import { defaultContent } from '../data/default-content';
import { contentSchema } from './content-schema';
import { backendConfigured, publicDatabase } from './supabase';

export const getContent = cache(async () => {
  if (!backendConfigured()) return defaultContent;
  try {
    const { data, error } = await publicDatabase().from('portfolio_content').select('document').eq('id', 1).maybeSingle();
    if (error) throw error;
    if (!data) return defaultContent;
    return contentSchema.parse(data.document);
  } catch {
    console.error('Portfolio content could not be loaded; serving the bundled portfolio.');
    return defaultContent;
  }
});
