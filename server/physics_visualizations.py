"""
Advanced Physics Integration Module
Selected advanced physics visualizations for educational interface
Returns JSON data for Three.js frontend rendering
"""

import numpy as np
import json
import math


def get_spacetime_data():
    """Return raw data for spacetime curvature visualization."""
    x_curve = np.linspace(-5, 5, 20)
    y_curve = np.linspace(-5, 5, 20)
    X_curve, Y_curve = np.meshgrid(x_curve, y_curve)
    
    G = 1
    M = 2
    r = np.sqrt(X_curve**2 + Y_curve**2 + 0.1)
    curvature = -G * M / r
    Z_curve = curvature * 0.5
    
    return {
        'x': X_curve.tolist(),
        'y': Y_curve.tolist(),
        'z': Z_curve.tolist(),
        'type': 'spacetime_curvature',
        'title': 'Spacetime Curvature - Einstein General Relativity',
        'description': 'Visualization of how mass curves spacetime according to general relativity'
    }


def get_time_dilation_data():
    """Return raw data for time dilation visualization."""
    distances = np.linspace(1, 10, 100)
    rs = 2
    time_dilation_gravity = np.sqrt(1 - rs/distances)
    time_dilation_gravity[distances <= rs] = 0
    
    velocities = np.linspace(0, 0.99, 100)
    gamma = 1 / np.sqrt(1 - velocities**2)
    
    return {
        'gravitational': {
            'distances': distances.tolist(),
            'dilation': time_dilation_gravity.tolist(),
            'schwarzschild_radius': rs
        },
        'velocity': {
            'velocities': velocities.tolist(),
            'gamma': gamma.tolist()
        },
        'type': 'time_dilation',
        'title': 'Time Dilation Effects in Relativity',
        'description': 'Gravitational and velocity-based time dilation from special and general relativity'
    }


def get_quantum_field_data():
    """Return raw data for quantum field visualization."""
    x = np.linspace(-5, 5, 50)
    y = np.linspace(-5, 5, 50)
    X, Y = np.meshgrid(x, y)
    
    np.random.seed(42)
    quantum_fluctuations = np.random.normal(0, 0.1, X.shape)
    R = np.sqrt(X**2 + Y**2)
    coherent_field = 0.3 * np.exp(-R**2/8) * np.sin(2*np.pi*R)
    Z = quantum_fluctuations + coherent_field
    
    return {
        'x': X.tolist(),
        'y': Y.tolist(),
        'z': Z.tolist(),
        'type': 'quantum_field',
        'title': 'Quantum Field Fluctuations in Vacuum',
        'description': 'Visualization of quantum vacuum fluctuations and virtual particle pairs'
    }


def get_schwarzschild_metric_data():
    """Return Schwarzschild metric tensor components for visualization."""
    r_values = np.linspace(2.1, 10, 50)
    rs = 2.0
    
    g_tt = 1 - rs / r_values
    g_rr = 1 / (1 - rs / r_values)
    
    return {
        'r': r_values.tolist(),
        'g_tt': g_tt.tolist(),
        'g_rr': g_rr.tolist(),
        'schwarzschild_radius': rs,
        'type': 'schwarzschild_metric',
        'title': 'Schwarzschild Metric Components',
        'description': 'Time and radial components of the Schwarzschild metric'
    }


def get_geodesic_paths():
    """Calculate geodesic paths around a massive object."""
    theta = np.linspace(0, 4*np.pi, 200)
    
    e = 0.5
    l = 4.0
    M = 1.0
    rs = 2 * M
    
    p = l**2 / M
    r = p / (1 + e * np.cos(theta))
    r = np.maximum(r, rs + 0.1)
    
    x = r * np.cos(theta)
    y = r * np.sin(theta)
    
    return {
        'x': x.tolist(),
        'y': y.tolist(),
        'r': r.tolist(),
        'theta': theta.tolist(),
        'eccentricity': e,
        'angular_momentum': l,
        'type': 'geodesic',
        'title': 'Geodesic Path Around Mass',
        'description': 'Particle trajectory following curved spacetime geodesic'
    }


def get_gravitational_waves_data():
    """Generate gravitational wave strain pattern."""
    t = np.linspace(0, 10, 500)
    
    f0 = 100
    f_dot = 10
    freq = f0 + f_dot * t
    
    amplitude = 1e-21 * (1 + 0.5 * t)
    
    h_plus = amplitude * np.cos(2 * np.pi * np.cumsum(freq) * (t[1] - t[0]))
    h_cross = amplitude * np.sin(2 * np.pi * np.cumsum(freq) * (t[1] - t[0]))
    
    return {
        't': t.tolist(),
        'h_plus': h_plus.tolist(),
        'h_cross': h_cross.tolist(),
        'frequency': freq.tolist(),
        'type': 'gravitational_waves',
        'title': 'Gravitational Wave Strain',
        'description': 'Plus and cross polarizations of gravitational waves from binary merger'
    }


def get_all_physics_data():
    """Get all physics visualization data."""
    return {
        'spacetime': get_spacetime_data(),
        'time_dilation': get_time_dilation_data(),
        'quantum_field': get_quantum_field_data(),
        'schwarzschild': get_schwarzschild_metric_data(),
        'geodesic': get_geodesic_paths(),
        'gravitational_waves': get_gravitational_waves_data()
    }


if __name__ == "__main__":
    print(json.dumps(get_all_physics_data(), indent=2))
