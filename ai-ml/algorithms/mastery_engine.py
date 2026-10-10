"""
ElevAlte AI-ML Engine: Bayesian Knowledge Tracing (BKT) Engine
Updates a student's latent probability of knowing a concept based on sequential observations.
Parameters:
- P(L0): Initial knowledge prior probability
- P(T): Transition probability (learning from practice)
- P(G): Guess probability (getting it right without knowing)
- P(S): Slip probability (knowing the concept but making an error)
"""

class BayesianKnowledgeTracer:
    def __init__(self, p_init: float = 0.30, p_transit: float = 0.15, p_guess: float = 0.20, p_slip: float = 0.10):
        self.p_init = p_init
        self.p_transit = p_transit
        self.p_guess = p_guess
        self.p_slip = p_slip

    def update_mastery(self, p_known: float, is_correct: bool) -> float:
        """
        Calculates posterior probability P(L_n | Observation) and predicts next state P(L_n+1).
        """
        if is_correct:
            # P(L | Correct) = (P(L) * (1 - P(S))) / (P(L) * (1 - P(S)) + (1 - P(L)) * P(G))
            numerator = p_known * (1 - self.p_slip)
            denominator = numerator + (1 - p_known) * self.p_guess
        else:
            # P(L | Incorrect) = (P(L) * P(S)) / (P(L) * P(S) + (1 - P(L)) * (1 - P(G)))
            numerator = p_known * self.p_slip
            denominator = numerator + (1 - p_known) * (1 - self.p_guess)

        if denominator == 0:
            posterior = p_known
        else:
            posterior = numerator / denominator

        # Next state incorporates learning transition: P(L_next) = P(L | Obs) + (1 - P(L | Obs)) * P(T)
        p_next = posterior + (1 - posterior) * self.p_transit
        return min(0.99, max(0.01, round(p_next, 4)))

    def evaluate_quiz_sequence(self, sequence: list[bool], starting_prior: float = None) -> float:
        current_p = starting_prior if starting_prior is not None else self.p_init
        for answer in sequence:
            current_p = self.update_mastery(current_p, answer)
        return current_p
