# # Mathematical Foundations of Modern AI Algorithms  
  
## Machine Learning Fundamentals  
  
### Gradient Descent and Variants  
  
**Basic Gradient Descent:**  
  
```  
θ_{t+1} = θ_t - α∇J(θ_t)  
```  
  
- θ: parameters  
- α: learning rate  
- J(θ): loss/cost function  
- ∇J(θ): gradient of loss  
  
**Stochastic Gradient Descent (SGD):**  
  
```  
θ_{t+1} = θ_t - α∇J(θ_t; x^(i), y^(i))  
```  
  
Update using single sample or mini-batch instead of full dataset.  
  
**SGD with Momentum:**  
  
```  
v_t = βv_{t-1} + ∇J(θ_t)  
θ_{t+1} = θ_t - αv_t  
```  
  
- β: momentum coefficient (typically 0.9)  
- v: velocity (accumulated gradient)  
  
**AdaGrad (Adaptive Gradient):**  
  
```  
G_t = G_{t-1} + (∇J(θ_t))²  
θ_{t+1} = θ_t - (α/√(G_t + ε))∇J(θ_t)  
```  
  
- G_t: sum of squared gradients  
- ε: small constant for numerical stability (~10⁻⁸)  
  
**RMSprop (Root Mean Square Propagation):**  
  
```  
E[g²]_t = βE[g²]_{t-1} + (1-β)(∇J(θ_t))²  
θ_{t+1} = θ_t - (α/√(E[g²]_t + ε))∇J(θ_t)  
```  
  
- E[g²]: exponential moving average of squared gradients  
- β: decay rate (typically 0.9)  
  
**Adam (Adaptive Moment Estimation):**  
  
```  
m_t = β₁m_{t-1} + (1-β₁)∇J(θ_t)          # First moment (mean)  
v_t = β₂v_{t-1} + (1-β₂)(∇J(θ_t))²       # Second moment (variance)  
m̂_t = m_t/(1-β₁ᵗ)                        # Bias correction  
v̂_t = v_t/(1-β₂ᵗ)                        # Bias correction  
θ_{t+1} = θ_t - α(m̂_t/√(v̂_t + ε))  
```  
  
- β₁: typically 0.9  
- β₂: typically 0.999  
- Combines momentum and adaptive learning rates  
  
### Random Forests  
  
**Decision Tree Split Criterion (Gini Impurity):**  
  
```  
Gini(D) = 1 - Σᵢ pᵢ²  
```  
  
- pᵢ: proportion of class i in dataset D  
  
**Information Gain (Alternative):**  
  
```  
IG(D, A) = H(D) - Σᵥ (|Dᵥ|/|D|)H(Dᵥ)  
H(D) = -Σᵢ pᵢ log₂(pᵢ)  
```  
  
- H(D): entropy  
- A: attribute/feature  
- Dᵥ: subset where attribute A has value v  
  
**Random Forest Prediction:**  
  
```  
ŷ = (1/B)Σᵇ₌₁ᴮ fᵦ(x)     # Regression  
ŷ = mode{f₁(x), ..., fᴮ(x)}  # Classification  
```  
  
- B: number of trees  
- fᵦ(x): prediction from tree b  
  
**Bootstrap Sampling:**  
Each tree trained on bootstrap sample of size n drawn with replacement from original dataset.  
  
### Support Vector Machines (SVM)  
  
**Primal Optimization Problem:**  
  
```  
minimize: (1/2)||w||² + C Σᵢ ξᵢ  
subject to: yᵢ(w·xᵢ + b) ≥ 1 - ξᵢ  
            ξᵢ ≥ 0  
```  
  
- w: weight vector (defines hyperplane)  
- b: bias term  
- ξᵢ: slack variables (allow misclassification)  
- C: regularization parameter  
  
**Dual Optimization Problem:**  
  
```  
maximize: Σᵢ αᵢ - (1/2)ΣᵢΣⱼ αᵢαⱼyᵢyⱼK(xᵢ, xⱼ)  
subject to: 0 ≤ αᵢ ≤ C  
            Σᵢ αᵢyᵢ = 0  
```  
  
- αᵢ: Lagrange multipliers  
- K(xᵢ, xⱼ): kernel function  
  
**Common Kernels:**  
  
- Linear: K(x, x’) = x·x’  
- Polynomial: K(x, x’) = (γx·x’ + r)ᵈ  
- RBF (Gaussian): K(x, x’) = exp(-γ||x - x’||²)  
- Sigmoid: K(x, x’) = tanh(γx·x’ + r)  
  
**Decision Function:**  
  
```  
f(x) = sign(Σᵢ αᵢyᵢK(xᵢ, x) + b)  
```  
  
### XGBoost/LightGBM/CatBoost  
  
**Gradient Boosting Objective:**  
  
```  
L = Σᵢ l(yᵢ, ŷᵢ) + Σₖ Ω(fₖ)  
```  
  
- l: loss function  
- Ω: regularization term  
- fₖ: k-th tree  
  
**XGBoost Specific Objective:**  
  
```  
L⁽ᵗ⁾ = Σᵢ l(yᵢ, ŷᵢ⁽ᵗ⁻¹⁾ + fₜ(xᵢ)) + Ω(fₜ)  
```  
  
**Second-order Taylor Expansion:**  
  
```  
L⁽ᵗ⁾ ≈ Σᵢ [l(yᵢ, ŷᵢ⁽ᵗ⁻¹⁾) + gᵢfₜ(xᵢ) + (1/2)hᵢfₜ²(xᵢ)] + Ω(fₜ)  
```  
  
- gᵢ = ∂l/∂ŷᵢ⁽ᵗ⁻¹⁾: first-order gradient  
- hᵢ = ∂²l/∂(ŷᵢ⁽ᵗ⁻¹⁾)²: second-order gradient  
  
**Regularization Term:**  
  
```  
Ω(f) = γT + (1/2)λΣⱼ wⱼ²  
```  
  
- T: number of leaves  
- wⱼ: leaf weights  
- γ, λ: regularization parameters  
  
**Optimal Leaf Weight:**  
  
```  
wⱼ* = -(Σᵢ∈Iⱼ gᵢ)/(Σᵢ∈Iⱼ hᵢ + λ)  
```  
  
- Iⱼ: set of indices in leaf j  
  
**Split Gain:**  
  
```  
Gain = (1/2)[(Σᵢ∈Iₗ gᵢ)²/(Σᵢ∈Iₗ hᵢ + λ) + (Σᵢ∈Iᵣ gᵢ)²/(Σᵢ∈Iᵣ hᵢ + λ) - (Σᵢ∈I gᵢ)²/(Σᵢ∈I hᵢ + λ)] - γ  
```  
  
-----  
  
## Deep Learning Architectures  
  
### Convolutional Neural Networks (CNNs)  
  
**Convolution Operation:**  
  
```  
(f * g)(x, y) = ΣₘΣₙ f(m, n)g(x-m, y-n)  
```  
  
**Discrete 2D Convolution:**  
  
```  
S(i, j) = Σₘ Σₙ I(i+m, j+n)K(m, n)  
```  
  
- I: input image  
- K: kernel/filter  
- S: feature map  
  
**Forward Pass (Single Layer):**  
  
```  
Z^[l] = W^[l] * A^[l-1] + b^[l]  
A^[l] = g(Z^[l])  
```  
  
- *: convolution operation  
- g: activation function (ReLU, etc.)  
  
**Pooling Operations:**  
  
- Max Pooling: `p(i,j) = max_{m,n∈R(i,j)} a(m,n)`  
- Average Pooling: `p(i,j) = (1/|R|)Σ_{m,n∈R(i,j)} a(m,n)`  
  
**Output Size:**  
  
```  
O = ⌊(W - K + 2P)/S⌋ + 1  
```  
  
- W: input width/height  
- K: kernel size  
- P: padding  
- S: stride  
  
### Recurrent Neural Networks (RNNs)  
  
**Basic RNN Equations:**  
  
```  
h_t = tanh(W_hh h_{t-1} + W_xh x_t + b_h)  
y_t = W_hy h_t + b_y  
```  
  
- h_t: hidden state at time t  
- x_t: input at time t  
- y_t: output at time t  
- W: weight matrices  
- b: bias vectors  
  
**Backpropagation Through Time (BPTT):**  
  
```  
∂L/∂W_hh = Σₜ (∂L/∂h_t)(∂h_t/∂W_hh)  
∂h_t/∂h_{t-1} = W_hh · diag(1 - tanh²(z_t))  
```  
  
**Vanishing Gradient Problem:**  
  
```  
∂h_t/∂h_k = Πⱼ₌ₖᵗ⁻¹ (∂h_{j+1}/∂h_j)  
```  
  
Product of derivatives can shrink exponentially.  
  
### Long Short-Term Memory (LSTM)  
  
**LSTM Gates:**  
  
```  
f_t = σ(W_f · [h_{t-1}, x_t] + b_f)     # Forget gate  
i_t = σ(W_i · [h_{t-1}, x_t] + b_i)     # Input gate  
C̃_t = tanh(W_C · [h_{t-1}, x_t] + b_C)  # Candidate cell state  
C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t         # Cell state update  
o_t = σ(W_o · [h_{t-1}, x_t] + b_o)     # Output gate  
h_t = o_t ⊙ tanh(C_t)                    # Hidden state  
```  
  
- σ: sigmoid function  
- ⊙: element-wise multiplication (Hadamard product)  
- f_t: forget gate (what to forget from previous cell state)  
- i_t: input gate (what new information to store)  
- o_t: output gate (what to output)  
  
### Gated Recurrent Units (GRU)  
  
**GRU Equations (Simplified LSTM):**  
  
```  
z_t = σ(W_z · [h_{t-1}, x_t])           # Update gate  
r_t = σ(W_r · [h_{t-1}, x_t])           # Reset gate  
h̃_t = tanh(W · [r_t ⊙ h_{t-1}, x_t])   # Candidate hidden state  
h_t = (1 - z_t) ⊙ h_{t-1} + z_t ⊙ h̃_t  # Hidden state  
```  
  
- Fewer parameters than LSTM  
- z_t controls how much past information to keep  
- r_t determines how much past hidden state influences candidate  
  
### Transformers  
  
**Scaled Dot-Product Attention:**  
  
```  
Attention(Q, K, V) = softmax(QK^T/√d_k)V  
```  
  
- Q: query matrix (n × d_k)  
- K: key matrix (m × d_k)  
- V: value matrix (m × d_v)  
- d_k: dimension of keys  
- Scaling by √d_k prevents softmax saturation  
  
**Multi-Head Attention:**  
  
```  
MultiHead(Q, K, V) = Concat(head₁, ..., headₕ)W^O  
head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)  
```  
  
- h: number of attention heads  
- W^O: output projection matrix  
  
**Position-wise Feed-Forward Network:**  
  
```  
FFN(x) = max(0, xW₁ + b₁)W₂ + b₂  
```  
  
- Two linear transformations with ReLU activation  
  
**Positional Encoding:**  
  
```  
PE(pos, 2i) = sin(pos/10000^(2i/d_model))  
PE(pos, 2i+1) = cos(pos/10000^(2i/d_model))  
```  
  
- pos: position in sequence  
- i: dimension index  
- d_model: model dimension  
  
**Layer Normalization:**  
  
```  
LayerNorm(x) = γ ⊙ (x - μ)/√(σ² + ε) + β  
μ = (1/d)Σᵢ xᵢ  
σ² = (1/d)Σᵢ (xᵢ - μ)²  
```  
  
**Full Transformer Block:**  
  
```  
x' = LayerNorm(x + MultiHeadAttention(x))  
output = LayerNorm(x' + FFN(x'))  
```  
  
### Vision Transformers (ViT)  
  
**Image Patch Embedding:**  
  
```  
x_p = [x_1^p E; x_2^p E; ...; x_N^p E]  
```  
  
- Image divided into patches of size P×P  
- Each patch flattened and linearly projected  
- N = HW/P²: number of patches  
  
**Position Embeddings Added:**  
  
```  
z₀ = [x_class; x_1^p E; x_2^p E; ...; x_N^p E] + E_pos  
```  
  
- x_class: learnable class token  
- E_pos: learnable position embeddings  
  
**Transformer Encoder Applied:**  
  
```  
z'_l = MSA(LN(z_{l-1})) + z_{l-1}  
z_l = MLP(LN(z'_l)) + z'_l  
```  
  
- MSA: Multi-head Self-Attention  
- LN: Layer Normalization  
- MLP: Multi-Layer Perceptron  
  
**Classification Head:**  
  
```  
y = LN(z_L^0)  
```  
  
Uses class token from final layer.  
  
### Generative Adversarial Networks (GANs)  
  
**Minimax Game:**  
  
```  
min_G max_D V(D, G) = E_{x~p_data}[log D(x)] + E_{z~p_z}[log(1 - D(G(z)))]  
```  
  
- D: discriminator (tries to maximize)  
- G: generator (tries to minimize)  
- p_data: real data distribution  
- p_z: noise distribution  
  
**Generator Objective (Alternative):**  
  
```  
max_G E_{z~p_z}[log D(G(z))]  
```  
  
Equivalent but better gradients in practice.  
  
**Discriminator Update:**  
  
```  
∇_θ_d (1/m)Σᵢ[log D(x^(i)) + log(1 - D(G(z^(i))))]  
```  
  
**Generator Update:**  
  
```  
∇_θ_g (1/m)Σᵢ log(1 - D(G(z^(i))))  
```  
  
or with non-saturating loss:  
  
```  
∇_θ_g (1/m)Σᵢ -log D(G(z^(i)))  
```  
  
**Wasserstein GAN (WGAN) Loss:**  
  
```  
L = E_{x~p_data}[D(x)] - E_{z~p_z}[D(G(z))] - λE_{x̂~p_x̂}[(||∇_x̂ D(x̂)||₂ - 1)²]  
```  
  
- Last term: gradient penalty  
- x̂: interpolation between real and generated samples  
  
### Variational Autoencoders (VAE)  
  
**Evidence Lower Bound (ELBO):**  
  
```  
log p(x) ≥ E_q[log p(x|z)] - KL(q(z|x)||p(z))  
```  
  
- q(z|x): encoder (approximate posterior)  
- p(x|z): decoder (likelihood)  
- p(z): prior (typically N(0, I))  
  
**VAE Loss Function:**  
  
```  
L = E_{z~q(z|x)}[log p(x|z)] - KL(q(z|x)||p(z))  
```  
  
**Reparameterization Trick:**  
  
```  
z = μ + σ ⊙ ε, where ε ~ N(0, I)  
```  
  
Enables backpropagation through sampling.  
  
**KL Divergence (Gaussian Case):**  
  
```  
KL(q(z|x)||p(z)) = (1/2)Σⱼ(μⱼ² + σⱼ² - log σⱼ² - 1)  
```  
  
**Reconstruction Loss (Bernoulli):**  
  
```  
log p(x|z) = Σᵢ[xᵢ log x̂ᵢ + (1-xᵢ)log(1-x̂ᵢ)]  
```  
  
**Reconstruction Loss (Gaussian):**  
  
```  
log p(x|z) = -(1/2σ²)||x - x̂||²  
```  
  
### Diffusion Models  
  
**Forward Process (Adding Noise):**  
  
```  
q(x_t|x_{t-1}) = N(x_t; √(1-β_t)x_{t-1}, β_t I)  
x_t = √(1-β_t)x_{t-1} + √β_t ε, ε ~ N(0, I)  
```  
  
- β_t: noise schedule  
- T: total timesteps  
  
**Closed Form (Any t):**  
  
```  
q(x_t|x_0) = N(x_t; √ᾱ_t x_0, (1-ᾱ_t)I)  
x_t = √ᾱ_t x_0 + √(1-ᾱ_t)ε  
```  
  
- α_t = 1 - β_t  
- ᾱ_t = Πₛ₌₁ᵗ αₛ  
  
**Reverse Process (Denoising):**  
  
```  
p_θ(x_{t-1}|x_t) = N(x_{t-1}; μ_θ(x_t, t), Σ_θ(x_t, t))  
```  
  
**Training Objective (Simplified):**  
  
```  
L_simple = E_{t,x_0,ε}[||ε - ε_θ(x_t, t)||²]  
```  
  
Predict noise that was added.  
  
**DDPM Sampling:**  
  
```  
x_{t-1} = (1/√α_t)(x_t - (β_t/√(1-ᾱ_t))ε_θ(x_t, t)) + σ_t z  
```  
  
- z ~ N(0, I) if t > 1, else z = 0  
- σ_t: noise scale  
  
**Score-Based Formulation:**  
  
```  
∇_x log p(x_t) ≈ -(1/√(1-ᾱ_t))ε_θ(x_t, t)  
```  
  
Model learns score function (gradient of log-density).  
  
-----  
  
## Natural Language Processing  
  
### Word2Vec  
  
**Skip-gram Model:**  
  
```  
maximize: (1/T)Σₜ Σ_{-c≤j≤c,j≠0} log p(w_{t+j}|w_t)  
```  
  
- Predict context words given center word  
- T: corpus size  
- c: context window size  
  
**Probability (Softmax):**  
  
```  
p(w_o|w_i) = exp(u_o^T v_i)/Σ_{w=1}^W exp(u_w^T v_i)  
```  
  
- v_i: input vector for word i  
- u_o: output vector for word o  
- W: vocabulary size  
  
**Negative Sampling Objective:**  
  
```  
log σ(u_o^T v_i) + Σₖ E_{w~P_n}[log σ(-u_w^T v_i)]  
```  
  
- σ: sigmoid function  
- P_n: noise distribution (typically unigram^(3/4))  
- k: number of negative samples  
  
**CBOW (Continuous Bag of Words):**  
  
```  
maximize: (1/T)Σₜ log p(w_t|w_{t-c},...,w_{t+c})  
```  
  
Predict center word from context.  
  
### GloVe (Global Vectors)  
  
**Co-occurrence Matrix:**  
  
```  
X_{ij} = number of times word j appears in context of word i  
```  
  
**Objective Function:**  
  
```  
J = Σᵢ,ⱼ f(X_{ij})(w_i^T w̃_j + b_i + b̃_j - log X_{ij})²  
```  
  
**Weighting Function:**  
  
```  
f(x) = (x/x_max)^α if x < x_max  
f(x) = 1 otherwise  
```  
  
- Typically α = 3/4, x_max = 100  
  
### BERT  
  
**Masked Language Model (MLM) Loss:**  
  
```  
L_MLM = -E[Σᵢ∈masked log P(x_i|x_masked)]  
```  
  
- 15% of tokens masked randomly  
- 80% replaced with [MASK]  
- 10% replaced with random token  
- 10% kept unchanged  
  
**Next Sentence Prediction (NSP) Loss:**  
  
```  
L_NSP = -E[log P(IsNext|sentence_A, sentence_B)]  
```  
  
**Total BERT Pre-training Loss:**  
  
```  
L = L_MLM + L_NSP  
```  
  
**Attention Mask for Bidirectional Context:**  
  
```  
Attention(Q, K, V) = softmax(QK^T/√d_k + M)V  
```  
  
- M: mask matrix (0 for allowed, -∞ for masked)  
- All positions can attend to all positions  
  
### GPT (Generative Pre-trained Transformer)  
  
**Autoregressive Language Model:**  
  
```  
P(x) = Πₜ P(x_t|x_<t)  
```  
  
**Training Objective:**  
  
```  
L = -Σₜ log P(x_t|x_{t-k},...,x_{t-1}; Θ)  
```  
  
- k: context window size  
- Causal (unidirectional) masking  
  
**Causal Attention Mask:**  
  
```  
M_{ij} = 0 if i ≥ j  
M_{ij} = -∞ if i < j  
```  
  
Token can only attend to previous tokens.  
  
**Fine-tuning for Tasks:**  
  
```  
P(y|x¹,...,xᵐ) = softmax(h_l^m W_y)  
```  
  
- h_l^m: final transformer layer output  
- W_y: task-specific parameters  
  
### T5 (Text-to-Text Transfer Transformer)  
  
**Unified Framework:**  
  
```  
All tasks formulated as: text input → text output  
```  
  
**Denoising Objective:**  
  
```  
L = -E[log P(x̄|x̃)]  
```  
  
- x̃: corrupted input  
- x̄: original targets  
  
**Span Corruption:**  
  
```  
"Thank you for inviting me to your party last week"  
→ "Thank you <X> me to your party <Y> week"  
→ Target: "<X> for inviting <Y> last <Z>"  
```  
  
**Encoder-Decoder Structure:**  
  
- Encoder: bidirectional attention (like BERT)  
- Decoder: causal attention (like GPT)  
  
-----  
  
## Reinforcement Learning  
  
### Q-Learning  
  
**Q-Value Update Rule:**  
  
```  
Q(s_t, a_t) ← Q(s_t, a_t) + α[r_t + γ max_a Q(s_{t+1}, a) - Q(s_t, a_t)]  
```  
  
- s_t: state at time t  
- a_t: action at time t  
- r_t: reward  
- α: learning rate  
- γ: discount factor  
  
**Bellman Optimality Equation:**  
  
```  
Q*(s, a) = E[r_t + γ max_{a'} Q*(s', a')]  
```  
  
**ε-Greedy Policy:**  
  
```  
π(a|s) = 1 - ε + ε/|A| if a = argmax_a Q(s,a)  
π(a|s) = ε/|A| otherwise  
```  
  
### Deep Q-Networks (DQN)  
  
**Loss Function:**  
  
```  
L(θ) = E_{(s,a,r,s')~D}[(y - Q(s, a; θ))²]  
y = r + γ max_{a'} Q(s', a'; θ⁻)  
```  
  
- D: replay buffer  
- θ⁻: target network parameters (periodically updated)  
  
**Experience Replay:**  
Store transitions (s, a, r, s’) and sample mini-batches for training.  
  
**Target Network Update:**  
  
```  
θ⁻ ← θ every C steps  
```  
  
or soft update:  
  
```  
θ⁻ ← τθ + (1-τ)θ⁻  
```  
  
**Double DQN (Reduces Overestimation):**  
  
```  
y = r + γ Q(s', argmax_{a'} Q(s', a'; θ); θ⁻)  
```  
  
Select action with online network, evaluate with target network.  
  
### Policy Gradient Methods  
  
**Policy Gradient Theorem:**  
  
```  
∇_θ J(θ) = E_π[∇_θ log π_θ(a|s) Q^π(s,a)]  
```  
  
**REINFORCE Algorithm:**  
  
```  
∇_θ J(θ) ≈ Σₜ ∇_θ log π_θ(a_t|s_t) G_t  
G_t = Σₖ₌₀^∞ γᵏ r_{t+k}  
```  
  
- G_t: return from time t  
  
**Baseline Reduction (Actor-Critic):**  
  
```  
∇_θ J(θ) ≈ Σₜ ∇_θ log π_θ(a_t|s_t) (G_t - V(s_t))  
```  
  
- V(s_t): value function baseline (advantage)  
  
### Proximal Policy Optimization (PPO)  
  
**Surrogate Objective (Clipped):**  
  
```  
L^CLIP(θ) = E[min(r_t(θ)Â_t, clip(r_t(θ), 1-ε, 1+ε)Â_t)]  
r_t(θ) = π_θ(a_t|s_t)/π_θ_old(a_t|s_t)  
```  
  
- r_t(θ): probability ratio  
- Â_t: advantage estimate  
- ε: clip parameter (typically 0.2)  
  
**Advantage Estimation (GAE):**  
  
```  
Â_t = Σₗ₌₀^∞ (γλ)ᵗ δ_{t+l}  
δ_t = r_t + γV(s_{t+1}) - V(s_t)  
```  
  
- λ: GAE parameter (controls bias-variance tradeoff)  
  
**Value Function Loss:**  
  
```  
L^VF(θ) = (V_θ(s_t) - V^target)²  
```  
  
**Total PPO Loss:**  
  
```  
L(θ) = E[L^CLIP(θ) - c₁L^VF(θ) + c₂S[π_θ](s_t)]  
```  
  
- S: entropy bonus  
- c₁, c₂: coefficients  
  
### Actor-Critic Methods  
  
**Actor Update (Policy):**  
  
```  
∇_θ J(θ) = E[∇_θ log π_θ(a|s) A^π(s,a)]  
```  
  
**Critic Update (Value Function):**  
  
```  
L(w) = E[(r + γV_w(s') - V_w(s))²]  
```  
  
**Advantage Function:**  
  
```  
A^π(s,a) = Q^π(s,a) - V^π(s)  
```  
  
or TD error:  
  
```  
A(s,a) ≈ r + γV(s') - V(s)  
```  
  
**A3C (Asynchronous Advantage Actor-Critic):**  
Multiple workers collect experience in parallel:  
  
```  
θ' = θ + α Σₜ ∇_θ log π_θ(a_t|s_t)(R_t - V_θ(s_t))  
```  
  
### AlphaGo/AlphaZero  
  
**MCTS Selection (UCB):**  
  
```  
a* = argmax_a [Q(s,a) + c_puct P(s,a) √(Σ_b N(s,b))/(1 + N(s,a))]  
```  
  
- Q(s,a): action value  
- P(s,a): prior probability from neural network  
- N(s,a): visit count  
- c_puct: exploration constant  
  
**Neural Network Outputs:**  
  
```  
(p, v) = f_θ(s)  
```  
  
- p: policy vector (move probabilities)  
- v: value (position evaluation)  
  
**AlphaZero Training Loss:**  
  
```  
L = (z - v)² - π^T log p + c||θ||²  
```  
  
- z: game outcome  
- π: MCTS policy  
- c||θ||²: L2 regularization  
  
-----  
  
## Specialized Techniques  
  
### YOLO (You Only Look Once)  
  
**Grid-Based Prediction:**  
Divide image into S×S grid. Each cell predicts:  
  
- B bounding boxes: (x, y, w, h, confidence)  
- C class probabilities  
  
**Confidence Score:**  
  
```  
confidence = Pr(Object) · IOU^truth_pred  
```  
  
**Loss Function:**  
  
```  
L = λ_coord Σᵢ Σⱼ 𝟙  
```  
