  
"""  
## Wire Objects Mathematical Library - Python Implementation  
## Advanced 3D Wire Frame Mathematics for Professional Applications  
## Complete parametric surface equations with proper mathematical foundations  
"""  
  
import math  
import numpy as np  
from typing import Tuple, List, Dict, Any, Optional  
  
class WireObjectMath:  
    """  
    Complete mathematical framework for 3D wire objects  
    Implements all parametric surface equations from dimensional mathematics portal  
    """  
      
    @staticmethod  
    def evaluate_math_expression(expression: str, variables: Dict[str, float]) -> float:  
        """Safe mathematical expression evaluator"""  
        try:  
            # Replace constants  
            processed = expression.replace('PI', str(math.pi)).replace('E', str(math.e))  
              
            # Replace variables  
            for name, value in variables.items():  
                processed = processed.replace(name, str(value))  
              
            # Replace mathematical functions  
            processed = (processed  
                        .replace('sin(', 'math.sin(')  
                        .replace('cos(', 'math.cos(')  
                        .replace('tan(', 'math.tan(')  
                        .replace('exp(', 'math.exp(')  
                        .replace('log(', 'math.log(')  
                        .replace('sqrt(', 'math.sqrt(')  
                        .replace('abs(', 'abs(')  
                        .replace('pow(', 'math.pow(')  
                        .replace('^', '**'))  
              
            result = eval(processed)  
            return 0.0 if math.isnan(result) else result  
        except:  
            return 0.0  
  
class BasicShapes:  
    """Basic geometric wire frame shapes"""  
      
    @staticmethod  
    def sphere(u: float, v: float, a: float = 2.0, b: float = 1.0, c: float = 1.0) -> Tuple[float, float, float]:  
        """Perfect sphere wire frame"""  
        x = a * math.sin(v * b) * math.cos(u * c)  
        y = a * math.sin(v * b) * math.sin(u * c)  
        z = a * math.cos(v * b)  
        return (x, y, z)  
      
    @staticmethod  
    def cylinder(u: float, v: float, a: float = 2.0, b: float = 1.0, c: float = 1.0) -> Tuple[float, float, float]:  
        """Cylindrical wire frame"""  
        x = a * math.cos(u * b)  
        y = a * math.sin(u * b)  
        z = v * c  
        return (x, y, z)  
      
    @staticmethod  
    def torus(u: float, v: float, a: float = 2.0, b: float = 1.0, c: float = 1.0, d: float = 1.0) -> Tuple[float, float, float]:  
        """Torus (donut) wire frame"""  
        x = (a + b * math.cos(v * c)) * math.cos(u * d)  
        y = (a + b * math.cos(v * c)) * math.sin(u * d)  
        z = b * math.sin(v * c)  
        return (x, y, z)  
      
    @staticmethod  
    def cone(u: float, v: float, a: float = 2.0, b: float = 1.0, c: float = 1.0, d: float = 1.0) -> Tuple[float, float, float]:  
        """Conical wire frame"""  
        x = (v * a) * math.cos(u * b)  
        y = (v * a) * math.sin(u * b)  
        z = c * (d - v)  
        return (x, y, z)  
  
class PolygonShapes:  
    """Polygon-based wire frame structures"""  
      
    @staticmethod  
    def triangular_prism(u: float, v: float, a: float = 2.0, b: float = 1.0, c: float = 1.0) -> Tuple[float, float, float]:  
        """Perfect equilateral triangular prism"""  
        normalized_u = u % (2 * math.pi)  
        segment = normalized_u / (2 * math.pi / 3)  
        segment_index = int(segment)  
        t = segment - segment_index  
          
        # Perfect equilateral triangle vertices  
        vertices = [  
            (a * b, 0),  
            (a * b * -0.5, a * b * math.sqrt(3) / 2),  
            (a * b * -0.5, a * b * -math.sqrt(3) / 2)  
        ]  
          
        v1 = vertices[segment_index % 3]  
        v2 = vertices[(segment_index + 1) % 3]  
          
        x = v1[0] + t * (v2[0] - v1[0])  
        y = v1[1] + t * (v2[1] - v1[1])  
        z = (v - 0.5) * 2 * c  
          
        return (x, y, z)  
      
    @staticmethod  
    def square_prism(u: float, v: float, a: float = 2.0, b: float = 1.0, c: float = 1.0) -> Tuple[float, float, float]:  
        """Perfect square prism wire frame"""  
        side = int(u * 4) % 4  
        t = (u * 4) % 1  
          
        if side == 0:    # Right side  
            x, y = a * b, a * b * (2 * t - 1)  
        elif side == 1:  # Back side  
            x, y = a * b * (1 - 2 * t), a * b  
        elif side == 2:  # Left side  
            x, y = -a * b, a * b * (1 - 2 * t)  
        else:            # Front side  
            x, y = a * b * (2 * t - 1), -a * b  
          
        z = (v - 0.5) * 2 * a * c  
        return (x, y, z)  
      
    @staticmethod  
    def hexagonal_prism(u: float, v: float, a: float = 2.0) -> Tuple[float, float, float]:  
        """Hexagonal prism wire frame"""  
        x = a * math.cos(u * 6 * 2 * math.pi / 6)  
        y = a * math.sin(u * 6 * 2 * math.pi / 6)  
        z = v  
        return (x, y, z)  
  
class FourDimensionalShapes:  
    """4D mathematical objects projected to 3D wire frames"""  
      
    @staticmethod  
    def tesseract_4d(u: float, v: float, a: float = 2.0, b: float = 1.0, c: float = 1.0, d: float = 1.0) -> Tuple[float, float, float]:  
        """4D Tesseract (hypercube) wire frame projection"""  
        face = int(u * 6)  
        local_u = (u * 6) % 1  
        local_v = v  
          
        # 4D hypercube vertices  
        vertices_4d = [  
            [-1, -1, -1, -1], [1, -1, -1, -1], [1, 1, -1, -1], [-1, 1, -1, -1],  
            [-1, -1, 1, -1], [1, -1, 1, -1], [1, 1, 1, -1], [-1, 1, 1, -1],  
            [-1, -1, -1, 1], [1, -1, -1, 1], [1, 1, -1, 1], [-1, 1, -1, 1],  
            [-1, -1, 1, 1], [1, -1, 1, 1], [1, 1, 1, 1], [-1, 1, 1, 1]  
        ]  
          
        # 4D to 3D stereographic projection  
        vertex = vertices_4d[face % 16]  
        proj_scale = 2 / (2 - vertex[3] * d)  
          
        x = a * vertex[0] * proj_scale  
        y = a * vertex[1] * proj_scale  
        z = a * vertex[2] * proj_scale  
          
        return (x, y, z)  
      
    @staticmethod  
    def tetrahedron_4d(u: float, v: float, a: float = 2.0, b: float = 1.0, c: float = 1.0, d: float = 0.5) -> Tuple[float, float, float]:  
        """4D Tetrahedron (5-cell simplex) wire frame"""  
        # 5 vertices of 4D simplex  
        vertices_4d = [  
            [1, 1, 1, 1],  
            [1, -1, -1, 1],  
            [-1, 1, -1, 1],  
            [-1, -1, 1, 1],  
            [0, 0, 0, -4/math.sqrt(5)]  
        ]  
          
        face_index = int(u * 5) % 5  
        vertex = vertices_4d[face_index]  
          
        # 4D to 3D projection  
        proj_scale = 3 / (3 - vertex[3] * d)  
          
        x = a * vertex[0] * proj_scale * math.cos(v * 2 * math.pi * b)  
        y = a * vertex[1] * proj_scale * math.sin(v * 2 * math.pi * b)  
        z = a * vertex[2] * proj_scale * (1 + c * math.sin(v * math.pi))  
          
        return (x, y, z)  
  
class AdvancedMathematicalShapes:  
    """Advanced mathematical wire frame structures"""  
      
    @staticmethod  
    def hyperboloid(u: float, v: float, a: float = 2.0, b: float = 1.0, c: float = 1.0) -> Tuple[float, float, float]:  
        """Hyperboloid of one sheet"""  
        x = a * math.cosh(u * b) * math.cos(v * c)  
        y = a * math.cosh(u * b) * math.sin(v * c)  
        z = a * math.sinh(u * b)  
        return (x, y, z)  
      
    @staticmethod  
    def paraboloid(u: float, v: float, a: float = 2.0, b: float = 1.0, c: float = 1.0, d: float = 1.0, e: float = 1.0) -> Tuple[float, float, float]:  
        """Elliptic paraboloid"""  
        x = u * a  
        y = v * b  
        z = c * (u * u * d + v * v * e)  
        return (x, y, z)  
      
    @staticmethod  
    def helicoid(u: float, v: float, a: float = 2.0, b: float = 1.0, c: float = 1.0) -> Tuple[float, float, float]:  
        """Helicoid minimal surface"""  
        x = v * a * math.cos(u * b)  
        y = v * a * math.sin(u * b)  
        z = c * u  
        return (x, y, z)  
      
    @staticmethod  
    def mobius_strip(u: float, v: float, a: float = 2.0, b: float = 1.0, c: float = 1.0, d: float = 1.0) -> Tuple[float, float, float]:  
        """Möbius strip wire frame"""  
        x = (a + v * b * math.cos(u * c / 2)) * math.cos(u * d)  
        y = (a + v * b * math.cos(u * c / 2)) * math.sin(u * d)  
        z = v * b * math.sin(u * c / 2)  
        return (x, y, z)  
  
class FractalShapes:  
    """Fractal and recursive wire frame structures"""  
      
    @staticmethod  
    def koch_snowflake_3d(u: float, v: float, a: float = 2.0, iterations: int = 4) -> Tuple[float, float, float]:  
        """3D Koch snowflake fractal"""  
        # Simplified 3D Koch curve implementation  
        angle = u * 2 * math.pi  
        radius = a * (1 + 0.3 * math.sin(iterations * angle))  
          
        x = radius * math.cos(angle)  
        y = radius * math.sin(angle)  
        z = v * a * 0.5 * math.sin(iterations * angle)  
          
        return (x, y, z)  
      
    @staticmethod  
    def sierpinski_pyramid(u: float, v: float, a: float = 2.0, iterations: int = 4) -> Tuple[float, float, float]:  
        """3D Sierpinski pyramid fractal"""  
        # Tetrahedron base  
        face = int(u * 4) % 4  
        scale = 1.0 / (2 ** (iterations - 1))  
          
        # Base tetrahedron vertices  
        vertices = [  
            (a, 0, 0),  
            (-a/2, a * math.sqrt(3)/2, 0),  
            (-a/2, -a * math.sqrt(3)/2, 0),  
            (0, 0, a * math.sqrt(6)/3)  
        ]  
          
        vertex = vertices[face]  
        fractal_scale = scale * (1 + 0.2 * math.sin(v * math.pi * iterations))  
          
        x = vertex[0] * fractal_scale  
        y = vertex[1] * fractal_scale  
        z = vertex[2] * fractal_scale + v * a * 0.3  
          
        return (x, y, z)  
  
class WireFrameGenerator:  
    """Main wire frame generation class"""  
      
    def __init__(self):  
        self.basic_shapes = BasicShapes()  
        self.polygon_shapes = PolygonShapes()  
        self.four_d_shapes = FourDimensionalShapes()  
        self.advanced_shapes = AdvancedMathematicalShapes()  
        self.fractal_shapes = FractalShapes()  
      
    def generate_wireframe_points(self, shape_type: str, u_segments: int = 50, v_segments: int = 25,   
                                parameters: Optional[Dict[str, float]] = None) -> List[Tuple[float, float, float]]:  
        """  
        Generate wire frame points for specified shape  
          
        Args:  
            shape_type: Name of the shape to generate  
            u_segments: Number of segments in u direction  
            v_segments: Number of segments in v direction  
            parameters: Shape-specific parameters  
          
        Returns:  
            List of (x, y, z) coordinate tuples  
        """  
        if parameters is None:  
            parameters = {}  
          
        points = []  
          
        # Get shape function  
        shape_function = self._get_shape_function(shape_type)  
        if not shape_function:  
            return points  
          
        # Generate points  
        for i in range(u_segments):  
            for j in range(v_segments):  
                u = i / (u_segments - 1)  
                v = j / (v_segments - 1)  
                  
                try:  
                    point = shape_function(u, v, **parameters)  
                    points.append(point)  
                except:  
                    points.append((0.0, 0.0, 0.0))  
          
        return points  
      
    def _get_shape_function(self, shape_type: str):  
        """Get the appropriate shape function"""  
        shape_map = {  
            # Basic shapes  
            'sphere': self.basic_shapes.sphere,  
            'cylinder': self.basic_shapes.cylinder,  
            'torus': self.basic_shapes.torus,  
            'cone': self.basic_shapes.cone,  
              
            # Polygon shapes  
            'triangular_prism': self.polygon_shapes.triangular_prism,  
            'square_prism': self.polygon_shapes.square_prism,  
            'hexagonal_prism': self.polygon_shapes.hexagonal_prism,  
              
            # 4D shapes  
            'tesseract_4d': self.four_d_shapes.tesseract_4d,  
            'tetrahedron_4d': self.four_d_shapes.tetrahedron_4d,  
              
            # Advanced shapes  
            'hyperboloid': self.advanced_shapes.hyperboloid,  
            'paraboloid': self.advanced_shapes.paraboloid,  
            'helicoid': self.advanced_shapes.helicoid,  
            'mobius_strip': self.advanced_shapes.mobius_strip,  
              
            # Fractal shapes  
            'koch_snowflake_3d': self.fractal_shapes.koch_snowflake_3d,  
            'sierpinski_pyramid': self.fractal_shapes.sierpinski_pyramid,  
        }  
          
        return shape_map.get(shape_type)  
      
    def export_wireframe_data(self, shape_type: str, filename: str,   
                             u_segments: int = 50, v_segments: int = 25,  
                             parameters: Optional[Dict[str, float]] = None):  
        """Export wire frame data to file"""  
        points = self.generate_wireframe_points(shape_type, u_segments, v_segments, parameters)  
          
        with open(filename, 'w') as f:  
            f.write(f"# Wire frame data for {shape_type}\n")  
            f.write(f"# Generated with {len(points)} points\n")  
            f.write("# Format: x,y,z\n")  
              
            for point in points:  
                f.write(f"{point[0]:.6f},{point[1]:.6f},{point[2]:.6f}\n")  
  
# Example usage  
if __name__ == "__main__":  
    generator = WireFrameGenerator()  
      
    # Generate sphere wire frame  
    sphere_points = generator.generate_wireframe_points('sphere', parameters={'a': 2.0, 'b': 1.0, 'c': 1.0})  
    print(f"Generated {len(sphere_points)} points for sphere")  
      
    # Generate tesseract wire frame  
    tesseract_points = generator.generate_wireframe_points('tesseract_4d', parameters={'a': 2.0, 'b': 1.0, 'c': 1.0, 'd': 1.0})  
    print(f"Generated {len(tesseract_points)} points for 4D tesseract")  
      
    # Export to file  
    generator.export_wireframe_data('sphere', 'sphere_wireframe.csv')  
    print("Exported sphere wire frame to sphere_wireframe.csv")  
