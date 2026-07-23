/**
 * Multidimensional Complex Number System
 * Based on the mathematical framework by Kuan Peng (彭宽)
 * 
 * Reference: "Extending complex number to spaces with 3, 4 or any number of dimensions"
 * Author: Kuan Peng (彭宽) - titang78@gmail.com
 * Published: February 16, 2022
 * Source: https://pengkuanonmaths.blogspot.com/2022/02/extending-complex-number-to-spaces-with.html
 * 
 * This implementation extends classical 2D complex numbers to 3D, 4D, and higher dimensions
 * with proper algebraic operations that maintain geometrical meaning.
 */

/**
 * 3D Complex Number Class
 * Represents a complex number in 3D space with modulus r and angles θi, θj
 * Can be converted between polar (r, θi, θj) and Cartesian (h, i, j) forms
 */
export class Complex3D {
  r: number;      // modulus
  thetaI: number; // angle in i direction
  thetaJ: number; // angle in j direction

  constructor(modulus: number, thetaI: number, thetaJ: number) {
    this.r = modulus;
    this.thetaI = thetaI;
    this.thetaJ = thetaJ;
  }

  /**
   * Convert from polar to Cartesian coordinates
   * h = r * cos(θi) * cos(θj)
   * i = r * sin(θi) * cos(θj)
   * j = r * sin(θj)
   */
  toCartesian(): { h: number; i: number; j: number } {
    const cosJ = Math.cos(this.thetaJ);
    return {
      h: this.r * Math.cos(this.thetaI) * cosJ,
      i: this.r * Math.sin(this.thetaI) * cosJ,
      j: this.r * Math.sin(this.thetaJ)
    };
  }

  /**
   * Create 3D complex number from Cartesian coordinates
   */
  static fromCartesian(h: number, i: number, j: number): Complex3D {
    const r = Math.sqrt(h * h + i * i + j * j);
    
    if (r === 0) return new Complex3D(0, 0, 0);
    
    const thetaJ = Math.asin(Math.max(-1, Math.min(1, j / r)));
    const cosJ = Math.cos(thetaJ);
    const thetaI = cosJ !== 0 ? Math.atan2(i / cosJ, h / cosJ) : 0;
    
    return new Complex3D(r, thetaI, thetaJ);
  }

  /**
   * Multiplication: v1 * v2 = r1*r2 * e^(i(θi1+θi2)) * e^(j(θj1+θj2))
   */
  multiply(other: Complex3D): Complex3D {
    return new Complex3D(
      this.r * other.r,
      this.thetaI + other.thetaI,
      this.thetaJ + other.thetaJ
    );
  }

  /**
   * Addition in Cartesian form
   */
  add(other: Complex3D): Complex3D {
    const c1 = this.toCartesian();
    const c2 = other.toCartesian();
    return Complex3D.fromCartesian(
      c1.h + c2.h,
      c1.i + c2.i,
      c1.j + c2.j
    );
  }

  /**
   * Subtraction in Cartesian form
   */
  subtract(other: Complex3D): Complex3D {
    const c1 = this.toCartesian();
    const c2 = other.toCartesian();
    return Complex3D.fromCartesian(
      c1.h - c2.h,
      c1.i - c2.i,
      c1.j - c2.j
    );
  }

  /**
   * Square: v^2 = v * v
   */
  square(): Complex3D {
    return this.multiply(this);
  }

  /**
   * Cube: v^3 = v * v * v
   */
  cube(): Complex3D {
    return this.multiply(this).multiply(this);
  }

  /**
   * Power: v^n
   */
  power(n: number): Complex3D {
    return new Complex3D(
      Math.pow(this.r, n),
      this.thetaI * n,
      this.thetaJ * n
    );
  }

  /**
   * Modulus (magnitude)
   */
  modulus(): number {
    return this.r;
  }

  /**
   * Conjugate
   */
  conjugate(): Complex3D {
    return new Complex3D(this.r, -this.thetaI, -this.thetaJ);
  }

  /**
   * Clone
   */
  clone(): Complex3D {
    return new Complex3D(this.r, this.thetaI, this.thetaJ);
  }
}

/**
 * 4D Complex Number Class
 * Extends 3D complex numbers with additional dimension k
 */
export class Complex4D {
  r: number;      // modulus
  thetaI: number; // angle in i direction
  thetaJ: number; // angle in j direction
  thetaK: number; // angle in k direction

  constructor(modulus: number, thetaI: number, thetaJ: number, thetaK: number) {
    this.r = modulus;
    this.thetaI = thetaI;
    this.thetaJ = thetaJ;
    this.thetaK = thetaK;
  }

  /**
   * Convert to Cartesian coordinates
   */
  toCartesian(): { h: number; i: number; j: number; k: number } {
    const cosK = Math.cos(this.thetaK);
    const cosJ = Math.cos(this.thetaJ);
    
    return {
      h: this.r * Math.cos(this.thetaI) * cosJ * cosK,
      i: this.r * Math.sin(this.thetaI) * cosJ * cosK,
      j: this.r * Math.sin(this.thetaJ) * cosK,
      k: this.r * Math.sin(this.thetaK)
    };
  }

  /**
   * Create from Cartesian coordinates
   */
  static fromCartesian(h: number, i: number, j: number, k: number): Complex4D {
    const r = Math.sqrt(h * h + i * i + j * j + k * k);
    
    if (r === 0) return new Complex4D(0, 0, 0, 0);
    
    const thetaK = Math.asin(Math.max(-1, Math.min(1, k / r)));
    const cosK = Math.cos(thetaK);
    const thetaJ = cosK !== 0 ? Math.asin(Math.max(-1, Math.min(1, j / (r * cosK)))) : 0;
    const cosJ = Math.cos(thetaJ);
    const thetaI = (cosK !== 0 && cosJ !== 0) ? Math.atan2(i / (cosJ * cosK), h / (cosJ * cosK)) : 0;
    
    return new Complex4D(r, thetaI, thetaJ, thetaK);
  }

  /**
   * Multiplication
   */
  multiply(other: Complex4D): Complex4D {
    return new Complex4D(
      this.r * other.r,
      this.thetaI + other.thetaI,
      this.thetaJ + other.thetaJ,
      this.thetaK + other.thetaK
    );
  }

  /**
   * Addition
   */
  add(other: Complex4D): Complex4D {
    const c1 = this.toCartesian();
    const c2 = other.toCartesian();
    return Complex4D.fromCartesian(
      c1.h + c2.h,
      c1.i + c2.i,
      c1.j + c2.j,
      c1.k + c2.k
    );
  }

  /**
   * Square
   */
  square(): Complex4D {
    return this.multiply(this);
  }

  /**
   * Cube
   */
  cube(): Complex4D {
    return this.multiply(this).multiply(this);
  }

  /**
   * Power
   */
  power(n: number): Complex4D {
    return new Complex4D(
      Math.pow(this.r, n),
      this.thetaI * n,
      this.thetaJ * n,
      this.thetaK * n
    );
  }

  /**
   * Modulus
   */
  modulus(): number {
    return this.r;
  }

  /**
   * Project to 3D space (discard k dimension)
   */
  projectTo3D(): Complex3D {
    const cart = this.toCartesian();
    return Complex3D.fromCartesian(cart.h, cart.i, cart.j);
  }
}

/**
 * Fractal iteration computation utilities
 */
export class FractalComputer {
  /**
   * Compute 3D Mandelbrot iteration: z(n+1) = z(n)^2 + c
   * Returns iteration count and escape status
   */
  static mandelbrot3D(
    c: Complex3D,
    maxIterations: number,
    bailoutRadius: number
  ): { iterations: number; escaped: boolean; finalModulus: number } {
    let z = new Complex3D(0, 0, 0);
    let iter = 0;
    
    while (iter < maxIterations && z.modulus() < bailoutRadius) {
      z = z.square().add(c);
      iter++;
    }
    
    return {
      iterations: iter,
      escaped: z.modulus() >= bailoutRadius,
      finalModulus: z.modulus()
    };
  }

  /**
   * Compute 3D Julia iteration: z(n+1) = z(n)^2 + c (with fixed c)
   */
  static julia3D(
    z0: Complex3D,
    c: Complex3D,
    maxIterations: number,
    bailoutRadius: number
  ): { iterations: number; escaped: boolean; finalModulus: number } {
    let z = z0;
    let iter = 0;
    
    while (iter < maxIterations && z.modulus() < bailoutRadius) {
      z = z.square().add(c);
      iter++;
    }
    
    return {
      iterations: iter,
      escaped: z.modulus() >= bailoutRadius,
      finalModulus: z.modulus()
    };
  }

  /**
   * Compute 3D Multibrot: z(n+1) = z(n)^power + c
   */
  static multibrot3D(
    z0: Complex3D,
    c: Complex3D,
    power: number,
    maxIterations: number,
    bailoutRadius: number
  ): { iterations: number; escaped: boolean; finalModulus: number } {
    let z = z0;
    let iter = 0;
    
    while (iter < maxIterations && z.modulus() < bailoutRadius) {
      z = z.power(power).add(c);
      iter++;
    }
    
    return {
      iterations: iter,
      escaped: z.modulus() >= bailoutRadius,
      finalModulus: z.modulus()
    };
  }

  /**
   * Compute 4D Mandelbrot iteration
   */
  static mandelbrot4D(
    c: Complex4D,
    maxIterations: number,
    bailoutRadius: number
  ): { iterations: number; escaped: boolean; finalModulus: number } {
    let z = new Complex4D(0, 0, 0, 0);
    let iter = 0;
    
    while (iter < maxIterations && z.modulus() < bailoutRadius) {
      z = z.square().add(c);
      iter++;
    }
    
    return {
      iterations: iter,
      escaped: z.modulus() >= bailoutRadius,
      finalModulus: z.modulus()
    };
  }
}
