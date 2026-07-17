# CONTROLLER/PARAMETER SETTINGS.   
#**PARAMETER CONTROLS - COPY & PASTE LIST**  
**CORE PARAMETERS (a→f)**  
**Parameters a, b, c** (Range: 0.0 → 23.99)  
  
**U AND V PARAMETERS & SEGMENTS - COPY & PASTE**  
**U AND V RANGE CONTROLS** (Range: -30 → 30)  
```
// U Min
<Slider
value={[parameters.uMin]}
onValueChange={(value) => onParameterChange({ uMin: value[0] })}
min={-30}
max={30}
step={0.00000422}
/>

// U Max
<Slider
value={[parameters.uMax]}
onValueChange={(value) => onParameterChange({ uMax: value[0] })}
min={-30}
max={30}
step={0.00000422}
/>

// V Min
<Slider
value={[parameters.vMin]}
onValueChange={(value) => onParameterChange({ vMin: value[0] })}
min={-30}
max={30}
step={0.00000422}
/>

// V Max
<Slider
value={[parameters.vMax]}
onValueChange={(value) => onParameterChange({ vMax: value[0] })}
min={-30}
max={30}
step={0.00000422}
/>


```
**U AND V SEGMENT CONTROLS** (Range: 5 → 150)  
```
// U Segments
<Slider
value={[parameters.uSegments]}
onValueChange={(value) => onParameterChange({ uSegments: Math.round(value[0]) })}
min={5}
max={150}
step={1}
/>

// V Segments
<Slider
value={[parameters.vSegments]}
onValueChange={(value) => onParameterChange({ vSegments: Math.round(value[0]) })}
min={5}
max={150}
step={1}
/>


```
**ADVANCED RANGE SCALE CONTROLS** (Range: 0 → 25.00)  
```
// U Range Scale (Dynamic)
<Slider
value={[parameters.uMax - parameters.uMin]}
onValueChange={(value) => onParameterChange({ uMax: parameters.uMin + value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

// V Range Scale (Dynamic)
<Slider
value={[parameters.vMax - parameters.vMin]}
onValueChange={(value) => onParameterChange({ vMax: parameters.vMin + value[0] })}
min={0}
max={25.00}
step={0.00065}
/>


```
  
**Step Precision:**  
* **U/V Min/Max:** 0.00000422 (ultra-fine control)  
* **U/V Segments:** 1 (whole numbers only)  
* **Range Scales:** 0.00065 (fine control)  
  
  
  
```
<Slider
value={[parameters.a]}
onValueChange={(value) => onParameterChange({ a: value[0] })}
min={0}
max={23.99}
step={0.00065}
/>

<Slider
value={[parameters.b]}
onValueChange={(value) => onParameterChange({ b: value[0] })}
min={0}
max={23.99}
step={0.00065}
/>

<Slider
value={[parameters.c]}
onValueChange={(value) => onParameterChange({ c: value[0] })}
min={0}
max={23.99}
step={0.00065}
/>


```
**Parameters d, e, f** (Range: 0.0 → 25.00)  
```
<Slider
value={[parameters.d]}
onValueChange={(value) => onParameterChange({ d: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.e]}
onValueChange={(value) => onParameterChange({ e: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.f]}
onValueChange={(value) => onParameterChange({ f: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>


```
**ENHANCED 4D DYNAMICS (g→w)** (Range: 0.0 → 25.00)  
```
<Slider
value={[parameters.g]}
onValueChange={(value) => onParameterChange({ g: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.h]}
onValueChange={(value) => onParameterChange({ h: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.i]}
onValueChange={(value) => onParameterChange({ i: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.j]}
onValueChange={(value) => onParameterChange({ j: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.k]}
onValueChange={(value) => onParameterChange({ k: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.l]}
onValueChange={(value) => onParameterChange({ l: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.m]}
onValueChange={(value) => onParameterChange({ m: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.n]}
onValueChange={(value) => onParameterChange({ n: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.o]}
onValueChange={(value) => onParameterChange({ o: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.p]}
onValueChange={(value) => onParameterChange({ p: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.q]}
onValueChange={(value) => onParameterChange({ q: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.r]}
onValueChange={(value) => onParameterChange({ r: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.s]}
onValueChange={(value) => onParameterChange({ s: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.t]}
onValueChange={(value) => onParameterChange({ t: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.u]}
onValueChange={(value) => onParameterChange({ u: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.v]}
onValueChange={(value) => onParameterChange({ v: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.w]}
onValueChange={(value) => onParameterChange({ w: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>


```
**EXTENDED 4D PARAMETERS (x→z)** (Range: 0.0 → 25.00)  
```
<Slider
value={[parameters.x || 1]}
onValueChange={(value) => onParameterChange({ x: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.y || 1]}
onValueChange={(value) => onParameterChange({ y: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.z || 1]}
onValueChange={(value) => onParameterChange({ z: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>


```
**GREEK PARAMETERS (α→ω)** (Range: 0.0 → 25.00)  
```
<Slider
value={[parameters.alpha || 1]}
onValueChange={(value) => onParameterChange({ alpha: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.beta || 1]}
onValueChange={(value) => onParameterChange({ beta: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.gamma || 1]}
onValueChange={(value) => onParameterChange({ gamma: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.delta || 1]}
onValueChange={(value) => onParameterChange({ delta: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.epsilon || 1]}
onValueChange={(value) => onParameterChange({ epsilon: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.zeta || 1]}
onValueChange={(value) => onParameterChange({ zeta: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.eta || 1]}
onValueChange={(value) => onParameterChange({ eta: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.theta || 1]}
onValueChange={(value) => onParameterChange({ theta: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.iota || 1]}
onValueChange={(value) => onParameterChange({ iota: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.kappa || 1]}
onValueChange={(value) => onParameterChange({ kappa: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.lambda || 1]}
onValueChange={(value) => onParameterChange({ lambda: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.mu || 1]}
onValueChange={(value) => onParameterChange({ mu: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.nu || 1]}
onValueChange={(value) => onParameterChange({ nu: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.xi || 1]}
onValueChange={(value) => onParameterChange({ xi: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.omicron || 1]}
onValueChange={(value) => onParameterChange({ omicron: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.pi || 1]}
onValueChange={(value) => onParameterChange({ pi: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.rho || 1]}
onValueChange={(value) => onParameterChange({ rho: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.sigma || 1]}
onValueChange={(value) => onParameterChange({ sigma: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.tau || 1]}
onValueChange={(value) => onParameterChange({ tau: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.upsilon || 1]}
onValueChange={(value) => onParameterChange({ upsilon: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.phi || 1]}
onValueChange={(value) => onParameterChange({ phi: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.chi || 1]}
onValueChange={(value) => onParameterChange({ chi: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.psi || 1]}
onValueChange={(value) => onParameterChange({ psi: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>

<Slider
value={[parameters.omega || 1]}
onValueChange={(value) => onParameterChange({ omega: value[0] })}
min={0}
max={25.00}
step={0.00065}
/>


```
**MAIN HANDLER FUNCTION**  
```
const handleParameterSliderChange = (paramName: string, value: number[]) => {
onParameterChange({ [paramName]: value[0] });
};

```
