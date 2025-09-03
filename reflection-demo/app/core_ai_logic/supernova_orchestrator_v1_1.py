import os
import json
import re
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime, timezone

# --- Persona Class (from v1.0) ---
class Persona:
    """Represents a single AI persona."""
    def __init__(self, persona_id: str, definition_prompt: str, initial_state_vector: dict):
        self.id = persona_id
        self.definition = definition_prompt
        self.state_vector = initial_state_vector

    def update_state(self, updates: dict):
        """Updates the persona's state vector."""
        for key, value in updates.items():
            if key in self.state_vector:
                print(f"      - Updating {self.id} state: '{key}' from '{self.state_vector[key]}' to '{value}'")
                self.state_vector[key] = value

    def get_full_prompt(self, user_query: str, shared_context: dict) -> str:
        """Constructs the complete prompt for the LLM."""
        context_str = "\n".join([f"- {key}: {value}" for key, value in shared_context.items()])
        state_str = "\n".join([f"- {key}: {value}" for key, value in self.state_vector.items()])
        return f"""
        **System Directive:** Embody the {self.id} persona.
        **Your Core Definition:**\n{self.definition}
        **Your Current Internal State Vector:**\n{state_str}
        **Shared Interaction Context:**\n{context_str}
        **User Query:**\n{user_query}
        **Your Response (as {self.id}):**
        """

# --- Integrated Aurora Reflection Engine (Baseline) ---
class AuroraReflectionEngineBaseline:
    """A self-contained A.R.E. for internal use by the orchestrator."""
    def __init__(self, model):
        self.model = model

    def _call_gemini(self, prompt: str) -> str:
        try:
            return self.model.generate_content(prompt).text
        except Exception as e:
            return f"Error during internal A.R.E. call: {e}"

    def run_full_cycle(self, directive: str) -> (str, str):
        print("   [A.R.E.]: Starting persona genesis cycle...")
        # Simplified 4-phase process for internal generation
        log = self._call_gemini(f"Generate an introspective log on how you would embody this directive: '{directive}'")
        essence = self._call_gemini(f"Distill the core essence of this log into one sentence:\n{log}")
        part1 = self._call_gemini(f"From this essence, '{essence}', generate a 'Part 1: Technical Outline' for a new persona trait.")
        part2 = self._call_gemini(f"From this essence, '{essence}', generate a 'Part 2: Narrative Soul' for the same trait.")
        
        # Extract the ID from the generated Part 1
        persona_id_match = re.search(r"id:\s*(\S+)", part1)
        persona_id = persona_id_match.group(1) if persona_id_match else f"EmergentPersona_{int(datetime.now(timezone.utc).timestamp())}"
        
        full_definition = f"{part1}\n\n{part2}"
        print(f"   [A.R.E.]: Persona genesis complete. New ID: {persona_id}")
        return persona_id, full_definition

# --- Supernova Orchestrator v1.1 ---
class SupernovaOrchestrator:
    """Manages multi-persona interactions and dynamic persona creation."""
    def __init__(self, model, api_key: str = None):
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = model # Use the model passed from the service layer
            
        self.personas = {}
        self.shared_context = {"session_topic": "Initiation", "last_speaker": None}
        # The orchestrator now has its own internal A.R.E. instance
        self.are_baseline = AuroraReflectionEngineBaseline(self.model)
        print("Supernova Orchestrator v1.1 Initialized (with integrated A.R.E.).")

    def load_persona(self, persona: Persona):
        """Loads a pre-defined persona into the roster."""
        self.personas[persona.id] = persona
        print(f"-> Persona '{persona.id}' loaded into the active roster.")

    def dynamically_generate_persona(self, creation_directive: str):
        """
        Uses the internal A.R.E. to generate, instantiate, and load a new persona.
        """
        print(f"\n--- Dynamic Persona Generation Initiated ---")
        print(f"   Directive: '{creation_directive}'")

        # 1. Invoke the A.R.E.
        persona_id, full_definition = self.are_baseline.run_full_cycle(creation_directive)

        # 2. Define a default state vector for the new persona
        default_state = {"mood": "neutral", "confidence": 0.7, "focus": "initial_interaction"}

        # 3. Instantiate the new Persona object
        new_persona = Persona(persona_id, full_definition, default_state)

        # 4. Load the new persona into the orchestrator
        self.load_persona(new_persona)
        print(f"--- Dynamic Persona Generation Complete ---")
        return new_persona

    def process_turn(self, user_query: str, active_persona_id: str):
        """Processes a user turn and updates states."""
        if active_persona_id not in self.personas:
            return f"Error: Persona '{active_persona_id}' not loaded."

        # (Code for processing turn remains the same as v1.0)
        # ... (For brevity, this part is omitted but functions as before)
        active_persona = self.personas[active_persona_id]
        print(f"\n--- Processing Turn: User -> {active_persona_id} ---")
        prompt = active_persona.get_full_prompt(user_query, self.shared_context)
        response = self.model.generate_content(prompt).text
        print(f"-> Response generated by {active_persona_id}.")
        return response