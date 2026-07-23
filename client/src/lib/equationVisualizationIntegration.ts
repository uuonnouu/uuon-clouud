
/**
 * EQUATION VISUALIZATION INTEGRATION
 * Connects universal equation solver results to the 3D rendering system
 */

export class EquationVisualizationIntegration {
  private static instance: EquationVisualizationIntegration;
  
  static getInstance(): EquationVisualizationIntegration {
    if (!EquationVisualizationIntegration.instance) {
      EquationVisualizationIntegration.instance = new EquationVisualizationIntegration();
    }
    return EquationVisualizationIntegration.instance;
  }

  initialize() {
    // Listen for equation solver results
    window.addEventListener('equationSolved', this.handleEquationSolution.bind(this));
    console.log('🔗 Equation visualization integration initialized');
  }

  private handleEquationSolution(event: CustomEvent) {
    const { equation, variables, result } = event.detail;
    console.log('🎯 Integrating equation solution into 3D visualization:', equation);

    // Create 3D visualization based on equation type
    if (result.visualizationData) {
      this.create3DVisualization(result.visualizationData, equation, variables);
    }

    // Highlight solution points
    if (result.solutions && result.solutions.length > 0) {
      this.highlightSolutionPoints(result.solutions, variables);
    }

    // Update parameter controls if applicable
    this.updateParameterControls(equation, result);
  }

  private create3DVisualization(vizData: any, equation: string, variables: string[]) {
    switch (vizData.type) {
      case 'function_plot':
        this.createFunctionPlot(vizData, equation);
        break;
      
      case 'polynomial_surface':
        this.createPolynomialSurface(vizData, equation, variables);
        break;
        
      case 'differential_equation':
        this.createTrajectoryVisualization(vizData, equation);
        break;
        
      case 'linear_system':
        this.createLinearSystemVisualization(vizData);
        break;
    }
  }

  private createFunctionPlot(vizData: any, equation: string) {
    // Convert 2D function plot to 3D surface
    const surfaceParams = {
      shape: 'custom_equation_surface',
      equation: equation,
      a: 1, b: 1, c: 0, d: 0,
      uMin: -10, uMax: 10,
      vMin: -5, vMax: 5,
      // Add function plot data as custom surface
      customData: vizData.points
    };

    // Dispatch to main parameter system
    window.dispatchEvent(new CustomEvent('parameterChange', {
      detail: surfaceParams
    }));

    console.log('📈 Created function plot surface for:', equation);
  }

  private createPolynomialSurface(vizData: any, equation: string, variables: string[]) {
    if (variables.length === 2) {
      // 3D surface for f(x,y) = 0
      const surfaceParams = {
        shape: 'polynomial_surface',
        equation: equation,
        variables: variables,
        a: 5, b: 5, c: 0, d: 0,
        uMin: -5, uMax: 5,
        vMin: -5, vMax: 5,
        customSurfaceData: vizData.surfaceData
      };

      window.dispatchEvent(new CustomEvent('parameterChange', {
        detail: surfaceParams
      }));
    }

    console.log('🏔️ Created polynomial surface for:', equation);
  }

  private createTrajectoryVisualization(vizData: any, equation: string) {
    // Create particle trail visualization for differential equation solutions
    const trajectoryParams = {
      shape: 'differential_trajectory',
      equation: equation,
      a: 2, b: 1, c: 0, d: 0,
      enableTrails: true,
      enableParticles: true,
      particleCount: 50,
      customTrajectory: vizData.trajectory
    };

    window.dispatchEvent(new CustomEvent('parameterChange', {
      detail: trajectoryParams
    }));

    console.log('🌊 Created trajectory visualization for:', equation);
  }

  private createLinearSystemVisualization(vizData: any) {
    // Visualize linear system as intersecting planes
    console.log('📐 Created linear system visualization');
    
    // For now, use a simple plane representation
    window.dispatchEvent(new CustomEvent('parameterChange', {
      detail: {
        shape: 'plane',
        a: 5, b: 5, c: 0, d: 0
      }
    }));
  }

  private highlightSolutionPoints(solutions: any[], variables: string[]) {
    // Add glowing spheres at solution points
    solutions.forEach((solution, index) => {
      if (typeof solution === 'number' && variables.length === 1) {
        // Single variable - place sphere on x-axis
        this.addSolutionMarker({
          x: solution,
          y: 0,
          z: 0,
          color: 0x00ff00 // Green for solutions
        });
      }
    });

    console.log(`✨ Highlighted ${solutions.length} solution points`);
  }

  private addSolutionMarker(position: {x: number, y: number, z: number, color: number}) {
    // This would integrate with the Three.js scene to add solution markers
    window.dispatchEvent(new CustomEvent('addSolutionMarker', {
      detail: position
    }));
  }

  private updateParameterControls(equation: string, result: any) {
    // Update UI to show equation-specific parameters
    const equationParams = this.extractParametersFromEquation(equation);
    
    if (equationParams.length > 0) {
      window.dispatchEvent(new CustomEvent('updateEquationParameters', {
        detail: {
          equation,
          parameters: equationParams,
          solutions: result.solutions
        }
      }));
    }
  }

  private extractParametersFromEquation(equation: string): string[] {
    // Extract parameter names from equation (a, b, c, etc.)
    const matches = equation.match(/[a-z]/g);
    const variables = ['x', 'y', 'z', 't']; // Common variables to exclude
    
    return matches 
      ? matches.filter(char => !variables.includes(char))
      : [];
  }
}

// Initialize integration
export const equationVisualizationIntegration = EquationVisualizationIntegration.getInstance();

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  equationVisualizationIntegration.initialize();
}
