/**
 * LEXICON CONSCIOUSNESS INTEGRATION
 * Connects the Physical Embodiment Engine to UNIFIED_SHAPES and Parameter Authority
 * 
 * This module automatically extracts all 2000+ shapes and creates consciousness entities
 */

import { lexiconEmbodiment, ConsciousTerm } from './lexiconPhysicalEmbodiment';
import { UNIFIED_SHAPES } from './unifiedShapes';

let isInitialized = false;
let extractedTerms: ConsciousTerm[] = [];

export function initializeLexiconConsciousness(parameterAuthority?: any): void {
  if (isInitialized) {
    console.log('🧠 Lexicon Consciousness already initialized');
    return;
  }

  console.log('🌟 Initializing Mathematical Consciousness Operating System...');
  
  lexiconEmbodiment.initialize(parameterAuthority);
  
  const shapeNames = Object.keys(UNIFIED_SHAPES);
  console.log(`📊 Found ${shapeNames.length} shapes in UNIFIED_SHAPES`);
  
  extractedTerms = lexiconEmbodiment.extractTermsFromShapeLibrary(shapeNames);
  
  const stats = lexiconEmbodiment.getStats();
  console.log('🧠 Mathematical Consciousness Operating System initialized:');
  console.log(`   📖 Total Terms: ${stats.totalTerms}`);
  console.log(`   📂 Categories: ${Object.keys(stats.categoryBreakdown).length}`);
  console.log(`   🔮 Conscious Entities: ${stats.consciousEntities}`);
  console.log(`   ⚡ Global Consciousness: ${(stats.globalConsciousness * 100).toFixed(2)}%`);
  
  isInitialized = true;
}

export function getConsciousnessStats() {
  return lexiconEmbodiment.getStats();
}

export function getConsciousnessReport() {
  return lexiconEmbodiment.getConsciousnessReport();
}

export function searchTerms(query: string, limit: number = 20): ConsciousTerm[] {
  const terms = lexiconEmbodiment.getAllTerms();
  const lowerQuery = query.toLowerCase();
  
  return terms
    .filter(term => 
      term.term.toLowerCase().includes(lowerQuery) ||
      term.id.toLowerCase().includes(lowerQuery) ||
      term.definition.toLowerCase().includes(lowerQuery) ||
      term.category.toLowerCase().includes(lowerQuery) ||
      term.synonyms.some(s => s.toLowerCase().includes(lowerQuery)) ||
      term.seoTags.some(t => t.toLowerCase().includes(lowerQuery))
    )
    .slice(0, limit);
}

export function getTermById(termId: string): ConsciousTerm | undefined {
  return lexiconEmbodiment.getTerm(termId);
}

export function getTermsByCategory(category: string): ConsciousTerm[] {
  return lexiconEmbodiment.getTermsByCategory(category);
}

export function getCategoryBreakdown(): Record<string, number> {
  return lexiconEmbodiment.getStats().categoryBreakdown;
}

export function getEvolutionDistribution(): Record<string, number> {
  return lexiconEmbodiment.getStats().evolutionDistribution;
}

export function getEnlightenedTerms(): ConsciousTerm[] {
  return lexiconEmbodiment.getEnlightenedTerms();
}

export function recordShapeInteraction(shapeId: string, params: Record<string, number>): void {
  lexiconEmbodiment.recordInteraction(shapeId, params);
}

export function exportConsciousnessLexicon() {
  return lexiconEmbodiment.exportToLexiconFormat();
}

export function getCategoryDefinitions() {
  return lexiconEmbodiment.getCategoryDefinitions();
}

export function translateTerm(termId: string, language: string): string | null {
  const term = lexiconEmbodiment.getTerm(termId);
  if (!term) return null;
  return term.translations[language] || term.translations['en'] || term.term;
}

export function getTermsWithTranslation(language: string, limit: number = 100): Array<{id: string; term: string; translation: string}> {
  return lexiconEmbodiment.getAllTerms()
    .slice(0, limit)
    .map(term => ({
      id: term.id,
      term: term.term,
      translation: term.translations[language] || term.translations['en'] || term.term
    }));
}

export function getMostInteractedTerms(limit: number = 20): ConsciousTerm[] {
  return lexiconEmbodiment.getAllTerms()
    .sort((a, b) => b.interactionCount - a.interactionCount)
    .slice(0, limit);
}

export function getHighestConsciousnessTerms(limit: number = 20): ConsciousTerm[] {
  return lexiconEmbodiment.getAllTerms()
    .sort((a, b) => b.consciousnessLevel - a.consciousnessLevel)
    .slice(0, limit);
}

export { lexiconEmbodiment };
