/**
 * Enhanced 4D Projections and Rotations
 * 
 * Provides mathematically rigorous SO(4) rotations using double quaternions
 * and improved projection methods for 4D polytopes.
 * 
 * Based on Coxeter group theory and quaternion algebra.
 */

export interface Quaternion {
  w: number;
  x: number;
  y: number;
  z: number;
}

export interface Point4D {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export class EnhancedProjections {
  
  /**
   * Normalize a quaternion to unit length
   */
  static normalizeQuaternion(q: Quaternion): Quaternion {
    const magnitude = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
    if (magnitude < 1e-10) {
      return { w: 1, x: 0, y: 0, z: 0 };
    }
    return {
      w: q.w / magnitude,
      x: q.x / magnitude,
      y: q.y / magnitude,
      z: q.z / magnitude
    };
  }

  /**
   * Multiply two quaternions
   */
  static multiplyQuaternions(q1: Quaternion, q2: Quaternion): Quaternion {
    return {
      w: q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
      x: q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
      y: q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
      z: q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w
    };
  }

  /**
   * Quaternion conjugate
   */
  static conjugateQuaternion(q: Quaternion): Quaternion {
    return { w: q.w, x: -q.x, y: -q.y, z: -q.z };
  }

  /**
   * SO(4) rotation using double quaternion representation
   * Any rotation in SO(4) can be expressed as: p' = q1 * p * q2^(-1)
   * where q1, q2 are unit quaternions
   * 
   * @param point - 4D point to rotate
   * @param q1 - Left quaternion
   * @param q2 - Right quaternion
   * @returns Rotated 4D point
   */
  static rotateSO4(point: Point4D, q1: Quaternion, q2: Quaternion): Point4D {
    const q1Norm = this.normalizeQuaternion(q1);
    const q2Norm = this.normalizeQuaternion(q2);
    const q2Inv = this.conjugateQuaternion(q2Norm);

    const p: Quaternion = { w: point.w, x: point.x, y: point.y, z: point.z };
    
    const temp = this.multiplyQuaternions(q1Norm, p);
    const result = this.multiplyQuaternions(temp, q2Inv);

    return {
      w: result.w,
      x: result.x,
      y: result.y,
      z: result.z
    };
  }

  /**
   * Create a simple rotation quaternion from axis-angle
   */
  static fromAxisAngle(axis: { x: number; y: number; z: number }, angle: number): Quaternion {
    const halfAngle = angle / 2;
    const sinHalf = Math.sin(halfAngle);
    const magnitude = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
    
    if (magnitude < 1e-10) {
      return { w: 1, x: 0, y: 0, z: 0 };
    }

    return {
      w: Math.cos(halfAngle),
      x: (axis.x / magnitude) * sinHalf,
      y: (axis.y / magnitude) * sinHalf,
      z: (axis.z / magnitude) * sinHalf
    };
  }

  /**
   * Stereographic projection from S³ to R³
   * Projects from north pole (0,0,0,1)
   * 
   * Handles singularity at w=1 by using small epsilon
   */
  static stereographicProjection(point: Point4D): Point3D {
    const epsilon = 1e-8;
    const denominator = 1 - point.w;
    
    if (Math.abs(denominator) < epsilon) {
      const scale = 1000;
      return {
        x: point.x * scale,
        y: point.y * scale,
        z: point.z * scale
      };
    }

    return {
      x: point.x / denominator,
      y: point.y / denominator,
      z: point.z / denominator
    };
  }

  /**
   * Perspective projection from 4D to 3D
   * Simulates a camera at distance wc in the 4th dimension
   */
  static perspectiveProjection(point: Point4D, wc: number = 2.0): Point3D {
    const denominator = wc - point.w;
    
    if (Math.abs(denominator) < 1e-8) {
      return { x: point.x, y: point.y, z: point.z };
    }

    const scale = 1 / denominator;
    return {
      x: point.x * scale,
      y: point.y * scale,
      z: point.z * scale
    };
  }

  /**
   * Simple orthographic projection (drop w coordinate)
   */
  static orthographicProjection(point: Point4D): Point3D {
    return {
      x: point.x,
      y: point.y,
      z: point.z
    };
  }

  /**
   * Smooth rotation animation for 4D objects
   * Creates time-varying double quaternions for continuous rotation
   * 
   * @param time - Animation time parameter
   * @param speed1 - Speed of first quaternion rotation
   * @param speed2 - Speed of second quaternion rotation
   * @returns Pair of quaternions for SO(4) rotation
   */
  static animatedRotation(time: number, speed1: number = 1.0, speed2: number = 0.7): [Quaternion, Quaternion] {
    const angle1 = time * speed1;
    const angle2 = time * speed2;

    const q1 = this.fromAxisAngle({ x: 1, y: 0, z: 0 }, angle1);
    const q2 = this.fromAxisAngle({ x: 0, y: 1, z: 0 }, angle2);

    return [q1, q2];
  }

  /**
   * Apply SO(4) rotation and then project to 3D
   * This is the main utility function for 4D polytopes
   * 
   * @param point - Original 4D point
   * @param q1 - Left rotation quaternion
   * @param q2 - Right rotation quaternion
   * @param projectionType - Type of projection to use
   * @param projectionParam - Parameter for projection (e.g., camera distance)
   * @returns Final 3D point
   */
  static rotateAndProject(
    point: Point4D,
    q1: Quaternion,
    q2: Quaternion,
    projectionType: 'stereographic' | 'perspective' | 'orthographic' = 'stereographic',
    projectionParam: number = 2.0
  ): Point3D {
    const rotated = this.rotateSO4(point, q1, q2);

    switch (projectionType) {
      case 'stereographic':
        return this.stereographicProjection(rotated);
      case 'perspective':
        return this.perspectiveProjection(rotated, projectionParam);
      case 'orthographic':
        return this.orthographicProjection(rotated);
      default:
        return this.orthographicProjection(rotated);
    }
  }
}

/**
 * Golden ratio - fundamental constant for 4D polytopes
 */
export const PHI = (1 + Math.sqrt(5)) / 2;

/**
 * Silver ratio
 */
export const SILVER_RATIO = 1 + Math.sqrt(2);

/**
 * Plastic number
 */
export const PLASTIC_NUMBER = 1.3247179572;
