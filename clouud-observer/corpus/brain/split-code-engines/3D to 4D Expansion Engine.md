# 3D to 4D Expansion Engine  
  
## Here are the core mathematical formulas:  
## Key Formulas:  
## 3D Extrusion: (x, y) → (x, y, z) where u^2 = depth  
## 3D Perspective: x2d = (x3d × distance) / (z3d + distance)  
## 3D Rotation: Uses rotation matrices with cos/sin for X, Y, Z axes  
## 4D Hypercube: 16 vertices generated with nested loops (-1,1) combinations  
## 4D→3D Projection: x3d = (x4d × distance) / (w4d + distance)  
## 4D Rotation: 6 possible rotation planes (XY, XZ, XW, YZ, YW, ZW)  
## Pixel→Voxel: Convert each pixel to depth-layered 3D points  
## Complete Pipeline: 2D → 4D → rotate → project → 3D → project → 2D  
## The transform2DTo4D() function at the bottom combines everything into a single transformation pipeline that you can call with transform2DTo4D(imageData, width, height, time) to get screen coordinates for rendering.  
##   
  
  
// 2D to 3D Transformation Formulas  
  
// 1. 3D Extrusion (adding depth to 2D image)  
function extrude2Dto3D(x, y, depth) {  
    // Front face: (x, y, 0)  
    // Back face: (x, y, depth)  
    return {  
        front: { x: x, y: y, z: 0 },  
        back: { x: x, y: y, z: depth }  
    };  
}  
  
// 2. 3D Perspective Projection  
function project3DTo2D(x3d, y3d, z3d, viewerDistance) {  
    // Perspective projection formula  
    const x2d = (x3d * viewerDistance) / (z3d + viewerDistance);  
    const y2d = (y3d * viewerDistance) / (z3d + viewerDistance);  
    return { x: x2d, y: y2d };  
}  
  
// 3. 3D Rotation Matrices  
function rotate3D(x, y, z, u^2, angleX, angleY, angleZ) {  
    // Rotation around X-axis  
    const cosX = Math.cos(angleX);  
    const sinX = Math.sin(angleX);  
    const y1 = y * cosX - z * sinX;  
    const z1 = y * sinX + z * cosX;  
      
    // Rotation around Y-axis  
    const cosY = Math.cos(angleY);  
    const sinY = Math.sin(angleY);  
    const x2 = x * cosY + z1 * sinY;  
    const z2 = -x * sinY + z1 * cosY;  
      
    // Rotation around Z-axis  
    const cosZ = Math.cos(angleZ);  
    const sinZ = Math.sin(angleZ);  
    const x3 = x2 * cosZ - y1 * sinZ;  
    const y3 = x2 * sinZ + y1 * cosZ;  
      
    return { x: x3, y: y3, z: z2 };  
}  
  
// 4. 4D Hypercube (Tesseract) Vertices  
function generateHypercube(size) {  
    const vertices = [];  
    // Generate all 16 vertices of a 4D hypercube  
    for (let w = -1; w <= 1; w += 2) {  
        for (let x = -1; x <= 1; x += 2) {  
            for (let y = -1; y <= 1; y += 2) {  
                for (let z = -1; z <= 1; z += 2) {  
                    vertices.push({  
                        x: x * size,  
                        y: y * size,  
                        z: z * size,  
                        w: w * size  
                    });  
                }  
            }  
        }  
    }  
    return vertices;  
}  
  
// 5. 4D to 3D Projection  
function project4Dto3D(x4d, y4d, z4d, w4d, viewerDistance4D) {  
    // Project 4D point to 3D space  
    const x3d = (x4d * viewerDistance4D) / (w4d + viewerDistance4D);  
    const y3d = (y4d * viewerDistance4D) / (w4d + viewerDistance4D);  
    const z3d = (z4d * viewerDistance4D) / (w4d + viewerDistance4D);  
    return { x: x3d, y: y3d, z: z3d };  
}  
  
// 6. 4D Rotation Matrix (4x4)  
function rotate4D(x, y, z, w, angleXY, angleXZ, angleXW, angleYZ, angleYW, angleZW) {  
    // 4D rotation in XY plane  
    const cosXY = Math.cos(angleXY);  
    const sinXY = Math.sin(angleXY);  
    let x1 = x * cosXY - y * sinXY;  
    let y1 = x * sinXY + y * cosXY;  
    let z1 = z;  
    let w1 = w;  
      
    // 4D rotation in XZ plane  
    const cosXZ = Math.cos(angleXZ);  
    const sinXZ = Math.sin(angleXZ);  
    let x2 = x1 * cosXZ - z1 * sinXZ;  
    let z2 = x1 * sinXZ + z1 * cosXZ;  
    let y2 = y1;  
    let w2 = w1;  
      
    // 4D rotation in XW plane  
    const cosXW = Math.cos(angleXW);  
    const sinXW = Math.sin(angleXW);  
    let x3 = x2 * cosXW - w2 * sinXW;  
    let w3 = x2 * sinXW + w2 * cosXW;  
    let y3 = y2;  
    let z3 = z2;  
      
    return { x: x3, y: y3, z: z3, w: w3 };  
}  
  
// 7. Image Pixel to 3D Voxel Conversion  
function pixelToVoxel(imageData, width, height, depth) {  
    const voxels = [];  
    for (let y = 0; y < height; y++) {  
        for (let x = 0; x < width; x++) {  
            const pixelIndex = (y * width + x) * 4;  
            const r = imageData[pixelIndex];  
            const g = imageData[pixelIndex + 1];  
            const b = imageData[pixelIndex + 2];  
            const alpha = imageData[pixelIndex + 3];  
              
            // Create voxels based on pixel intensity  
            if (alpha > 0) {  
                for (let z = 0; z < depth; z++) {  
                    voxels.push({  
                        x: x,  
                        y: y,  
                        z: z,  
                        color: { r, g, b, alpha }  
                    });  
                }  
            }  
        }  
    }  
    return voxels;  
}  
  
// 8. Distance-based scaling for 4D visualization  
function calculateDistance4D(x, y, z, w) {  
    return Math.sqrt(x*x + y*y + z*z + w*w);  
}  
  
// 9. Cross-section slice for 4D objects  
function slice4D(vertices4D, wSlice) {  
    return vertices4D.filter(vertex =>   
        Math.abs(vertex.w - wSlice) < 0.1  
    );  
}  
  
// 10. Complete transformation pipeline  
function transform2DTo4D(imageData, width, height, time) {  
    const results = [];  
      
    for (let y = 0; y < height; y++) {  
        for (let x = 0; x < width; x++) {  
            const pixelIndex = (y * width + x) * 4;  
            const alpha = imageData[pixelIndex + 3];  
              
            if (alpha > 0) {  
                // 2D to 4D coordinate mapping  
                const x4d = (x - width/2) / width * 2;  
                const y4d = (y - height/2) / height * 2;  
                const z4d = Math.sin(time + x * 0.1) * 0.5;  
                const w4d = Math.cos(time + y * 0.1) * 0.5;  
                  
                // Apply 4D rotation  
                const rotated = rotate4D(x4d, y4d, z4d, w4d, time, time*0.7, time*0.5, 0, 0, 0);  
                  
                // Project to 3D  
                const projected3D = project4Dto3D(rotated.x, rotated.y, rotated.z, rotated.w, 2);  
                  
                // Project to 2D screen space  
                const projected2D = project3DTo2D(projected3D.x, projected3D.y, projected3D.z, 3);  
                  
                results.push({  
                    screen: projected2D,  
                    depth: projected3D.z,  
                    color: {  
                        r: imageData[pixelIndex],  
                        g: imageData[pixelIndex + 1],  
                        b: imageData[pixelIndex + 2],  
                        a: alpha  
                    }  
                });  
            }  
        }  
    }  
      
    // Sort by depth for proper rendering  
    return results.sort((a, b) => b.depth - a.depth);  
}  
