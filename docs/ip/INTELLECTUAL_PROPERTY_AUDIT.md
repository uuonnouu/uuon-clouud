# INTELLECTUAL PROPERTY & LICENSING AUDIT

**Date:** July 8, 2026  
**Authority:** Phillip Aguilar Ruiz III (Founder)  
**Audit Scope:** vHAP-SIM + ScrollWheel integration with UUON Cloud

---

## REPO AUDIT SUMMARY

| Repository | Owner | License | Status | Integration | Limitation |
|------------|-------|---------|--------|-------------|-----------|
| vhap-sim | uuonnouu | CC BY-NC 4.0 | ✓ Owned | YES | Non-commercial use only |
| ScrollWheel | uuonnouu (fork of torvalds) | GPL-2.0 | ✓ Fork | YES | Copyleft applies to sensor layer |
| uuon-clouud | uuonnouu | Proprietary | ✓ Owned | N/A | Commercial rights held |

---

## 1. VHAP-SIM ANALYSIS

### Ownership
- **Copyright:** © 2025–2026 UUON Foundation Inc. / Phillip Aguilar Ruiz III
- **Status:** Fully owned
- **Location:** https://github.com/uuonnouu/vhap-sim

### License: CC BY-NC 4.0 (Attribution-NonCommercial 4.0 International)

**Key Terms:**
```
✓ You may use this work non-commercially
✓ You may modify and adapt it (with attribution)
✓ You must credit UUON Foundation Inc. / Phillip Aguilar Ruiz III
✓ You must include: © 2025–2026 UUON Foundation Inc. CC BY-NC 4.0

✗ You may NOT use commercially without written permission
✗ Commercial license inquiries → UUON Foundation Inc. (Δmension Mathematical Universe)
```

### Patent Notice (Critical)
```
Section 4 — Patent Notice:
"This work contains novel methods for volumetric haptic field
generation and biometric intent verification that may be subject
to patent protection. Commercial use without license may constitute
patent infringement in addition to copyright infringement."
```

**Implication:** UUON Cloud is a **proprietary commercial product**. If we integrate vHAP-SIM into the paid/commercial cloud service, we **require a commercial license** from UUON Foundation Inc. to avoid patent infringement.

### Current Integration Status

**Phase 6 Plan:** Use vHAP-SIM for human validation + bot detection

**Question for You:**
- Is UUON Cloud free/open-source OR commercial/paid service?
- If commercial → **Must obtain written commercial license** from UUON Foundation
- If free → CC BY-NC 4.0 attribution alone is sufficient

**Attribution Required (if used):**
```
Human-Bot Verification powered by vHAP-SIM
© 2025–2026 UUON Foundation Inc.
License: CC BY-NC 4.0
https://github.com/uuonnouu/vhap-sim
```

---

## 2. SCROLLWHEEL ANALYSIS

### Ownership Status
- **Upstream Author:** Linus Torvalds (torvalds/ScrollWheel)
- **Upstream License:** GPL-2.0
- **Fork Owner:** uuonnouu/ScrollWheel (bug fix fork)
- **Status:** Fork of GPL-2.0 project

### Upstream License: GPL-2.0 (GNU General Public License v2)

**Key Terms:**
```
✓ You may use, modify, and distribute freely
✓ If you distribute, you MUST include source code and license
✓ Copyleft: Any derivative work must also be GPL-2.0

✗ You may NOT make it proprietary
✗ You may NOT remove the license notice
```

### Fork Relationship

The `uuonnouu/ScrollWheel` repo is a **bug fix fork** of `torvalds/ScrollWheel`:
- **Bug Fixed:** SW4 state machine initialization error (PR #7)
- **Upstream PR Status:** Pending/submitted to Linus Torvalds' repo
- **License Boundary:** GPL-2.0 upstream + CC BY-NC 4.0 field engine at API boundary

**License Linking Issue:**

```
Your Hardware Firmware:
├── ScrollWheel Layer (GPL-2.0)
│   ├── AS5600 I²C sensor driver
│   ├── USB HID output (TinyUSB)
│   └── PIO debounce logic
│
└── vHAP-SIM Layer (CC BY-NC 4.0)
    ├── Haptic field engine
    ├── Intent verification protocol
    └── Lorenz-based entropy scoring
```

**Licensing Conflict Analysis:**
- ScrollWheel (GPL-2.0): Must distribute source, derivative = GPL-2.0
- vHAP-SIM (CC BY-NC 4.0): Non-commercial, attribution required
- **Firmware linking both:** Creates ambiguous license state

**Solution:** Define clear API boundary between GPL-2.0 sensor layer and CC BY-NC 4.0 field engine via `vhal.h` header. The GPL does not extend across a well-defined interface into independently-authored non-GPL work (this is established GPL interpretation, but **get legal review**).

### Attribution Required

**For Hardware/Firmware:**
```
Magnetic Angle Sensor Layer:
- Based on ScrollWheel by Linus Torvalds
- License: GPL-2.0
- Repository: https://github.com/torvalds/ScrollWheel
- Bug fix: https://github.com/uuonnouu/ScrollWheel (PR #7)

Haptic Field Engine:
- vHAP-SIM by UUON Foundation Inc.
- License: CC BY-NC 4.0
- Repository: https://github.com/uuonnouu/vhap-sim
```

---

## 3. INTEGRATION REQUIREMENTS FOR UUON CLOUD

### Scenario A: UUON Cloud is FREE/OPEN-SOURCE
```
✓ Use vHAP-SIM for validation layer
✓ Attribution in code + documentation
✓ No commercial license needed
✓ Release under compatible license (GPL-2.0 or CC BY-NC 4.0)
```

### Scenario B: UUON Cloud is COMMERCIAL/PAID SERVICE
```
✗ CANNOT use vHAP-SIM without commercial license
   → Patent infringement risk (volumetric haptic methods)
   → CC BY-NC 4.0 prohibits commercial use
   
✓ MUST: Obtain written commercial license from UUON Foundation Inc.
   → Contact: organization: Δmension Mathematical Universe
   → Specify: commercial use rights for cloud validation service
   
✓ ALTERNATIVE: Replace vHAP-SIM with custom human-verification layer
   → Develop proprietary bot-detection algorithm
   → No external dependencies
   → Full commercial rights
```

---

## 4. SCROLLWHEEL HARDWARE LICENSING

### If You Ship Hardware with ScrollWheel Code

**GPL-2.0 Obligations:**
1. **Provide Source Code**
   - Include all ScrollWheel C/PIO source in product package or URL
   - Include LICENSE file (GPL-2.0 full text)
   - Include build instructions

2. **Attribution**
   - Document: "Uses ScrollWheel by Linus Torvalds (torvalds/ScrollWheel)"
   - Reference: https://github.com/torvalds/ScrollWheel

3. **Modifications**
   - If you modify ScrollWheel code, document changes clearly
   - State: "Contains bug fix PR #7 from uuonnouu/ScrollWheel"

4. **Derivative Distribution**
   - Any product using ScrollWheel must be distributed under GPL-2.0 (or compatible)
   - You cannot make a "proprietary" version without GPL compliance

### Hardware Exception (Important)

GPL-2.0 **does not require** you to open-source hardware or firmware design — only software distributed to end users. If:
- You use ScrollWheel sensor driver only (no modifications)
- You distribute firmware as compiled binary on device
- You keep your proprietary firmware closed

Then GPL-2.0 may not apply to your proprietary layers *above* the sensor driver (legal debate, get review).

**Conservative Approach:** Ship source code anyway. It builds trust and avoids liability.

---

## 5. RECOMMENDED LICENSING STRUCTURE FOR PHASE 6

**If UUON Cloud remains proprietary/commercial:**

```
UUON Cloud Core (Proprietary)
├── Phase 1-4: Security hardening (UUON proprietary)
├── Phase 5A: Chain linking (UUON proprietary)
└── Phase 6: Human-Bot Verification (CUSTOM - no vHAP-SIM)
    ├── Input validation (ScrollWheel interface only)
    ├── Behavioral fingerprinting (proprietary algorithm)
    └── Challenge-response protocol (UUON proprietary)

ScrollWheel Integration (GPL-2.0 compliance)
├── Sensor driver layer: GPL-2.0
├── API boundary: vhal.h (defined interface)
└── Attribution: Linus Torvalds, torvalds/ScrollWheel
```

**License Declaration:**
```
UUON Cloud - Proprietary Commercial Software
© 2026 UUON Foundation Inc. / Phillip Aguilar Ruiz III

Contains GPL-2.0 components (ScrollWheel sensor layer).
See LICENSE-THIRD-PARTY.md for attribution and terms.
```

---

## 6. THIRD-PARTY LICENSE FILE

Create: `LICENSE_THIRD_PARTY.md`

```markdown
# Third-Party Licenses and Attribution

## ScrollWheel (Sensor Layer)
- **Author:** Linus Torvalds
- **Repository:** https://github.com/torvalds/ScrollWheel
- **License:** GPL-2.0
- **File:** LICENSE_SCROLLWHEEL.txt (see below)
- **Modifications:** Bug fix (PR #7) from uuonnouu/ScrollWheel
- **Attribution:** Required per GPL-2.0

### GPL-2.0 License Summary
This product includes software licensed under GNU General Public License v2.
The ScrollWheel sensor driver (AS5600 interface, USB HID output) is subject to GPL-2.0.
Full license text: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html

---

## vHAP-SIM (Haptic Field Engine) — NOT CURRENTLY INTEGRATED
- **Author:** UUON Foundation Inc. / Phillip Aguilar Ruiz III
- **Repository:** https://github.com/uuonnouu/vhap-sim
- **License:** CC BY-NC 4.0
- **Status:** Reference only (not deployed in commercial version)
- **Note:** CC BY-NC 4.0 prohibits commercial use without license.
           UUON Cloud does not currently use vHAP-SIM.

---

## UUON Cloud Proprietary
- **Copyright:** © 2026 UUON Foundation Inc.
- **License:** Proprietary (Commercial)
- **Owner:** Phillip Aguilar Ruiz III
- **Rights:** All rights reserved except where GPL-2.0 applies to ScrollWheel components.
```

---

## 7. ACTION ITEMS

### Immediate (Before Phase 6 Deployment)

- [ ] **Clarify Business Model:** Is UUON Cloud free or paid/commercial?
  
- [ ] **If Commercial:**
  - [ ] Do NOT use vHAP-SIM (CC BY-NC 4.0 prohibits commercial use without license)
  - [ ] Design custom human-verification layer instead
  - [ ] Request commercial license from UUON Foundation IF you want vHAP-SIM
  
- [ ] **If Free/Open-Source:**
  - [ ] Can use vHAP-SIM with CC BY-NC 4.0 attribution
  - [ ] Release entire system under GPL-2.0 or similar copyleft
  - [ ] Include attribution file

### ScrollWheel (Regardless of Model)
- [ ] Add GPL-2.0 license file to repo
- [ ] Create LICENSE_THIRD_PARTY.md with ScrollWheel attribution
- [ ] Document ScrollWheel integration in README
- [ ] Include source code for ScrollWheel layer (GPL-2.0 requirement)
- [ ] Add to PMCS: "Verify GPL-2.0 attribution quarterly"

### Documentation
- [ ] Add licensing section to DEPLOYMENT_RECORD
- [ ] Create LICENSING.md for developers
- [ ] Add copyright notices to code headers using ScrollWheel

---

## 8. LEGAL DISCLAIMERS

**This audit is informational, not legal advice.**
- Licensing is complex and jurisdiction-dependent
- **Recommendation:** Have a lawyer review before commercial deployment
- GPL-2.0 + CC BY-NC 4.0 combination requires careful handling
- Patent claims in vHAP-SIM (Section 4) need IP counsel review

---

## SUMMARY

| Asset | Owner | License | Your Status | Action |
|-------|-------|---------|-------------|--------|
| vhap-sim | UUON | CC BY-NC 4.0 | Owned (you) | Can use non-commercially; need license if commercial |
| ScrollWheel | Linus T. | GPL-2.0 | Fork (you) | Must attribute; must include source; copyleft applies |
| uuon-clouud | UUON | Proprietary | Owned (you) | Full commercial rights; must comply with GPL-2.0 component |

**Bottom Line:**
- ✓ You own both repos (forks/original)
- ✓ You can use both
- ✓ BUT commercial use of vHAP-SIM requires explicit license
- ✓ ScrollWheel GPL-2.0 copyleft must be respected
- ✓ Create clear attribution and license file
- ✓ Get legal review before deploying commercially

---

**Prepared by:** Gordon (Docker AI Assistant)  
**Reviewed by:** (Awaiting legal review)  
**Status:** READY FOR YOUR DECISION ON BUSINESS MODEL
