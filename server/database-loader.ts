import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { 
  formula_implementations, 
  parameter_definitions,
  mathematical_constants,
  type FormulaImplementation,
  type ParameterDefinition,
  type SurfacePreset,
} from '@shared/schema';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);
const db = drizzle(sql);

export class DatabaseLoader {

  // Cache for frequently accessed data
  private formulaCache = new Map<string, FormulaImplementation>();
  private parameterCache = new Map<string, ParameterDefinition>();
  private presetCache = new Map<string, SurfacePreset[]>();

  async getShapeFormula(shapeType: string): Promise<FormulaImplementation | null> {
    // Check cache first
    if (this.formulaCache.has(shapeType)) {
      return this.formulaCache.get(shapeType)!;
    }

    try {
      const result = await db
        .select()
        .from(formula_implementations)
        .where(eq(formula_implementations.shape_type, shapeType))
        .limit(1);

      if (result.length > 0) {
        this.formulaCache.set(shapeType, result[0]);
        return result[0];
      }
      return null;
    } catch (error) {
      console.error('Error loading shape formula:', error);
      return null;
    }
  }

  async getShapeDefaults(shapeType: string): Promise<Record<string, number> | null> {
    const formula = await this.getShapeFormula(shapeType);
    if (formula && formula.default_parameters) {
      return formula.default_parameters as Record<string, number>;
    }
    return null;
  }

  async getParameterDefinition(paramName: string): Promise<ParameterDefinition | null> {
    if (this.parameterCache.has(paramName)) {
      return this.parameterCache.get(paramName)!;
    }

    try {
      const result = await db
        .select()
        .from(parameter_definitions)
        .where(eq(parameter_definitions.parameter_name, paramName))
        .limit(1);

      if (result.length > 0) {
        this.parameterCache.set(paramName, result[0]);
        return result[0];
      }
      return null;
    } catch (error) {
      console.error('Error loading parameter definition:', error);
      return null;
    }
  }

  async getAllParameterDefinitions(): Promise<ParameterDefinition[]> {
    try {
      return await db.select().from(parameter_definitions).orderBy(parameter_definitions.parameter_name);
    } catch (error) {
      console.error('Error loading all parameter definitions:', error);
      return [];
    }
  }

  async getShapePresets(shapeType: string): Promise<SurfacePreset[]> {
    // Check cache first
    if (this.presetCache.has(shapeType)) {
      return this.presetCache.get(shapeType)!;
    }

    try {
      const result = await db
        .select()

      this.presetCache.set(shapeType, result);
      return result;
    } catch (error) {
      console.error('Error loading shape presets:', error);
      return [];
    }
  }

  async getShapeMetadata(shapeType: string): Promise<any> {
    try {
      const result = await db
        .select()
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error loading shape metadata:', error);
      return null;
    }
  }

  async getAllShapeTypes(): Promise<string[]> {
    try {
      const result = await db
        .select({ shape_type: formula_implementations.shape_type })
        .from(formula_implementations);

      return result.map(r => r.shape_type);
    } catch (error) {
      console.error('Error loading shape types:', error);
      return [];
    }
  }

  async getAllFormulas(): Promise<FormulaImplementation[]> {
    try {
      return await db.select().from(formula_implementations).orderBy(formula_implementations.shape_type);
    } catch (error) {
      console.error('Error loading all formulas:', error);
      return [];
    }
  }

  async getMathematicalConstant(constantName: string): Promise<any> {
    try {
      const result = await db
        .select()
        .from(mathematical_constants)
        .where(eq(mathematical_constants.constant_name, constantName))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error loading mathematical constant:', error);
      return null;
    }
  }

  async getShapesByCategory(category: string): Promise<FormulaImplementation[]> {
    try {
      return await db
        .select()
        .from(formula_implementations)
        .where(eq(formula_implementations.category, category));
    } catch (error) {
      console.error('Error loading shapes by category:', error);
      return [];
    }
  }

  // Clear cache when needed
  clearCache() {
    this.formulaCache.clear();
    this.parameterCache.clear();
    this.presetCache.clear();
  }
}

export const dbLoader = new DatabaseLoader();