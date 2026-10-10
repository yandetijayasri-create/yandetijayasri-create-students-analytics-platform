# ELEVΛLTE — AI & ML Methodology

ElevAlte combines generative AI synthesis with predictive machine learning diagnostics to create a closed-loop academic copilot.

---

## 1. Bayesian Knowledge Tracing (BKT)
We model a student's latent mastery of each syllabus topic using Bayesian Knowledge Tracing.

Given an observation $O_t \in \{\text{correct}, \text{incorrect}\}$:

$$P(L_t \mid O_t = 1) = \frac{P(L_{t-1}) \cdot (1 - P(S))}{P(L_{t-1}) \cdot (1 - P(S)) + (1 - P(L_{t-1})) \cdot P(G)}$$

$$P(L_t \mid O_t = 0) = \frac{P(L_{t-1}) \cdot P(S)}{P(L_{t-1}) \cdot P(S) + (1 - P(L_{t-1})) \cdot (1 - P(G))}$$

Where:
- $P(L_0) = 0.30$: Initial knowledge prior
- $P(T) = 0.15$: Learning transition rate per practice problem
- $P(G) = 0.20$: Guessing probability
- $P(S) = 0.10$: Slipping probability (careless error)

Next state prediction:
$$P(L_{t+1}) = P(L_t \mid O_t) + (1 - P(L_t \mid O_t)) \cdot P(T)$$

---

## 2. Learning Gap Classification Matrix
Topics are categorized into three priority tiers based on adjusted accuracy (including retention decay penalty):

$$\text{DecayPenalty} = \min(\text{DaysInactive} \times 0.003, 0.15)$$
$$\text{AdjustedAccuracy} = \text{RawAccuracy} - \text{DecayPenalty}$$

| Tier | Adjusted Accuracy | Mistake Threshold | Action |
| :--- | :--- | :--- | :--- |
| **HIGH PRIORITY** | $< 50\%$ | $\ge 3$ mistakes | Immediate intervention sprint |
| **NEEDS PRACTICE** | $50\% - 75\%$ | $1 - 2$ mistakes | Foundation review & problem sets |
| **STRONG** | $> 75\%$ | $0$ mistakes | Spaced maintenance recall |

---

## 3. Recommendation Ranking Formula
The highlighted dashboard recommendation card is computed using a multi-attribute utility function:

$$\text{Impact} = (1 - \text{Mastery}) \times \text{ExamWeight} \times \left(1 + \frac{10}{\max(1, \text{DaysRemaining})}\right) \times (1 + \text{Mistakes} \times 0.15)$$

This ensures that:
1. Low-accuracy topics are amplified
2. Core subjects with high syllabus weight are elevated
3. Imminent exams drastically increase urgency
4. Recurring misconceptions receive higher intervention priority
