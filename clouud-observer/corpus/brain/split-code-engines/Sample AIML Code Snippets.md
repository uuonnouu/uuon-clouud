# Sample AI/ML Code Snippets  
  
# 1.1 Anomaly Detection Using Isolation Forest (Python);  
  
from sklearn.ensemble import IsolationForest  
import numpy as np  
  
# Sample transaction data features (e.g., amount, frequency)  
X = np.array([[100, 1], [150, 2], [2000, 10], [120, 1], [130, 2]])  
  
# Train Isolation Forest model  
model = IsolationForest(contamination=0.1)  
model.fit(X)  
  
# Predict anomalies (-1 indicates anomaly)  
predictions = model.predict(X)  
print(predictions)  
  
**1.2 Reinforcement Learning for Compression Parameter Optimization (Simplified Example):**  
  
import random  
  
class CompressionAgent:  
    def __init__(self):  
        self.parameters = [0.5, 0.7, 0.9]  # sample compression ratios  
        self.values = [0, 0, 0]  
        self.visits = [0, 0, 0]  
  
    def select_parameter(self):  
        # Simple epsilon-greedy policy  
        if random.random() < 0.1:  
            return random.choice(range(len(self.parameters)))  
        else:  
            return self.values.index(max(self.values))  
  
    def update(self, idx, reward):  
        self.visits[idx] += 1  
        self.values[idx] += (reward - self.values[idx]) / self.visits[idx]  
  
agent = CompressionAgent()  
for _ in range(100):  
    param_idx = agent.select_parameter()  
    # Simulate reward as random for demo  
    reward = random.uniform(0, 1)  
    agent.update(param_idx, reward)  
  
print("Optimized parameters values:", agent.values)  
  
**2. Governance Template: Role-Based Access Control (RBAC)**  
  
**Roles and Permissions Table:**  
  

| Role | Permissions | Description |
| --------- | ------------------------------------------- | --------------------------------------------- |
| Admin | Full system access, smart contract upgrades | Manages platform, controls critical functions |
| Developer | Code deployment, debugging | Develops and deploys code, manages APIs |
| Operator | Monitor systems, manage day-to-day ops | Handles daily operations, monitors health |
| User | Use services, submit transactions | Interacts with the platform, owns assets |
  
**Sample Access Policy Document**  
  
**Title:** Platform Role-Based Access Control Policy  
**Purpose:** To define the access privileges of users and ensure least privilege is maintained.  
  
**Policy:**  
	•	All users must be assigned a single role based on their responsibilities.  
	•	Role changes must be approved by Admin.  
	•	Privileged roles (Admin, Developer) require MFA.  
	•	Access logs will be maintained for all sensitive operations.  
  
  
**3. Compliance Documentation Sample: Data Privacy Consent Form**  
  
**User Data Privacy Consent**  
  
We value your privacy and comply with relevant data protection regulations such as GDPR and CCPA. By using our platform, you consent to the collection and processing of your personal data as described below:  
	•	Types of data collected: Name, Email, Transaction data, Usage data.  
	•	Purpose of data processing: Service delivery, Security, Compliance, Marketing (optional).  
	•	Data retention period: Data will be retained for as long as your account is active or as required by law.  
	•	Your rights: Access, correction, deletion, and portability of your data.  
  
For more details, see our full Privacy Policy in about  us.   
