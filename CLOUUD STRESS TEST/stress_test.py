"""
stress_test.py — CLOUUD-BENCH-005: SYNTHETIC stress validation.
Generates 500 labeled event pairs with KNOWN ground truth, runs the
classifier, reports confusion matrix at scale. Also runs a base-rate
simulation: random independent streams, counting chance collisions.
LABEL: all data here is SYNTHETIC. This validates the instrument.
It does NOT satisfy the 30-real-event requirement (OBS-001 §6) —
only observed, human-declared events can do that.
"""
import random, json, time
from synchronicity import Event, classify

random.seed(33)  # reproducible

WORDS = ["meiks sents","let it bi","nait","blu mun","gud morning","storm",
         "star","kaet","dog","fil","fi:l","open dor","klosd dor","ren",
         "sno","fair","warm sun","kold wind","big wev","smol wev"]

def make_case(kind, i):
    t0 = random.randint(0, 10**6)
    if kind == "TRUE":
        w = random.choice(WORDS)
        return (Event("A%din"%i,"text",w,w,t0), Event("B%din"%i,"audio",w,w,t0+random.randint(0,2900)), True, "declared meaning #%d"%i, True)
    if kind == "MISS_TIME":
        w = random.choice(WORDS)
        return (Event("A","text",w,w,t0), Event("B","audio",w,w,t0+random.randint(3100,60000)), True, "meaning", False)
    if kind == "MISS_SIM":
        a,b = random.sample(WORDS,2)
        return (Event("A","text",a,a,t0), Event("B","audio",b,b,t0+500), True, "meaning", False)
    if kind == "MISS_CAUSAL":
        w = random.choice(WORDS)
        return (Event("A","text",w,w,t0), Event("B","echo",w,w,t0+500), False, "meaning", False)
    if kind == "MISS_MEANING":
        w = random.choice(WORDS)
        return (Event("A","text",w,w,t0), Event("B","audio",w,w,t0+500), True, "", False)

kinds = ["TRUE"]*100 + ["MISS_TIME"]*100 + ["MISS_SIM"]*100 + ["MISS_CAUSAL"]*100 + ["MISS_MEANING"]*100
random.shuffle(kinds)
tp=fp=tn=fn=0
for i,k in enumerate(kinds):
    a,b,ci,om,expected = make_case(k,i)
    got = classify(a,b,causally_independent=ci,observer_meaning=om).is_synchronicity
    if expected and got: tp+=1
    elif expected and not got: fn+=1
    elif not expected and got: fp+=1
    else: tn+=1

n=len(kinds)
prec = tp/(tp+fp) if tp+fp else 0; rec = tp/(tp+fn) if tp+fn else 0
print(json.dumps({"benchmark":"CLOUUD-BENCH-005-SYNTHETIC","n":n,
  "confusion":{"TP":tp,"FP":fp,"TN":tn,"FN":fn},
  "precision":round(prec,4),"recall":round(rec,4),
  "accuracy":round((tp+tn)/n,4)},indent=1))

# --- base-rate simulation: chance collisions in random streams ---
trials, window, hits = 2000, 3000, 0
for _ in range(trials):
    s1 = [(random.choice(WORDS), random.randint(0,600000)) for _ in range(20)]
    s2 = [(random.choice(WORDS), random.randint(0,600000)) for _ in range(20)]
    if any(w1==w2 and abs(t1-t2)<=window for w1,t1 in s1 for w2,t2 in s2):
        hits += 1
print(json.dumps({"base_rate_sim":{"trials":trials,
  "streams":"2x20 events/10min, 20-word vocab, 3s window",
  "chance_collision_rate":round(hits/trials,4),
  "lesson":"random streams collide by combinatorics alone — every real hit must be priced against this"}},indent=1))
