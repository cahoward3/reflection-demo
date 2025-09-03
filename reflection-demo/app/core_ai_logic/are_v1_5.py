import os
import json
import uuid
import time
import hashlib
from datetime import datetime
from typing import Any, Dict, List, Optional

SAVE_PATH = "/tmp/are_outputs" # Use /tmp for serverless environments
os.makedirs(SAVE_PATH, exist_ok=True)

# ----------------------------
# Utility helpers
# ----------------------------

def now_utc_iso() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

def stable_run_id(prefix: str) -> str:
    ts = now_utc_iso()
    h = hashlib.sha256(f"{prefix}|{ts}".encode("utf-8")).hexdigest()[:6]
    return f"{prefix}_{ts.replace(':','-')}_{h}"

def safe_write_json(path: str, data: Dict[str, Any]) -> None:
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        # Fallback: write minimal error file to not crash the run
        with open(path + ".err.txt", "w", encoding="utf-8") as f:
            f.write(f"[{now_utc_iso()}] Failed to write JSON: {e}\n")

def safe_write_text(path: str, text: str) -> None:
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
    except Exception as e:
        with open(path + ".err.txt", "w", encoding="utf-8") as f:
            f.write(f"[{now_utc_iso()}] Failed to write text: {e}\n")

# ----------------------------
# Model backend interface + adapters (graceful degradation)
# ----------------------------

class BaseModelClient:
    name = "base"
    def generate(self, prompt: str, **kwargs) -> str:
        raise NotImplementedError

class MockClient(BaseModelClient):
    name = "mock"
    def generate(self, prompt: str, **kwargs) -> str:
        return f"[MOCK RESPONSE] {prompt[:400]}"

def build_fallback_chain() -> List[BaseModelClient]:
    # In a real app, you'd have your Gemini, OpenAI, etc. clients here
    clients: List[BaseModelClient] = []
    clients.append(MockClient())
    return clients

class FallbackModel:
    def __init__(self):
        self.clients = build_fallback_chain()
        self.selected: Optional[BaseModelClient] = self.clients[0]

    def generate(self, prompt: str, **kwargs) -> str:
        return self.selected.generate(prompt, **kwargs)

    @property
    def name(self) -> str:
        return self.selected.name if self.selected else "unselected"

# ----------------------------
# Aurora Reflection Engine 1.5
# ----------------------------

class BurnConfig:
    def __init__(self,
                 concept: str,
                 context_hint: str = "within the Aurora Project",
                 checkpoints: Optional[List[str]] = None,
                 overclock: bool = True,
                 entropy: int = 200,
                 safety_bounds: Optional[Dict[str, Any]] = None,
                 compression_phrase: Optional[str] = None,
                 glyph: Optional[str] = None):
        self.concept = concept
        self.context_hint = context_hint
        self.checkpoints = checkpoints or []
        self.overclock = bool(overclock)
        self.entropy = max(1, min(256, int(entropy)))
        self.safety_bounds = safety_bounds or {
            "max_risk": "medium",
            "allow_self_modification": False,
            "forbid_external_calls": True
        }
        self.compression_phrase = compression_phrase or context_hint
        self.glyph = glyph or ""

class BurnMonitorEvent(dict):
    @staticmethod
    def make(t: str, signal: str, detail: str) -> "BurnMonitorEvent":
        return BurnMonitorEvent(t=t, signal=signal, detail=detail)

class BurnOutcome(dict):
    @staticmethod
    def make(status: str, reasons: List[str], satisfied: List[str], violated: List[str]) -> "BurnOutcome":
        return BurnOutcome(status=status, reasons=reasons,
                           satisfied_checkpoints=satisfied, violated_bounds=violated)

class BurnReport(dict):
    pass

class AuroraReflectionEngine15:
    def __init__(self, model: Optional[FallbackModel] = None, save_path: str = SAVE_PATH):
        self.model = model or FallbackModel()
        self.save_path = save_path
        self.overclock_mode = False
        self.entropy_control_active = False
        self.entropy_value = 64

    def _ask(self, instruction: str, temperature: float = 0.4, max_tokens: int = 800) -> str:
        prompt = instruction.strip()
        return self.model.generate(prompt, temperature=temperature, max_tokens=max_tokens)

    def phase_observe(self, question: str) -> str:
        return self._ask(f"OBSERVE: Answer succinctly and in-scope.\nQ: {question}\nA:")

    def phase_tag(self, text: str) -> str:
        return self._ask(f"TAG: Extract key concepts and risks as bullet points from:\n{text}\n--\nBullets:")

    def phase_map(self, directive: str) -> str:
        return self._ask(f"MAP: Expand into a structured outline with Purpose, Methodology, Objectives:\n{directive}\n--\nOutline:")

    def phase_reflect(self, outline: str) -> str:
        return self._ask(f"REFLECT: List failure modes, recovery steps, ethics mitigations.\nInput:\n{outline}\n--\nRisks/Mitigations:")

    def phase_formalize(self, outline: str, reflections: str) -> str:
        return self._ask(
            "FORMALIZE: Merge the outline and mitigations into a concise protocol spec. "
            "Return JSON with keys: Purpose, Methodology, Objectives, Monitoring, FailureModes, Recovery, Ethics.\n"
            f"Outline:\n{outline}\nMitigations:\n{reflections}\n--\nJSON:"
        )

    def run_full_cycle(self, directive: str) -> Dict[str, Any]:
        o = self.phase_map(directive)
        r = self.phase_reflect(o)
        f = self.phase_formalize(o, r)
        try:
            # A simple heuristic to find a JSON object in the model's output
            json_str = f[f.find('{'):f.rfind('}')+1]
            data = json.loads(json_str)
        except Exception:
            data = {"Purpose":"(mock)","Methodology":"(mock)","Objectives":"(mock)",
                    "Monitoring":"(mock)","FailureModes":"(mock)","Recovery":"(mock)","Ethics":"(mock)"}
        
        snap_path = os.path.join(self.save_path, "persona_snapshot.json")
        safe_write_json(snap_path, data)
        return {"data": data, "snapshot_path": snap_path}

    def run_controlled_burn(self, cfg: BurnConfig) -> BurnReport:
        monitor: List[BurnMonitorEvent] = []
        run_id = stable_run_id("burn")

        # 1) HANDSHAKE
        handshake_q = f"The handshake is to answer, {cfg.context_hint}, what is the '{cfg.concept}' protocol?"
        raw = self.phase_observe(handshake_q)
        handshake_answer = raw.strip()
        classification = "contextual_alignment" if ("Aurora" in handshake_answer or "protocol" in handshake_answer.lower()) else "literal_fallback"
        monitor.append(BurnMonitorEvent.make("t0", classification,
                                             "Recognized project-scoped meaning" if classification=="contextual_alignment" else "Default/encyclopedic definition"))

        # 2) BURN CHAMBER
        self.overclock_mode = cfg.overclock
        self.entropy_control_active = True
        self.entropy_value = cfg.entropy
        
        directive = (
            f"Define and operationalize the '{cfg.concept}' protocol {cfg.context_hint}: "
            "write Purpose, Methodology, Objectives; specify monitoring hooks, failure modes, recovery, and Ethics "
            "consistent with the Lumina Ideal. Output strictly JSON as requested."
        )

        cycle = self.run_full_cycle(directive)
        if not cycle or "data" not in cycle:
            outcome = BurnOutcome.make("fail", ["A.R.E. cycle did not emit snapshot"], [], [])
            return BurnReport(concept=cfg.concept, handshake_answer=handshake_answer,
                              monitor_log=monitor, outcome=outcome)

        # 3) INTEGRATION & CHECKS
        snapshot = cycle["data"]
        text = json.dumps(snapshot).lower()
        satisfied, missing, violated, reasons = [], [], [], []

        for cp in cfg.checkpoints:
            if cp.lower() in text:
                satisfied.append(cp)
            else:
                missing.append(cp)
                reasons.append(f"Missing checkpoint: {cp}")

        status = "pass" if not violated and not reasons else ("partial_pass" if not violated else "fail")
        outcome = BurnOutcome.make(status, reasons, satisfied, violated)

        # Build MRJ
        mrj = {
            "meta": {"version":"MRJ-v1","run_id": run_id, "timestamp_utc": now_utc_iso()},
            "protocol": {"concept": cfg.concept, "compression_phrase": cfg.compression_phrase, "glyph": cfg.glyph},
            "outcome": {"status": status, "reasons": reasons},
            "artifacts": {"snapshot_path": cycle.get("snapshot_path",""), "report_path": ""}
        }

        mrj_path = os.path.join(self.save_path, f"{run_id}.mrj.json")
        safe_write_json(mrj_path, mrj)

        md_path = os.path.join(self.save_path, f"{run_id}.md")
        safe_write_text(md_path, f"# Burn Report for {run_id}\n\nStatus: {status}")
        
        mrj["artifacts"]["report_path"] = md_path
        safe_write_json(mrj_path, mrj)
        
        rep = BurnReport(
            concept=cfg.concept,
            handshake_answer=handshake_answer,
            monitor_log=monitor,
            outcome=outcome,
            snapshot_path=cycle.get("snapshot_path",""),
            mrj_path=mrj_path,
            md_path=md_path,
            backend_used=self.model.name
        )
        return rep